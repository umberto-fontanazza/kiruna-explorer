import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import "../styles/Map.scss";
import { Document, fromDocumentTypeToIcon, Link } from "../utils/interfaces";
import { kirunaCoords, libraries, mapOptions } from "../utils/map";
import MapTypeSelector from "./MapTypeSelector";

interface Position {
  lat: number;
  lng: number;
}

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
        lat: doc.coordinates?.latitude ?? 0,
        lng: doc.coordinates?.longitude ?? 0,
      },
      content: markerDivChild,
      title: doc.title,
    });

    marker.addListener("click", () => {
      setSidebarOpen(true);
      setDocSelected(doc);
      setCenter({
        lat: doc.coordinates?.latitude ?? kirunaCoords.lat,
        lng: doc.coordinates?.longitude ?? kirunaCoords.lng + 0.0019,
      });
    });
    return marker;
  };

  const isSelectedOrLinked = (doc: Document) => {
    const linkedIDs: number[] =
      documentSelected?.links?.map((link: Link) => link.targetDocumentId) ?? [];
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
      .map((doc) =>
        createMarker(doc, visualLinks && doc.id !== documentSelected?.id)
      );

    clearMarkers();

    const markerCluster = new MarkerClusterer({
      markers: newMarkers,
      map,
      // Usa il `renderer` per personalizzare l'icona dei cluster
      renderer: {
        render: ({ count, position }) => {
          let size = 30;
          if (count > 10) size = 50;
          if (count > 50) size = 60;

          return new google.maps.marker.AdvancedMarkerElement({
            position,
            title: count.toString(),
            content: (() => {
              const div = document.createElement("div");
              div.style.width = `${size}px`;
              div.style.height = `${size}px`;
              div.style.backgroundImage = `url(https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m${Math.min(count, 3)}.png)`;
              div.style.backgroundSize = "contain";
              return div;
            })(),
          });
        },
      },
    });

    google.maps.event.addListener(
      markerCluster,
      "clusterclick",
      (cluster: { getBounds: () => any }) => {
        const bounds = cluster.getBounds();
        map?.fitBounds(bounds); // Auto-zoom al cluster
      }
    );

    setMarkers(newMarkers);

    return () => {
      markerCluster.clearMarkers();
    };
  }, [isLoaded, map, props]);

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
        onLoad={setMap}
      />
    </section>
  ) : (
    <div>Loading...</div>
  );
};

export default MapComponent;
