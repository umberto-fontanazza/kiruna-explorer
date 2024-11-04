import React from "react";
import GoogleMapReact from "google-map-react";

interface MapComponentProps {
  apiKey: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ apiKey }) => {
  // Centro della mappa su Kiruna, Svezia
  const kirunaCoords = { lat: 67.8558, lng: 20.2253 };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={kirunaCoords}
        defaultZoom={12} // Imposta il livello di zoom. 12 è un buon livello per la visualizzazione dall'alto
        options={{
          mapTypeId: "satellite", // Modalità satellite
        }}
      />
    </div>
  );
};

export default MapComponent;
