import "@material/web/icon/_icon.scss";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
import { GoogleMap, Libraries, useJsApiLoader } from "@react-google-maps/api";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import "../styles/Map.scss";
import { Document, fromDocumentTypeToIcon, Link } from "../utils/interfaces";
import MapTypeSelector from "./MapTypeSelector";

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
    libraries: libraries,
  });

  const onMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setNewPos({ lat, lng });
    setModalOpen(true);
  };

  useEffect(() => {
    if (!isLoaded || !map || !insertMode) return;

    map.addListener("click", onMapClick);

    return () => {
      google.maps.event.clearInstanceListeners(map);
    };
  }, [insertMode]);

  /**
   * @param linked - when true the documents is visualized
   * as linked to the selected document
   */
  const createMarker = (
    doc: Document,
    linked: boolean = false
  ): google.maps.marker.AdvancedMarkerElement => {
    const markerDivChild = document.createElement("div");
    const iconName = fromDocumentTypeToIcon.get(doc.type) as string;
    markerDivChild.className = `document-icon ${linked ? "linked" : ""}`;
    markerDivChild.innerHTML = `<span class="material-symbols-outlined color-${iconName} size">${iconName}</span>`;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: {
        lat: doc.coordinates?.latitude || 0,
        lng: doc.coordinates?.longitude || 0,
      },
      content: markerDivChild,
      title: doc.title,
    });

    marker.addListener("click", () => {
      setSidebarOpen(true);
      setDocSelected(doc);
      setCenter({
        lat: doc.coordinates?.latitude || 0,
        lng: doc.coordinates?.longitude || 0 + 0.0019,
      });
    });
    return marker;
  };

  /**
   * @param doc - the document to be checked
   * @returns true if doc is currently selected or linked to the selected
   */
  const isSelectedOrLinked = (doc: Document) => {
    const linkedIDs: number[] =
      documentSelected?.links?.map((link: Link) => link.targetDocumentId) || [];
    if (doc.id === documentSelected?.id) return true;
    if (linkedIDs.includes(doc.id)) return true;
    return false;
  };

  const clearMarkers = () => {
    markers.forEach((marker) => (marker.map = null));
  };

  useEffect(() => {
    if (!isLoaded || !map || insertMode) {
      clearMarkers();
      return;
    }
    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = documents
      .filter((doc) => doc.coordinates)
      .filter((doc) => (visualLinks ? isSelectedOrLinked(doc) : true))
      .map((doc) => createMarker(doc));

    setMarkers((_) => {
      clearMarkers();
      return newMarkers;
    });
    return clearMarkers;
  }, [isLoaded, map, props]);

  // Render map only when API is loaded
  return isLoaded ? (
    <section id="map">
      <MapTypeSelector mapType={mapType} setMapType={setMapType} />
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
    </section>
  ) : (
    <div>Loading...</div>
  );
};

export default MapComponent;
