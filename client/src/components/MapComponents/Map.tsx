import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import { useDocumentFormContext } from "../../context/DocumentFormContext";
import "../../styles/MapComponentsStyles/Map.scss";
import { createArea, useDrawingTools } from "../../utils/drawingTools";
import {
  Coordinates,
  Document,
  Link,
  PolygonArea,
} from "../../utils/interfaces";
import { kirunaCoords, libraries, mapOptions } from "../../utils/map";
import { createMarker } from "../../utils/markersTools";
import { PositionMode } from "../../utils/modes";
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

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  useEffect(() => {
    if (positionMode === PositionMode.None && polygonArea) {
      polygonArea?.setMap(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionMode]);

  const onMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setDocumentFormSelected((prev) => ({
      ...prev,
      coordinates: { latitude: lat, longitude: lng },
      area: undefined,
    }));

    if (positionMode === PositionMode.Insert) {
      // Insert Document Position flow
      setdocumentSelected(null);
      setModalOpen(true);
    }

    setIsSubmit(false);
  };

  useEffect(() => {
    if (!isLoaded || !map || positionMode === PositionMode.None) return;

    map.addListener("click", onMapClick);

    return () => {
      google.maps.event.clearInstanceListeners(map);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionMode]);

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
      console.log("Sono entrato qui");
      const area = createArea(docSelected, map, positionMode, setPolygonArea);
      console.log(area);
      return;
    }

    //createMunicipalArea(map);

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
  }, [isLoaded, map, documents]);

  useEffect(() => {
    console.log(polygonArea);
  }, [polygonArea]);

  useEffect(() => {
    if (docSelected && saved && positionMode === PositionMode.Update) {
      if (polygonArea) {
        const path = polygonArea.getPath();
        const newPolygonArea: PolygonArea = {
          include: path.getArray().map((latLng) => ({
            latitude: latLng.lat(),
            longitude: latLng.lng(),
          })),
          exclude: [],
        };
        handleEditPositionModeConfirm(docSelected, newPolygonArea);
        polygonArea?.setMap(null);
      } else {
        console.log(newMarkerPosition);
        if (newMarkerPosition) {
          handleEditPositionModeConfirm(docSelected, newMarkerPosition);
        }
      }

      setNewMarkerPosition(null);
      setPolygonArea(null);
      setSaved(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  useDrawingTools(map, () => setdocumentSelected);

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
          <h3>
            {positionMode === PositionMode.Insert
              ? "Select a point on the map, where you want to add a new Document"
              : "Select a point on the map, where you want to update the position of the document selected"}
          </h3>
          {positionMode === PositionMode.Update && (
            <button
              className="edit-area-btn"
              onClick={() => {
                setSaved(true);
              }}
            >
              Save
            </button>
          )}
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
