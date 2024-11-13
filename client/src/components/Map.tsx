import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { FC, useState } from "react";
import { Document } from "../utils/interfaces";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
import "@material/web/icon/_icon.scss";
import "../styles/Map.scss";

interface MapComponentProps {
  documents: Document[];
  setSidebarOpen: (value: boolean) => void;
  setDocSelected: (value: Document | null) => void;
}

const MapComponent: FC<MapComponentProps> = (props) => {
  // Coordinates for Kiruna, Sweden
  const kirunaCoords = { lat: 67.8558, lng: 20.2253 };
  const [center, setCenter] = useState(kirunaCoords);

  // Load Google Maps API with API key from environment variables
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Styling for the map container
  const containerStyle = {
    width: "100vw",
    height: "100%",
  };

  // Map boundaries around Kiruna
  const bounds = {
    north: 67.9,
    south: 67.8,
    east: 20.4,
    west: 20.0,
  };

  // Map options to control appearance and restrictions
  const mapOptions = isLoaded
    ? {
        mapTypeId: "satellite",
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"],
        },
        minZoom: 12,
        maxZoom: 20,
        styles: [
          {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        restriction: {
          latLngBounds: bounds,
          strictBounds: false,
        },
      }
    : {};

  // Render map only when API is loaded
  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        options={mapOptions}
        center={center}
      >
        {/* Render an overlay or marker for each document with valid coordinates */}
        {props.documents?.map(
          (doc) =>
            doc.coordinates.latitude !== null &&
            doc.coordinates.longitude !== null && (
              <OverlayView
                key={doc.id}
                position={{
                  lat: doc.coordinates.latitude!,
                  lng: doc.coordinates.longitude!,
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                {/* Custom icon with click handler to open sidebar and recenter map */}
                <div
                  className="map-icon-documents"
                  onClick={() => {
                    props.setSidebarOpen(true);
                    props.setDocSelected(doc);
                    setCenter({
                      lat: doc.coordinates.latitude!,
                      lng: doc.coordinates.longitude! + 0.0019,
                    });
                  }}
                >
                  <img
                    className="doc-img"
                    src={`/document-${doc.type}-icon.png`}
                    alt="Custom Marker"
                  />
                </div>
              </OverlayView>
            )
        )}
      </GoogleMap>
    </>
  ) : (
    <></>
  );
};

export default MapComponent;
