import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import { useDocumentFormContext } from "../../context/DocumentFormContext";
import "../../styles/MapComponentsStyles/MapComponent.scss";
import { useDrawingTools } from "../../utils/drawingTools";
import {
  Coordinates,
  Document,
  Link,
  PolygonArea,
} from "../../utils/interfaces";
import { kirunaCoords, libraries, mapOptions } from "../../utils/map";
import { createMarker } from "../../utils/markersTools";
import { PositionMode } from "../../utils/modes";
import { createMunicipalArea } from "../../utils/municipalArea";
import { createArea } from "../../utils/polygonsTools";
import MapTypeSelector from "../MapTypeSelector";

interface MapComponentProps {
  documents: Document[];
  docSelected: Document | null;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setdocumentSelected: Dispatch<SetStateAction<Document | null>>;
}

const MapComponent: FC<MapComponentProps> = (props) => {
  const { documents, docSelected, setSidebarOpen, setdocumentSelected } = props;
  const {
    visualLinks,
    positionMode,
    setModalOpen,
    handleEditPositionModeConfirm,
  } = useAppContext();
  const { setDocumentFormSelected, setIsSubmit } = useDocumentFormContext();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapType, setMapType] = useState<string>("satellite");
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);
  const [newMarkerPosition, setNewMarkerPosition] =
    useState<Coordinates | null>(null);
  const [saved, setSaved] = useState(false);
  const [polygonArea, setPolygonArea] = useState<google.maps.Polygon | null>(
    null,
  );
  const [municipalArea, setMunicipalArea] = useState<
    google.maps.Polygon[] | undefined
  >(undefined);
  const [drawingMode, setDrawingMode] = useState<string>("");
  const [drawingManager, setDrawingManager] = useState<
    google.maps.drawing.DrawingManager | undefined
  >(undefined);
  const [drawnPolygon, setDrawnPolygon] = useState<
    google.maps.Polygon | undefined
  >(undefined);
  const [drawnMarker, setDrawnMarker] = useState<
    google.maps.Marker | undefined
  >(undefined);
  const [activeButton, setActiveButton] = useState<string>("");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const isSelectedOrLinked = (doc: Document) => {
    const linkedIDs: number[] =
      docSelected?.links?.map((link: Link) => link.targetDocumentId) ?? [];
    if (doc.id === docSelected?.id) return true;
    if (linkedIDs.includes(doc.id)) return true;
    return false;
  };

  const clearMarkers = (doc?: Document) => {
    if (doc) {
      documents.filter((document) => document.id === doc.id);
    }
    markers.forEach((marker) => (marker.map = null));
  };

  useEffect(() => {
    if (!isLoaded || !map || positionMode === PositionMode.Insert) {
      clearMarkers();
      return;
    }

    if (positionMode === PositionMode.Update && docSelected?.area) {
      const area = createArea(docSelected, map, positionMode);
      setPolygonArea(area);
      return;
    }

    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = documents
      .filter((doc) => {
        if (positionMode === PositionMode.Update) {
          return doc.id === docSelected?.id;
        }
        return doc.coordinates || doc.area;
      })
      .filter((doc) => (visualLinks ? isSelectedOrLinked(doc) : true))
      .map((doc) =>
        createMarker(
          doc,
          visualLinks && doc.id !== docSelected?.id,
          map,
          positionMode,
          setNewMarkerPosition,
          setdocumentSelected,
          setSidebarOpen,
        ),
      );

    clearMarkers();

    const markerCluster = new MarkerClusterer({
      markers: newMarkers,
      map,
      renderer: {
        render: ({ count, position }) => {
          return new google.maps.marker.AdvancedMarkerElement({
            position,
            title: count.toString(),
            content: (() => {
              const div = document.createElement("div");
              div.className = "cluster-icon";
              div.textContent = count.toString();
              return div;
            })(),
          });
        },
      },
      onClusterClick: (event, cluster, map) => {
        if (cluster.bounds) {
          const currentZoom = map.getZoom();

          const newZoom = Math.min(
            (currentZoom ?? 0) + 1,
            (map.getZoom() ?? 0) + 2,
          ); // Set new zoom level, (default zooms is the maximum zoom level)

          map.fitBounds(cluster.bounds);
          map.setZoom(newZoom);
        }
      },
    });

    setMarkers(newMarkers);

    if (visualLinks && newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        if (marker.position) {
          bounds.extend(marker.position);
        }
      });
      map.fitBounds(bounds);
    }

    return () => {
      markerCluster.clearMarkers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map, documents]);

  //TODO: Check all the states that are unused from now
  useEffect(() => {
    if (positionMode === PositionMode.None) {
      if (municipalArea) {
        municipalArea?.forEach((area) => area.setMap(null));
      }
      drawnPolygon?.setMap(null);
      drawnMarker?.setMap(null);
      drawingManager?.setMap(null);
      setActiveButton("");
      polygonArea?.setMap(null);
      setNewMarkerPosition(null);
      setDrawnMarker(undefined);
      setDrawnPolygon(undefined);
      setPolygonArea(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionMode]);

  useEffect(() => {
    console.log(docSelected, saved, positionMode);
    if (saved && positionMode !== PositionMode.None) {
      if (positionMode === PositionMode.Update && docSelected) {
        if (polygonArea) {
          const includePath = polygonArea.getPath();
          const excludePaths = polygonArea.getPaths().getArray().slice(1);

          // Creazione del nuovo oggetto PolygonArea
          const newPolygonArea: PolygonArea = {
            include: includePath.getArray().map((latLng) => ({
              latitude: latLng.lat(),
              longitude: latLng.lng(),
            })),
            exclude: excludePaths.map((excludePath) =>
              excludePath.getArray().map((latLng) => ({
                latitude: latLng.lat(),
                longitude: latLng.lng(),
              })),
            ),
          };

          // Conferma modifica posizione
          handleEditPositionModeConfirm(docSelected, newPolygonArea);
        } else if (newMarkerPosition) {
          handleEditPositionModeConfirm(docSelected, newMarkerPosition);
        }
      } else {
        if (drawnPolygon && drawingManager) {
          const paths = drawnPolygon.getPaths().getArray();
          const include: Coordinates[] = [];
          const exclude: Coordinates[][] = [];
          paths.forEach((path, index) => {
            const pathArray = path.getArray().map((latLng) => ({
              latitude: latLng.lat(),
              longitude: latLng.lng(),
            }));
            // First path is the main polygon (included area)
            if (index === 0) {
              include.push(...pathArray);
            } else {
              // Subsequent paths are holes (excluded areas)
              exclude.push(pathArray);
            }
          });
          // Create the new PolygonArea structure
          const newPolygonArea: PolygonArea = {
            include,
            exclude,
          };
          // Update the document form state with the new area
          setDocumentFormSelected((prev) => ({
            ...prev,
            coordinates: undefined,
            area: newPolygonArea,
          }));
          // Finalizing the drawing process
          drawingManager.setDrawingMode(null);
          setdocumentSelected(null);
          setModalOpen(true);
          drawnPolygon.setMap(null);
        } else if (drawnMarker && drawingManager) {
          const latLng = drawnMarker.getPosition();
          if (!latLng) return;

          const lat = latLng.lat();
          const lng = latLng.lng();

          setDocumentFormSelected((prev) => ({
            ...prev,
            coordinates: { latitude: lat, longitude: lng },
            area: undefined,
          }));

          if (positionMode === PositionMode.Insert) {
            setdocumentSelected(null);
            setModalOpen(true);
          }

          setIsSubmit(false);
        } else {
          handleMunicipalAreaButton();
        }
      }
    }
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  useDrawingTools(
    map,
    setDrawingManager,
    setDrawnPolygon,
    setDrawnMarker,
    setdocumentSelected,
  );

  useEffect(() => {
    if (municipalArea && municipalArea.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      municipalArea.forEach((polygon) => {
        const paths = polygon.getPaths();
        paths.forEach((path) => {
          const coordinates = path.getArray();
          coordinates.forEach((latLng) => bounds.extend(latLng));
        });
      });

      // Adatta la mappa ai confini calcolati
      map?.fitBounds(bounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [municipalArea]);

  const handleMunicipalAreaButton = () => {
    if (municipalArea) {
      // Trasforma municipalArea in un PolygonArea
      const newPolygonArea: PolygonArea = {
        include: [],
        exclude: [],
      };

      municipalArea.forEach((polygon, i) => {
        const paths = polygon.getPaths(); // Ottiene i percorsi (outer + inner)

        if (i === 16) {
          paths.forEach((path, j) => {
            const coordinates = path.getArray().map((latLng) => ({
              latitude: latLng.lat(),
              longitude: latLng.lng(),
            }));

            if (i === 16 && j === 0) {
              console.log(coordinates);
              // Primo percorso: include
              newPolygonArea.include = coordinates;
            } else {
              // Percorsi successivi: exclude
              newPolygonArea.exclude.push(coordinates);
            }
          });
        }
      });
      // Aggiorna il documento selezionato con l'area calcolata
      setDocumentFormSelected((prev) => ({
        ...prev,
        coordinates: undefined,
        area: newPolygonArea,
      }));

      if (positionMode === PositionMode.Insert) {
        // Inserimento nuovo documento
        setdocumentSelected(null);
        setModalOpen(true);
      }
      municipalArea?.forEach((area) => {
        area.setMap(null);
      });
      setIsSubmit(false);
      setMunicipalArea(undefined);
    }
  };

  return isLoaded ? (
    <section id="map">
      <MapTypeSelector mapType={mapType} setMapType={setMapType} />
      {positionMode !== PositionMode.None && (
        <div className="insert-mode">
          <h2>
            {positionMode === PositionMode.Insert
              ? "Insert Mode"
              : "Update Position"}
          </h2>
          {positionMode === PositionMode.Insert && (
            <h3>
              {drawingMode === "marker"
                ? "Select a point on the map, where you want to add a new Document"
                : "Draw a polygon on the map, where you want to add a new Document"}
            </h3>
          )}
          {positionMode === PositionMode.Update && (
            <h3>
              {drawingMode === "marker"
                ? "Select a point on the map, where you want to update the position of the document selected"
                : "Draw a polygon on the map, where you want to update the position of the document selected"}
            </h3>
          )}
          {(positionMode === PositionMode.Update ||
            positionMode === PositionMode.Insert) && (
            <button
              className="edit-area-btn"
              onClick={() => {
                console.log("Ho premuto saved");
                setSaved(true);
              }}
            >
              Save
            </button>
          )}
        </div>
      )}

      {positionMode === PositionMode.Insert && (
        <div className="drawing-controls">
          <button
            id="municipal-btn"
            className={activeButton === "municipal-btn" ? "active" : ""}
            onClick={() => {
              setActiveButton("municipal-btn");
              if (map) {
                drawnPolygon?.setMap(null);
                drawnMarker?.setMap(null);
                const municipalPolygons = createMunicipalArea(map);
                setMunicipalArea(municipalPolygons);
              }
            }}
          >
            <div className="municipal-container">
              <span className="material-symbols-outlined">location_city</span>
              <h4>Municipal Area</h4>
            </div>
          </button>
          <button
            id="polygon-btn"
            className={activeButton === "polygon-btn" ? "active" : ""}
            onClick={() => {
              setActiveButton("polygon-btn");
              if (municipalArea) {
                municipalArea?.forEach((area) => area.setMap(null));
                setMunicipalArea(undefined);
              }
              setDrawingMode("polygon");
            }}
          >
            <div className="polygon-container">
              <span className="material-symbols-outlined">polyline</span>
              <h4>{drawnPolygon ? "Add a Hole" : "Polygon"}</h4>
            </div>
          </button>
          <button
            id="marker-btn"
            className={activeButton === "marker-btn" ? "active" : ""}
            onClick={() => {
              setActiveButton("marker-btn");
              if (municipalArea) {
                municipalArea?.forEach((area) => area.setMap(null));
                setMunicipalArea(undefined);
              }
              setDrawingMode("marker");
            }}
          >
            <div className="marker-container">
              <span className="material-symbols-outlined">explore_nearby</span>
              <h4>Marker</h4>
            </div>
          </button>
        </div>
      )}
      <GoogleMap
        id="google-map"
        zoom={11}
        options={{
          ...mapOptions,
          mapTypeId: mapType,
          mapTypeControlOptions: {
            ...mapOptions.mapTypeControlOptions,
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          },
        }}
        center={kirunaCoords}
        onLoad={setMap}
      />
    </section>
  ) : (
    <div>Loading...</div>
  );
};

export default MapComponent;
