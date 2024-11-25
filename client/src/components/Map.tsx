import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import "../styles/Map.scss";
import {
  Coordinates,
  Document,
  fromDocumentTypeToIcon,
  Link,
} from "../utils/interfaces";
import { kirunaCoords, libraries, mapOptions } from "../utils/map";
import MapTypeSelector from "./MapTypeSelector";

interface MapComponentProps {
  documents: Document[];
  documentSelected: Document | null;
  visualLinks: boolean;
  positionView: boolean;
  editPositionMode: boolean;
  editDocumentMode: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setdocumentSelected: Dispatch<SetStateAction<Document | null>>;
  setNewPosition: Dispatch<SetStateAction<Coordinates>>;
  onEditPos: (newPos: Coordinates) => Promise<void>;
}

const MapComponent: FC<MapComponentProps> = (props) => {
  const {
    documents,
    documentSelected,
    visualLinks,
    positionView,
    editPositionMode,
    editDocumentMode,
    setModalOpen,
    setSidebarOpen,
    setdocumentSelected,
    onEditPos,
    setNewPosition,
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
    setNewPosition({ latitude: lat, longitude: lng });
    if (!editPositionMode) {
      // Insert Document Position flow
      setdocumentSelected(null);
      setModalOpen(true);
    } else {
      //Edit Document Position Flow
      onEditPos({ latitude: lat, longitude: lng });
    }
  };

  useEffect(() => {
    if (!isLoaded || !map || !positionView) return;

    map.addListener("click", onMapClick);

    return () => {
      google.maps.event.clearInstanceListeners(map);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionView]);

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
      setdocumentSelected(doc);

      const newCenter = {
        lat: doc.coordinates?.latitude ?? kirunaCoords.lat,
        lng: doc.coordinates?.longitude
          ? doc.coordinates?.longitude + 0.1 / (map?.getZoom() ?? 1)
          : kirunaCoords.lng,
      };
      if ((map?.getZoom() ?? 0) < 12) map?.setZoom(12);
      map?.setCenter(newCenter);
      map?.panTo(newCenter);
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
    if (!isLoaded || !map || positionView) {
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
      renderer: {
        render: ({ count, position }) => {
          return new google.maps.marker.AdvancedMarkerElement({
            position,
            title: count.toString(),
            content: (() => {
              const div = document.createElement("div");
              div.className = "cluster-icon";
              div.textContent = count.toString();
              return div;
            })(),
          });
        },
      },
      onClusterClick: (event, cluster, map) => {
        if (cluster.bounds) {
          const currentZoom = map.getZoom();

          const newZoom = Math.min(
            (currentZoom ?? 0) + 1,
            (map.getZoom() ?? 0) + 2
          ); // Set new zoom level, (default zooms is the maximum zoom level)

          map.fitBounds(cluster.bounds);
          map.setZoom(newZoom);
        }
      },
    });

    setMarkers(newMarkers);

    return () => {
      markerCluster.clearMarkers();
    };
  }, [isLoaded, map, props]);

  return isLoaded ? (
    <section id="map">
      <MapTypeSelector mapType={mapType} setMapType={setMapType} />
      {positionView && (
        <div className="insert-mode">
          <h2>{!editPositionMode ? "Insert Mode" : "Update Position"}</h2>
          <h3>
            {!editPositionMode
              ? "Select a point on the map, where you want to add a new Document"
              : "Select a point on the map, where you want to update the position of the document selected"}
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
