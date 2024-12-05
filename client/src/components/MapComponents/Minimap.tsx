import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { FC, useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import "../../styles/MapComponentsStyles/Minimap.scss";
import { createArea, getPolygonCentroid } from "../../utils/drawingTools";
import { Coordinates, Document, PolygonArea } from "../../utils/interfaces";
import { libraries, mapOptions } from "../../utils/map";
import { createMarker } from "../../utils/markersTools";
import { PositionMode } from "../../utils/modes";

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
  const {
    positionMode,
    setPositionMode,
    handleEditPositionModeConfirm,
    setIsPositionEdited,
  } = useAppContext();
  const [minimap, setMinimap] = useState<google.maps.Map | null>(null);
  const [polygonArea, setPolygonArea] = useState<google.maps.Polygon | null>(
    null,
  );
  const [newMarkerPosition, setNewMarkerPosition] =
    useState<Coordinates | null>(null);
  const [saved, setSaved] = useState<boolean>(false);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  useEffect(() => {
    if (documentSelected && minimap) {
      if ("latitude" in documentLocation && "longitude" in documentLocation) {
        createMarker(
          documentSelected,
          false,
          minimap,
          positionMode,
          setNewMarkerPosition,
        );
      } else {
        createArea(documentSelected, minimap, positionMode, setPolygonArea);
      }
    }
  }, [documentLocation, minimap, documentSelected, positionMode]);

  useEffect(() => {
    if (documentSelected && saved && positionMode === PositionMode.Update) {
      if (polygonArea) {
        const path = polygonArea.getPath();
        const newPolygonArea: PolygonArea = {
          include: path.getArray().map((latLng) => ({
            latitude: latLng.lat(),
            longitude: latLng.lng(),
          })),
          exclude: [],
        };
        handleEditPositionModeConfirm(documentSelected, newPolygonArea);
        polygonArea?.setMap(null);
      } else {
        if (newMarkerPosition) {
          handleEditPositionModeConfirm(documentSelected, newMarkerPosition);
        }
      }
      setNewMarkerPosition(null);
      setPolygonArea(null);
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
      // Se documentLocation è di tipo PolygonArea
      return getPolygonCentroid(documentLocation); // Centra il poligono
    }
    return { lat: 0, lng: 0 }; // Default (centrato su 0,0)
  };

  const handleCloseButton = () => {
    setNewMarkerPosition(null);
    setPolygonArea(null);
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
        <GoogleMap
          id="minimap"
          zoom={12}
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
