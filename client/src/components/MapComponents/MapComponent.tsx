import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import "../../App";
import { useAppContext } from "../../context/appContext";
import { useDocumentFormContext } from "../../context/DocumentFormContext";
import "../../styles/MapComponentsStyles/MapComponent.scss";
import { AlertType } from "../../utils/alertType";
import {
  handleClusterClick,
  renderClusterMarker,
} from "../../utils/clusterTools";
import { rewindRing, useDrawingTools } from "../../utils/drawingTools";
import {
  Coordinates,
  CustomMarker,
  Document,
  Link,
  PolygonArea,
} from "../../utils/interfaces";
import { kirunaCoords, libraries, mapOptions } from "../../utils/map";
import { createMarker } from "../../utils/markersTools";
import { PositionMode } from "../../utils/modes";
import { createArea } from "../../utils/polygonsTools";
import DrawingControls from "../DrawingControls";
import MapTypeSelector from "../MapTypeSelector";

interface MapComponentProps {
  documents: Document[];
  docSelected: Document | null;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setdocumentSelected: Dispatch<SetStateAction<Document | null>>;
  setShowTooltipUploads: Dispatch<SetStateAction<boolean>>;
}

const MapComponent: FC<MapComponentProps> = (props) => {
  const {
    documents,
    docSelected,
    setSidebarOpen,
    setdocumentSelected,
    setShowTooltipUploads,
  } = props;
  const {
    visualLinks,
    positionMode,
    alertRef,
    setModalOpen,
    handleEditPositionModeConfirm,
  } = useAppContext();
  const { setDocumentFormSelected, setIsSubmit } = useDocumentFormContext();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapType, setMapType] = useState<string>("satellite");
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);
  const previousPolygonRef = useRef<google.maps.Polygon | undefined>(undefined);
  const previousMarkerRef = useRef<CustomMarker | undefined>(undefined);
  const previousClusterElement = useRef<HTMLDivElement | undefined>(undefined);
  const [lastSelectedElement, setLastSelectedElement] = useState<string>("");
  const [saved, setSaved] = useState(false);
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
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null,
  );

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  useEffect(() => {
    if (!map || !isLoaded || !docSelected) {
      drawnMarker?.setMap(null);
      drawnPolygon?.setMap(null);
      setDrawnPolygon(undefined);
      setDrawnMarker(undefined);
      previousClusterElement?.current?.classList.remove("selected");
      if (previousMarkerRef.current) {
        const prevMarkerContent = previousMarkerRef.current
          .content as HTMLElement;
        prevMarkerContent.classList.remove("iytig");
      }
    }
  }, [docSelected]);

  useEffect(() => {
    if (!map || !isLoaded || !infoWindow) return;
    map.addListener("click", () => {
      infoWindow.close();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoWindow]);

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
    if (
      !isLoaded ||
      !map ||
      (positionMode === PositionMode.Insert && drawingMode !== "existing")
    ) {
      clearMarkers();
      return;
    }

    if (positionMode === PositionMode.Update && docSelected?.area) {
      const area = createArea(docSelected, map, positionMode);
      if (area) {
        const paths = area.getPaths();
        const adjustedPaths = new google.maps.MVCArray(
          paths.getArray().map((path, index) => {
            const rewindClockwise = index === 0;
            return new google.maps.MVCArray(
              rewindRing(path.getArray(), rewindClockwise),
            );
          }),
        );
        area.setPaths(adjustedPaths);
        setDrawnPolygon(area);
      }
      return;
    }

    const newMarkers: CustomMarker[] = documents
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
          drawingMode,
          previousClusterElement,
          setDrawnMarker,
          setDrawnPolygon,
          setShowTooltipUploads,
          setdocumentSelected,
          setSidebarOpen,
          previousMarkerRef,
          drawingMode === "existing" ? drawnPolygon : undefined,
          drawingMode === "existing" ? drawnMarker : undefined,
        ),
      );

    clearMarkers();

    const markerCluster = new MarkerClusterer({
      markers: newMarkers,
      map,
      renderer: {
        render: renderClusterMarker,
      },
      algorithmOptions: { maxZoom: 17 },
      onClusterClick: (event, cluster, map) =>
        handleClusterClick(
          event,
          cluster,
          map,
          drawingMode,
          drawnPolygon,
          previousClusterElement,
          previousMarkerRef,
          previousPolygonRef,
          setdocumentSelected,
          setSidebarOpen,
          setInfoWindow,
          setDrawnPolygon,
        ),
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
  }, [isLoaded, map, documents, drawingMode]);

  useEffect(() => {
    if (positionMode === PositionMode.None) {
      // previousPolygonRef.current?.setMap(null);
      // previousMarkerRef.current?.setMap(null);
      if (municipalArea) {
        municipalArea?.forEach((area) => area.setMap(null));
      }
      drawnPolygon?.setMap(null);
      drawnMarker?.setMap(null);
      drawingManager?.setMap(null);
      setActiveButton("");
      setDrawingMode("");
      setDrawnMarker(undefined);
      setDrawnMarker(undefined);
      setDrawnPolygon(undefined);
      setDrawingManager(undefined);
    } else {
      drawnPolygon?.setMap(null);
      setDrawnPolygon(undefined);
      setDrawnMarker(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionMode]);

  useEffect(() => {
    // Confronta il valore attuale con quello precedente
    if (
      previousPolygonRef.current &&
      previousPolygonRef.current !== drawnPolygon
    ) {
      previousPolygonRef.current.setMap(null);
    }

    // Aggiorna il valore precedente
    previousPolygonRef.current = drawnPolygon;
  }, [drawnPolygon]);

  useEffect(() => {
    // Quando viene impostato un nuovo `drawnMarker`

    if (previousPolygonRef.current) {
      // Rimuovi il poligono precedente dalla mappa
      previousPolygonRef.current.setMap(null);
      previousPolygonRef.current = undefined; // Resetta il riferimento
    }
  }, [drawnMarker]);

  useEffect(() => {
    if (!saved || positionMode === PositionMode.None) {
      resetDrawingState();
      return;
    }
    // Gestione modalità Update
    if (positionMode === PositionMode.Update && docSelected) {
      handleUpdateMode();
    } else {
      handleInsertOrEditMode();
    }

    resetDrawingState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  // Funzione per resettare lo stato di disegno
  const resetDrawingState = () => {
    setSaved(false);
  };

  // Funzione per gestire la modalità Update
  const handleUpdateMode = () => {
    console.log(drawnPolygon);
    console.log(drawnMarker);
    console.log(lastSelectedElement);
    if (drawnPolygon && lastSelectedElement === "polygon") {
      console.log("aaaaaa");
      handlePolygonUpdate();
    } else if (drawnMarker && lastSelectedElement === "marker") {
      console.log("bbbb");
      handleMarkerUpdate();
    }
    alertRef.current?.showAlert(
      "Position succesfully updated!",
      AlertType.Success,
      3000,
    );
  };

  // Funzione per gestire il disegno o modifica (Insert/Edit)
  const handleInsertOrEditMode = () => {
    if (municipalArea) {
      handleMunicipalArea();
      alertRef.current?.showAlert(
        "Municipal area attached to the document",
        AlertType.Info,
        2500,
      );
    } else if (drawnMarker && drawingManager) {
      handleMarkerInsert();
      alertRef.current?.showAlert(
        "Marker attached to the document",
        AlertType.Info,
        2500,
      );
    } else if (drawnPolygon && drawingManager) {
      handlePolygonInsertOrEdit();
      alertRef.current?.showAlert(
        "Polygon area attached to the document",
        AlertType.Info,
        2500,
      );
    } else {
      alertRef.current?.showAlert(
        "You cannot save the document without selecting an area type. \n Please choose either Municipal Area, Polygon, or Marker before saving.",
        AlertType.Error,
        5000,
      );
    }
  };

  // Funzione per gestire l'aggiornamento di un poligono esistente
  const handlePolygonUpdate = () => {
    const includePath = drawnPolygon!.getPath();
    const excludePaths = drawnPolygon!.getPaths().getArray().slice(1);

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

    handleEditPositionModeConfirm(docSelected!, newPolygonArea);
  };

  const handleMarkerUpdate = () => {
    const markerPos = drawnMarker?.getPosition();

    if (!markerPos) {
      alert("Marker position is undefined");
      return;
    }

    const posToUpdate: Coordinates = {
      latitude: markerPos.lat(),
      longitude: markerPos.lng(),
    };

    handleEditPositionModeConfirm(docSelected!, posToUpdate);
  };

  const handlePolygonInsertOrEdit = () => {
    const paths = drawnPolygon!.getPaths().getArray();
    const include: Coordinates[] = [];
    const exclude: Coordinates[][] = [];

    paths.forEach((path, index) => {
      const pathArray = path.getArray().map((latLng) => ({
        latitude: latLng.lat(),
        longitude: latLng.lng(),
      }));
      if (index === 0) {
        include.push(...pathArray);
      } else {
        exclude.push(pathArray);
      }
    });

    if (include.length <= 2) {
      alertRef.current?.showAlert(
        "The Polygon must have three edges, try again!",
        AlertType.Error,
        3000,
      );
      return;
    }

    const newPolygonArea: PolygonArea = { include, exclude };

    setDocumentFormSelected((prev) => ({
      ...prev,
      coordinates: undefined,
      area: newPolygonArea,
    }));

    finalizePolygonInsertOrEdit();
  };

  const finalizePolygonInsertOrEdit = () => {
    drawingManager!.setDrawingMode(null);
    setdocumentSelected(null);
    setModalOpen(true);
  };

  const handleMarkerInsert = () => {
    const latLng = drawnMarker!.getPosition();
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
  };

  useDrawingTools(
    map,
    drawnPolygon,
    drawnMarker,
    setDrawingManager,
    setDrawnPolygon,
    setDrawnMarker,
    setActiveButton,
    positionMode === PositionMode.Update ? setLastSelectedElement : undefined,
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

      map?.fitBounds(bounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [municipalArea]);

  const handleMunicipalArea = () => {
    if (municipalArea) {
      const newPolygonArea: PolygonArea = {
        include: [],
        exclude: [],
      };

      municipalArea.forEach((polygon, i) => {
        const paths = polygon.getPaths();

        if (i === 16) {
          paths.forEach((path, j) => {
            const coordinates = path.getArray().map((latLng) => ({
              latitude: latLng.lat(),
              longitude: latLng.lng(),
            }));

            if (i === 16 && j === 0) {
              newPolygonArea.include = coordinates;
            } else {
              newPolygonArea.exclude.push(coordinates);
            }
          });
        }
      });
      setDocumentFormSelected((prev) => ({
        ...prev,
        coordinates: undefined,
        area: newPolygonArea,
      }));

      if (positionMode === PositionMode.Insert) {
        setdocumentSelected(null);
        setModalOpen(true);
      }
      setIsSubmit(false);
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
                : drawingMode === "polygon"
                  ? "Draw a polygon on the map, where you want to add a new Document"
                  : drawingMode === "existing"
                    ? "Select a document on the map to place the new Document in the same point or area"
                    : drawingMode === "municipal"
                      ? "Municipal Area Selected"
                      : "Select a drawing mode option"}
            </h3>
          )}
          {positionMode === PositionMode.Update && (
            <h3>
              {drawingMode === "marker"
                ? "Select a point on the map, where you want to update the position of the document selected"
                : drawingMode === "polygon"
                  ? "Draw a polygon on the map, where you want to update the position of the document selected"
                  : drawingMode === "existing"
                    ? "Select a document on the map to update the Document position to the same point or area of another Document"
                    : drawingMode === "municipal"
                      ? "Municipal Area Selected"
                      : "Select a drawing mode option or drag the Document in a different position"}
            </h3>
          )}
          {(positionMode === PositionMode.Update ||
            positionMode === PositionMode.Insert) && (
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
      <DrawingControls
        positionMode={positionMode}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        map={map}
        drawnPolygon={drawnPolygon}
        drawnMarker={drawnMarker}
        drawingManager={drawingManager}
        setDrawingMode={setDrawingMode}
        municipalArea={municipalArea}
        previousPolygonRef={previousPolygonRef}
        drawingMode={drawingMode}
        setMunicipalArea={setMunicipalArea}
        setDrawnPolygon={setDrawnPolygon}
      />

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
