import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { FC, useState } from "react";
import { Document } from "../utils/interfaces";
import "../styles/Map.scss";

interface MapComponentProps {
  documents: Document[];
  setSidebarOpen: (value: boolean) => void;
  setDocSelected: (value: Document | null) => void;
}

const MapComponent: FC<MapComponentProps> = (props) => {
  const kirunaCoords = { lat: 67.8558, lng: 20.2253 };
  const [center, setCenter] = useState(kirunaCoords);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const containerStyle = {
    width: "100vw",
    height: "100%",
  };

  const mapOptions = {
    mapTypeId: "satellite",
    //mapTypeControl: true,
    disableDefaultUI: true,

    minZoom: 12,
    maxZoom: 20,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  // Centro della mappa su Kiruna, Svezia

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        options={mapOptions}
        center={center}
      >
        {props.documents.map(
          (doc) =>
            doc.coordinates.latitude !== null &&
            doc.coordinates.longitude !== null && (
              // <Marker
              //   key={doc.id}
              //   position={{
              //     lat: doc.coordinates.latitude!,
              //     lng: doc.coordinates.longitude!,
              //   }}
              //   icon={{
              //     url: `/document-icon-${doc.type}-iconByIcons8.png`, // Replace with the path to your custom image
              //     //scaledSize: new window.google.maps.Size(50, 50), // Adjust the size as needed
              //     origin: new window.google.maps.Point(0, 0),
              //     anchor: new window.google.maps.Point(25, 25), // Adjusts the anchor point based on size
              //   }}
              //   onClick={() => {
              //     props.setSidebarOpen(true);
              //     props.setDocSelected(doc);
              //     setCenter({
              //       lat: doc.coordinates.latitude!,
              //       lng: doc.coordinates.longitude! + 0.0011,
              //     });
              //   }}
              // />
              <OverlayView
                key={doc.id}
                position={{
                  lat: doc.coordinates.latitude!,
                  lng: doc.coordinates.longitude!,
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
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
                    src={`/document-icon-${doc.type}-iconByIcons8.png`}
                    alt="Custom Marker"
                    style={{ width: "4vh", height: "4vh" }}
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

//function MapComponent() {
// const [map, setMap] = React.useState(null);

// const onLoad = React.useCallback(function callback(map) {
//   // This is just an example of getting and using the map instance!!! don't just blindly copy!
//   const bounds = new window.google.maps.LatLngBounds(center)
//   map.fitBounds(bounds)

//   setMap(map)
// }, [])

// const onUnmount = React.useCallback(function callback(map) {
//   setMap(null)
// }, [])
//}

export default MapComponent;
