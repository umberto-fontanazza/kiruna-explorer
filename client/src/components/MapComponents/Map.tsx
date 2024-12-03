import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import { useDocumentFormContext } from "../../context/DocumentFormContext";
import "../../styles/MapComponentsStyles/Map.scss";
import {
  createArea,
  getPolygonCenter,
  useDrawingTools,
} from "../../utils/drawingTools";
import {
  Document,
  Link,
  PolygonArea,
  fromDocumentTypeToIcon,
} from "../../utils/interfaces";
import { kirunaCoords, libraries, mapOptions } from "../../utils/map";
import { PositionMode } from "../../utils/modes";
import MapTypeSelector from "../MapTypeSelector";

interface MapComponentProps {
  documents: Document[];
  docSelected: Document | null;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setdocumentSelected: Dispatch<SetStateAction<Document | null>>;
}

const MapComponent: FC<MapComponentProps> = (props) => {
  const { documents, docSelected, setSidebarOpen, setdocumentSelected } = props;
  const {
    visualLinks,
    positionMode,
    setModalOpen,
    handleEditPositionModeConfirm,
  } = useAppContext();
  const { setDocumentFormSelected, setIsSubmit } = useDocumentFormContext();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapType, setMapType] = useState<string>("satellite");
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);
  const [saved, setSaved] = useState(false);
  const [polygonArea, setPolygonArea] = useState<google.maps.Polygon | null>(
    null,
  );

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const onMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setDocumentFormSelected((prev) => ({
      ...prev,
      coordinates: { latitude: lat, longitude: lng },
      area: undefined,
    }));

    if (positionMode === PositionMode.Insert) {
      // Insert Document Position flow
      setdocumentSelected(null);
      setModalOpen(true);
    }

    setIsSubmit(false);
  };

  useEffect(() => {
    if (!isLoaded || !map || positionMode === PositionMode.None) return;

    map.addListener("click", onMapClick);

    return () => {
      google.maps.event.clearInstanceListeners(map);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionMode]);

  const createMarker = (
    doc: Document,
    linked: boolean = false,
  ): google.maps.marker.AdvancedMarkerElement => {
    const markerDivChild = document.createElement("div");
    const iconName = fromDocumentTypeToIcon.get(doc.type) as string;
    markerDivChild.className = `document-icon ${linked ? "linked" : ""}`;
    markerDivChild.innerHTML = `<span class="material-symbols-outlined color-${iconName} size">${iconName}</span>`;

    const position = doc.area
      ? (getPolygonCenter(doc.area) ?? {
          lat: doc.coordinates?.latitude ?? 0,
          lng: doc.coordinates?.longitude ?? 0,
        })
      : {
          lat: doc.coordinates?.latitude ?? 0,
          lng: doc.coordinates?.longitude ?? 0,
        };

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: position,
      content: markerDivChild,
      title: doc.title,
      gmpDraggable: positionMode === PositionMode.Update,
    });

    let hoverArea: google.maps.Polygon | null = null;

    // Event listener per il mouseover
    marker.content?.addEventListener("mouseenter", () => {
      if (doc.area && map) {
        hoverArea = createArea(doc, map, positionMode);
      }
    });

    // Event listener per il mouseout
    marker.content?.addEventListener("mouseleave", () => {
      if (hoverArea) {
        hoverArea.setMap(null);
        hoverArea = null;
      }
    });

    marker.addListener("click", () => {
      setSidebarOpen(true);
      setdocumentSelected(doc);

      const newCenter = doc.coordinates
        ? {
            lat: doc.coordinates.latitude,
            lng: doc.coordinates.longitude,
          }
        : doc.area
          ? (getPolygonCenter(doc.area) ?? kirunaCoords)
          : kirunaCoords;
      if ((map?.getZoom() ?? 0) < 12) map?.setZoom(12);
      map?.setCenter(newCenter);
      map?.panTo(newCenter);
    });

    if (positionMode === PositionMode.Update) {
      marker.addListener("dragend", (event: any) => {
        const newLatLng = {
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng(),
        };

        if (docSelected) {
          handleEditPositionModeConfirm(doc, newLatLng);
        }
      });
    }

    return marker;
  };

  const isSelectedOrLinked = (doc: Document) => {
    const linkedIDs: number[] =
      docSelected?.links?.map((link: Link) => link.targetDocumentId) ?? [];
    if (doc.id === docSelected?.id) return true;
    if (linkedIDs.includes(doc.id)) return true;
    return false;
  };

  const clearMarkers = (doc?: Document) => {
    if (doc) {
      documents.filter((document) => document.id === doc.id);
    }
    markers.forEach((marker) => (marker.map = null));
  };

  useEffect(() => {
    if (!isLoaded || !map || positionMode === PositionMode.Insert) {
      clearMarkers();
      return;
    }

    if (positionMode === PositionMode.Update && docSelected?.area) {
      createArea(docSelected, map, positionMode, setPolygonArea);
      return;
    }

    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = documents
      .filter((doc) => {
        if (positionMode === PositionMode.Update) {
          return doc.id === docSelected?.id;
        }
        return doc.coordinates || doc.area;
      })
      .filter((doc) => (visualLinks ? isSelectedOrLinked(doc) : true))
      .map((doc) =>
        createMarker(doc, visualLinks && doc.id !== docSelected?.id),
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
            (map.getZoom() ?? 0) + 2,
          ); // Set new zoom level, (default zooms is the maximum zoom level)

          map.fitBounds(cluster.bounds);
          map.setZoom(newZoom);
        }
      },
    });

    setMarkers(newMarkers);

    if (visualLinks && newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        if (marker.position) {
          bounds.extend(marker.position);
        }
      });
      map.fitBounds(bounds);
    }

    return () => {
      markerCluster.clearMarkers();
    };
  }, [isLoaded, map, documents]);

  useEffect(() => {
    if (
      docSelected &&
      saved &&
      polygonArea &&
      positionMode === PositionMode.Update
    ) {
      const path = polygonArea.getPath();
      const newPolygonArea: PolygonArea = {
        include: path.getArray().map((latLng) => ({
          latitude: latLng.lat(),
          longitude: latLng.lng(),
        })),
        exclude: [],
      };
      handleEditPositionModeConfirm(docSelected, newPolygonArea);
      polygonArea.setMap(null);
      setSaved(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  useDrawingTools(map, () => setdocumentSelected);

  return isLoaded ? (
    <section id="map">
      <MapTypeSelector mapType={mapType} setMapType={setMapType} />
      {positionMode !== PositionMode.None && (
        <div className="insert-mode">
          <h2>
            {positionMode === PositionMode.Insert
              ? "Insert Mode"
              : "Update Position"}
          </h2>
          <h3>
            {positionMode === PositionMode.Insert
              ? "Select a point on the map, where you want to add a new Document"
              : "Select a point on the map, where you want to update the position of the document selected"}
          </h3>
          {positionMode === PositionMode.Update && docSelected?.area && (
            <button
              className="edit-area-btn"
              onClick={() => {
                setSaved(true);
              }}
            >
              Save
            </button>
          )}
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
        center={kirunaCoords}
        onLoad={setMap}
      />
    </section>
  ) : (
    <div>Loading...</div>
  );
};

export default MapComponent;
