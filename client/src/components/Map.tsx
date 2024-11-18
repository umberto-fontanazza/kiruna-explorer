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
  const {
    documents,
    documentSelected,
    visualLinks,
    insertMode,
    setModalOpen,
    setSidebarOpen,
    setDocSelected,
    setNewPos,
  } = props;
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
    libraries: ["marker"] as Libraries,
  });

  const onMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      const newPosition: Position = { lat: latitude, lng: longitude };
      setNewPos(newPosition);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    if (!isLoaded || !map || !insertMode) return;

    map.addListener("click", onMapClick);

    return () => {
      google.maps.event.clearInstanceListeners(map);
    };
  }, [insertMode]);

  const createMarker = (
    doc: Document,
    markerClass: string
  ): google.maps.marker.AdvancedMarkerElement => {
    const markerDivChild = document.createElement("div");
    const iconName = fromDocumentTypeToIcon.get(doc.type) as string;
    markerDivChild.className = `map-icon-documents ${markerClass}`;
    markerDivChild.innerHTML = `<span class="material-symbols-outlined color-${iconName} size">${iconName}</span>`;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: {
        lat: doc.coordinates.latitude!,
        lng: doc.coordinates.longitude!,
      },
      content: markerDivChild,
      title: doc.title,
    });

    marker.addListener("click", () => {
      setSidebarOpen(true);
      setDocSelected(doc);
      setCenter({
        lat: doc.coordinates.latitude!,
        lng: doc.coordinates.longitude! + 0.0019,
      });
    });
    return marker;
  };

  const clearMarkers = () => {
    markers.forEach((marker) => (marker.map = null));
  };

  useEffect(() => {
    if (!isLoaded || !map || insertMode) {
      clearMarkers();
      return;
    }
    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
    documents
      .filter((doc) => doc.coordinates.latitude && doc.coordinates.longitude)
      .forEach((doc) => {
        if (visualLinks) {
          if (doc.id === documentSelected?.id) {
            const marker = createMarker(doc, "not-visual");
            newMarkers.push(marker);
          }
          documentSelected?.links.forEach((link) => {
            if (doc.id === link.targetDocumentId) {
              const marker = createMarker(doc, "visual");
              newMarkers.push(marker);
            }
          });
        } else {
          const marker = createMarker(doc, "not-visual");
          newMarkers.push(marker);
        }
      });

    setMarkers((prevMarkers) => {
      prevMarkers.forEach((marker) => {
        marker.map = null;
      });
      return newMarkers;
    });
    return clearMarkers;
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
      {insertMode && (
        <div className="insert-mode">
          <h2>Insert Mode</h2>
          <h3>
            Select a point on the map, where you want to add a new Document
          </h3>
        </div>
      )}
      <GoogleMap
        id="google-map"
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
