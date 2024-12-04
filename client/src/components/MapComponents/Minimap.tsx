import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { FC, useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import "../../styles/MapComponentsStyles/Minimap.scss";
import { createArea, getPolygonCentroid } from "../../utils/drawingTools";
import { Coordinates, Document, PolygonArea } from "../../utils/interfaces";
import { libraries, mapOptions } from "../../utils/map";
import { createMarker } from "../../utils/markersTools";

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
  const { positionMode } = useAppContext();
  const [minimap, setMinimap] = useState<google.maps.Map | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  useEffect(() => {
    if (documentSelected && minimap) {
      if ("latitude" in documentLocation && "longitude" in documentLocation) {
        createMarker(documentSelected, false, minimap, positionMode);
      } else {
        createArea(documentSelected, minimap, positionMode);
      }
    }
  }, [documentLocation, documentSelected, minimap, positionMode]);

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

  if (!isLoaded) {
    return <div>Loading Minimap...</div>;
  }

  return (
    <div className="minimap-overlay">
      <div className="minimap">
        <button className="close-btn" onClick={() => onClose()}>
          &times;
        </button>
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
        >
          {/* {"latitude" in documentLocation &&
            "longitude" in documentLocation && (
              <Marker
                position={{
                  lat: documentLocation.latitude,
                  lng: documentLocation.longitude,
                }}
              />
            )}
          {"include" in documentLocation && "exclude" in documentLocation && (
            <Polygon
              paths={[
                parseAreaPaths(documentLocation).include,
                ...parseAreaPaths(documentLocation).exclude,
              ]}
              options={{
                fillColor: "#fecb00",
                fillOpacity: 0.5,
                strokeWeight: 4,
                strokeColor: "#fecb00",
                zIndex: 1,
              }}
            />
          )} */}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Minimap;
