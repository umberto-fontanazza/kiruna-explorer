import GoogleMapReact from "google-map-react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  OverlayView,
} from "@react-google-maps/api";
import { FC, useState } from "react";
import { Document } from "../utils/interfaces";

interface MapComponentProps {
  apiKey: string;
  documents: Document[];
  setSidebarOpen: (value: boolean) => void;
  setDocSelected: (value: Document | null) => void;
}

const MapComponent: FC<MapComponentProps> = (props) => {
  const kirunaCoords = { lat: 67.8558, lng: 20.2253 };
  const [center, setCenter] = useState(kirunaCoords);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: props.apiKey,
  });

  const containerStyle = {
    width: "100vw",
    height: "100%",
  };

  // Centro della mappa su Kiruna, Svezia

  return isLoaded ? (
    <>
      <GoogleMap mapContainerStyle={containerStyle} zoom={10} center={center}>
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
                position={{
                  lat: doc.coordinates.latitude!,
                  lng: doc.coordinates.longitude!,
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  style={{
                    border: "2px solid blue", // Aggiungi bordo con stile
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                  }}
                  onClick={() => {
                    props.setSidebarOpen(true);
                    props.setDocSelected(doc);
                    setCenter({
                      lat: doc.coordinates.latitude!,
                      lng: doc.coordinates.longitude! + 0.0011,
                    });
                  }}
                >
                  <img
                    src={`/document-icon-${doc.type}-iconByIcons8.png`}
                    alt="Custom Marker"
                    style={{ width: "30px", height: "30px" }}
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
