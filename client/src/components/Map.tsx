import React from "react";
import GoogleMapReact from "google-map-react";

interface MapComponentProps {
  apiKey: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ apiKey }) => {
  // Centro della mappa su Kiruna, Svezia
  const kirunaCoords = { lat: 67.8558, lng: 20.2253 };

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: apiKey }}
      defaultCenter={kirunaCoords}
      defaultZoom={12}
      options={{
        mapTypeId: "satellite",
      }}
    />
  );
};

export default MapComponent;
