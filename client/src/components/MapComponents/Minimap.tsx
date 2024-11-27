import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { FC } from "react";
import "../../styles/MapComponentsStyles/Minimap.scss";
import { Coordinates } from "../../utils/interfaces";
import { libraries, mapOptions } from "../../utils/map";

interface MinimapProps {
  coordinates: Coordinates;
  onClose: () => void;
}

const Minimap: FC<MinimapProps> = ({ coordinates, onClose }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  if (!isLoaded) {
    return <div>Loading Minimap...</div>;
  }

  return (
    <div className="minimap">
      <button className="close-btn" onClick={() => onClose()}>
        &times;
      </button>
      <GoogleMap
        id="minimap"
        zoom={14}
        center={{
          lat: coordinates.latitude,
          lng: coordinates.longitude,
        }}
        options={{ ...mapOptions, mapTypeId: "satellite" }}
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
      >
        <Marker
          position={{ lat: coordinates.latitude, lng: coordinates.longitude }}
        />
      </GoogleMap>
    </div>
  );
};

export default Minimap;
