import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { FC, useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import "../../styles/MapComponentsStyles/Minimap.scss";
import { rewindRing, useDrawingTools } from "../../utils/drawingTools";
import { Coordinates, Document, PolygonArea } from "../../utils/interfaces";
import { libraries, mapOptions } from "../../utils/map";
import {
  convertCoordinatesToMarkers,
  createMarker,
} from "../../utils/markersTools";
import { PositionMode } from "../../utils/modes";
import { createArea } from "../../utils/polygonsTools";
import DrawingControls from "../DrawingControls";

interface MinimapProps {
  documentSelected: Document | null;
  documentLocation: Coordinates | PolygonArea;
  onClose: () => void;
}

const Minimap: FC<MinimapProps> = ({
  documentSelected,
  documentLocation,
  onClose,
}) => {
  const { positionMode, setPositionMode, handleEditPositionModeConfirm } =
    useAppContext();
  const [minimap, setMinimap] = useState<google.maps.Map | null>(null);
  const [drawnPolygon, setDrawnPolygon] = useState<
    google.maps.Polygon | undefined
  >(undefined);
  const [drawnMarker, setDrawnMarker] = useState<
    google.maps.Marker | undefined
  >(undefined);
  const [drawingManager, setDrawingManager] = useState<
    google.maps.drawing.DrawingManager | undefined
  >(undefined);
  const [municipalArea, setMunicipalArea] = useState<
    google.maps.Polygon[] | undefined
  >(undefined);
  const [drawingMode, setDrawingMode] = useState<string>("");
  const [activeButton, setActiveButton] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  useDrawingTools(
    minimap,
    drawnPolygon,
    drawnMarker,
    setDrawingManager,
    setDrawnPolygon,
    setDrawnMarker,
    setActiveButton,
  );

  useEffect(() => {
    if (documentSelected && minimap) {
      if ("latitude" in documentLocation && "longitude" in documentLocation) {
        createMarker(
          documentSelected,
          false,
          minimap,
          positionMode,
          drawingMode,
          setDrawnMarker,
          setDrawnPolygon,
        );
        if (positionMode === PositionMode.Update) {
          const newMarker = convertCoordinatesToMarkers(
            documentSelected.coordinates,
          );
          setDrawnMarker(newMarker);
        }
      } else {
        const area = createArea(documentSelected, minimap, positionMode);
        if (area && positionMode === PositionMode.Update) {
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
      }
    }
  }, [minimap, documentSelected, documentLocation, positionMode]);

  useEffect(() => {
    if (documentSelected && saved && positionMode === PositionMode.Update) {
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
        municipalArea.forEach((area) => area.setMap(null));
        setMunicipalArea(undefined);
        handleEditPositionModeConfirm(documentSelected!, newPolygonArea);
      } else if (drawnPolygon) {
        const includePath = drawnPolygon.getPath();
        const excludePaths = drawnPolygon.getPaths().getArray().slice(1);
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
        handleEditPositionModeConfirm(documentSelected, newPolygonArea);
        drawnPolygon?.setMap(null);
      } else if (drawnMarker) {
        const markerPos = drawnMarker?.getPosition();

        if (!markerPos) {
          alert("Marker position is undefined");
          return;
        }

        const posToUpdate: Coordinates = {
          latitude: markerPos.lat(),
          longitude: markerPos.lng(),
        };
        handleEditPositionModeConfirm(documentSelected, posToUpdate);
        drawnMarker.setMap(null);
      }
      setDrawnMarker(undefined);
      setDrawnPolygon(undefined);
      setSaved(false);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  const mapCenter = (): { lat: number; lng: number } => {
    if ("latitude" in documentLocation && "longitude" in documentLocation) {
      // Se documentLocation è di tipo Coordinates
      return {
        lat: documentLocation.latitude,
        lng: documentLocation.longitude,
      };
    } else if ("include" in documentLocation && "exclude" in documentLocation) {
      const bounds = calculateBounds(documentLocation);

      // Centra la mappa sui bounds calcolati
      const center = bounds.getCenter();
      return {
        lat: center.lat(),
        lng: center.lng(),
      };
    }
    return { lat: 0, lng: 0 }; // Default (centrato su 0,0)
  };

  const calculateBounds = (polygonArea: PolygonArea) => {
    const bounds = new google.maps.LatLngBounds();

    // Aggiungi le coordinate "include" al bounds
    polygonArea.include.forEach((coord) => {
      bounds.extend(new google.maps.LatLng(coord.latitude, coord.longitude));
    });

    // Aggiungi anche le coordinate di tutti i "exclude" (le aree escluse)
    polygonArea.exclude.forEach((excludePolygon) => {
      excludePolygon.forEach((coord) => {
        bounds.extend(new google.maps.LatLng(coord.latitude, coord.longitude));
      });
    });

    return bounds;
  };

  const handleCloseButton = () => {
    setDrawnMarker(undefined);
    setDrawnPolygon(undefined);
    setPositionMode(PositionMode.None);
    onClose();
  };

  if (!isLoaded) {
    return <div>Loading Minimap...</div>;
  }

  return (
    <div className="minimap-overlay">
      <div className="minimap">
        <button className="close-btn" onClick={handleCloseButton}>
          &times;
        </button>
        {positionMode !== PositionMode.None && (
          <div className="update-mode">
            <h2>Update Position</h2>
            <h3>
              Select a point on the map, where you want to update the position
              of the document selected
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
        <DrawingControls
          positionMode={positionMode}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          map={minimap}
          drawnPolygon={drawnPolygon}
          drawnMarker={drawnMarker}
          drawingManager={drawingManager}
          setDrawingMode={setDrawingMode}
          municipalArea={municipalArea}
          setMunicipalArea={setMunicipalArea}
          setDrawnPolygon={setDrawnPolygon}
        />
        <GoogleMap
          id="minimap"
          zoom={9}
          center={mapCenter()}
          options={{ ...mapOptions, mapTypeId: "satellite" }}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          onLoad={setMinimap}
        ></GoogleMap>
      </div>
    </div>
  );
};

export default Minimap;
