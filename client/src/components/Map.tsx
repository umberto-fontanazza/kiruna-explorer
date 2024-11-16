import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { FC, useEffect, useState } from "react";
import { Document } from "../utils/interfaces";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
import "@material/web/icon/_icon.scss";
import "../styles/Map.scss";

interface MapComponentProps {
  documents: Document[];
  documentSelected: Document | null;
  visualLinks: boolean;
  setSidebarOpen: (value: boolean) => void;
  setDocSelected: (value: Document | null) => void;
}

const MapComponent: FC<MapComponentProps> = (props) => {
  // Coordinates for Kiruna, Sweden
  const kirunaCoords = { lat: 67.8558, lng: 20.2253 };
  const [center, setCenter] = useState(kirunaCoords);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapType, setMapType] = useState<string>("satellite");
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  // Load Google Maps API with API key from environment variables
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["marker"],
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
        mapId: "MAP ID",
        mapTypeId: mapType,
        mapTypeControl: false,
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

  useEffect(() => {
    if (isLoaded && map) {
      // Function to create a Marker
      const createMarker = (
        doc: Document,
        markerClass: string
      ): google.maps.marker.AdvancedMarkerElement => {
        const markerContent = document.createElement("div");
        markerContent.className = `map-icon-documents ${markerClass}`;
        markerContent.innerHTML = `<img class="doc-img" src="/document-${doc.type}-icon.png" alt="Custom Marker" />`;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: {
            lat: doc.coordinates.latitude!,
            lng: doc.coordinates.longitude!,
          },
          content: markerContent,
          title: doc.title,
        });

        marker.addListener("click", () => {
          props.setSidebarOpen(true);
          props.setDocSelected(doc);
          setCenter({
            lat: doc.coordinates.latitude!,
            lng: doc.coordinates.longitude! + 0.0019,
          });
        });

        return marker;
      };

      const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

      props.documents.forEach((doc) => {
        if (
          doc.coordinates.latitude !== null &&
          doc.coordinates.longitude !== null
        ) {
          if (props.visualLinks) {
            if (doc.id === props.documentSelected?.id) {
              const marker = createMarker(doc, "not-visual");
              newMarkers.push(marker);
            }
            props.documentSelected?.connections.forEach((link) => {
              if (doc.id === link.targetDocumentId) {
                const marker = createMarker(doc, "visual");
                newMarkers.push(marker);
              }
            });
          } else {
            // Se `visualLinks` è disattivo, crea un marker senza connessioni
            const marker = createMarker(doc, "not-visual");
            newMarkers.push(marker);
          }
        }
      });

      setMarkers(newMarkers);

      return () => {
        newMarkers.forEach((marker) => (marker.map = null));
      };
    }
  }, [isLoaded, map, props, setMarkers]);

  useEffect(() => {}, [props.visualLinks]);

  // Render map only when API is loaded
  return isLoaded ? (
    <>
      <div className="map-types">
        <select
          value={mapType}
          onChange={(e) => setMapType(e.target.value)}
          required
        >
          <option value={"roadmap"}>RoadMap</option>
          <option value={"satellite"}>Satellite</option>
          <option value={"hybrid"}>Hybrid</option>
          <option value={"terrain"}>Terrain</option>
          {/* <option value="Others">Others</option> */}
        </select>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        options={mapOptions}
        center={center}
        onLoad={(mapInstance) => {
          setMap(mapInstance);
        }}
      />
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default MapComponent;
