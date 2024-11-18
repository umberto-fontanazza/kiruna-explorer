import { GoogleMap, Libraries, useJsApiLoader } from "@react-google-maps/api";
import { FC, useEffect, useState, Dispatch, SetStateAction } from "react";
import { Document, fromDocumentTypeToIcon } from "../utils/interfaces";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
import "@material/web/icon/_icon.scss";
import "../styles/Map.scss";

interface Position {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: "100vw",
  height: "100%",
};

const kirunaCoords = { lat: 67.8558, lng: 20.2253 };
const kirunaBoundaries = {
  north: 67.9,
  south: 67.8,
  east: 20.4,
  west: 20.0,
};

const mapOptions = {
  mapId: "d76bd741d388f7fd",
  mapTypeControl: false,
  mapTypeControlOptions: {
    mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"],
  },
  minZoom: 12,
  maxZoom: 20,
  restriction: {
    latLngBounds: kirunaBoundaries,
    strictBounds: false,
  },
};

const libraries: Libraries = ["marker"];

interface MapComponentProps {
  documents: Document[];
  documentSelected: Document | null;
  visualLinks: boolean;
  insertMode: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setDocSelected: Dispatch<SetStateAction<Document | null>>;
  setNewPos: Dispatch<SetStateAction<Position>>;
}

const MapComponent: FC<MapComponentProps> = (props) => {
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
    libraries: libraries,
  });

  useEffect(() => {
    if (isLoaded && map && props.insertMode) {
      const mapHandleClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const latitude = event.latLng.lat();
          const longitude = event.latLng.lng();
          const newPosition: Position = { lat: latitude, lng: longitude };
          props.setNewPos(newPosition);
          props.setModalOpen(true);
        }
      };

      map.addListener("click", mapHandleClick);

      return () => {
        google.maps.event.clearInstanceListeners(map);
      };
    }
  }, [props.insertMode]);

  useEffect(() => {
    if (isLoaded && map && !props.insertMode) {
      const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
      // Function to create a Marker
      const createMarker = (
        doc: Document,
        markerClass: string
      ): google.maps.marker.AdvancedMarkerElement => {
        const markerContent = document.createElement("div");
        const mappedType = fromDocumentTypeToIcon.get(doc.type);
        markerContent.className = `map-icon-documents ${markerClass}`;
        markerContent.innerHTML = `<span class="material-symbols-outlined color-${mappedType} size">${mappedType}</span>`;

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
            props.documentSelected?.links.forEach((link) => {
              if (doc.id === link.targetDocumentId) {
                const marker = createMarker(doc, "visual");
                newMarkers.push(marker);
              }
            });
          } else {
            const marker = createMarker(doc, "not-visual");
            newMarkers.push(marker);
          }
        }
      });

      setMarkers((prevMarkers) => {
        prevMarkers.forEach((marker) => {
          marker.map = null;
        });
        return newMarkers;
      });

      return () => {
        markers.forEach((marker) => (marker.map = null));
      };
    } else {
      markers.forEach((marker) => (marker.map = null));
    }
  }, [isLoaded, map, props]);

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
      {props.insertMode && (
        <div className="insert-mode">
          <h2>Insert Mode</h2>
          <h3>
            Select a point on the map, where you want to add a new Document
          </h3>
        </div>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        options={{
          ...mapOptions,
          mapTypeId: mapType,
          mapTypeControlOptions: {
            ...mapOptions.mapTypeControlOptions,
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          },
        }}
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
