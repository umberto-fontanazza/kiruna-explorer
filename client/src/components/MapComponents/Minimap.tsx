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
  documentSelected: Document;
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
  const [drawnPolygon, setDrawnPolygon] = useState<google.maps.Polygon>();
  const [drawnMarker, setDrawnMarker] = useState<google.maps.Marker>();
  const [drawingManager, setDrawingManager] =
    useState<google.maps.drawing.DrawingManager>();
  const [municipalArea, setMunicipalArea] = useState<google.maps.Polygon[]>();
  const [drawingMode, setDrawingMode] = useState<string>("");
  const [activeButton, setActiveButton] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
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
      "latitude" in documentLocation
        ? handleCoordinatesMode()
        : handlePolygonMode();
    }
  }, [minimap, documentSelected, documentLocation, positionMode]);

  useEffect(() => {
    if (documentSelected && saved && positionMode === PositionMode.Update) {
      saveChanges();
    }
  }, [saved]);

  const handleCoordinatesMode = () => {
    createMarker(
      documentSelected,
      false,
      minimap!,
      positionMode,
      drawingMode,
      setDrawnMarker,
      setDrawnPolygon,
    );

    if (positionMode === PositionMode.Update) {
      const newMarker = convertCoordinatesToMarkers(
        documentSelected!.coordinates,
      );
      setDrawnMarker(newMarker);
    }
  };

  const handlePolygonMode = () => {
    const area = createArea(documentSelected!, minimap!, positionMode);
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
  };

  const saveChanges = () => {
    if (municipalArea) {
      saveMunicipalArea();
    } else if (drawnPolygon) {
      savePolygonArea();
    } else if (drawnMarker) {
      saveMarkerPosition();
    }
    resetMapState();
  };

  const saveMunicipalArea = () => {
    const newPolygonArea: PolygonArea = { include: [], exclude: [] };
    municipalArea!.forEach((polygon, i) => {
      const paths = polygon.getPaths();
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
    });
    municipalArea!.forEach((area) => area.setMap(null));
    setMunicipalArea(undefined);
    handleEditPositionModeConfirm(documentSelected!, newPolygonArea);
  };

  const savePolygonArea = () => {
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
    handleEditPositionModeConfirm(documentSelected!, newPolygonArea);
    drawnPolygon!.setMap(null);
  };

  const saveMarkerPosition = () => {
    const markerPos = drawnMarker!.getPosition();
    if (!markerPos) {
      alert("Marker position is undefined");
      return;
    }
    const posToUpdate: Coordinates = {
      latitude: markerPos.lat(),
      longitude: markerPos.lng(),
    };
    handleEditPositionModeConfirm(documentSelected!, posToUpdate);
    drawnMarker!.setMap(null);
  };

  const resetMapState = () => {
    setDrawnMarker(undefined);
    setDrawnPolygon(undefined);
    setSaved(false);
    onClose();
  };

  const mapCenter = () => {
    if ("latitude" in documentLocation && "longitude" in documentLocation) {
      return {
        lat: documentLocation.latitude,
        lng: documentLocation.longitude,
      };
    } else if ("include" in documentLocation && "exclude" in documentLocation) {
      const bounds = calculateBounds(documentLocation);
      const center = bounds.getCenter();
      return {
        lat: center.lat(),
        lng: center.lng(),
      };
    }
    return { lat: 0, lng: 0 };
  };

  const calculateBounds = (polygonArea: PolygonArea) => {
    const bounds = new google.maps.LatLngBounds();
    polygonArea.include.forEach((coord) => {
      bounds.extend(new google.maps.LatLng(coord.latitude, coord.longitude));
    });
    polygonArea.exclude.forEach((excludePolygon) => {
      excludePolygon.forEach((coord) => {
        bounds.extend(new google.maps.LatLng(coord.latitude, coord.longitude));
      });
    });
    return bounds;
  };

  const handleCloseButton = () => {
    resetMapState();
    setPositionMode(PositionMode.None);
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
              <button className="edit-area-btn" onClick={() => setSaved(true)}>
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
