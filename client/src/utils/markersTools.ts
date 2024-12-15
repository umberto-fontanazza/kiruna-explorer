import { Dispatch, SetStateAction } from "react";
import "../styles/MapComponentsStyles/markers.scss";
import { createArea, getPolygonCentroid } from "./drawingTools";
import {
  Coordinates,
  CustomMarker,
  Document,
  fromDocumentTypeToIcon,
} from "./interfaces";
import { kirunaCoords } from "./map";
import { PositionMode } from "./modes";
import { createArea, getPolygonCentroid } from "./polygonsTools";

export const createMarker = (
  doc: Document,
  linked: boolean = false,
  map: google.maps.Map,
  positionMode: PositionMode,
  setDrawnMarker: Dispatch<SetStateAction<google.maps.Marker | undefined>>,
  setShowTooltipUploads?: Dispatch<SetStateAction<boolean>>,
  setdocumentSelected?: Dispatch<SetStateAction<Document | null>>,
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>,
): google.maps.marker.AdvancedMarkerElement => {
  const markerDivChild = document.createElement("div");
  const iconName = fromDocumentTypeToIcon.get(doc.type) as string;
  markerDivChild.className = `document-icon ${linked ? "linked" : ""}`;
  markerDivChild.innerHTML = `<span class="material-symbols-outlined color-${iconName} size">${iconName}</span>`;

  const position = doc.area
    ? (getPolygonCentroid(doc.area) ?? {
        lat: doc.coordinates?.latitude ?? 0,
        lng: doc.coordinates?.longitude ?? 0,
      })
    : {
        lat: doc.coordinates?.latitude ?? 0,
        lng: doc.coordinates?.longitude ?? 0,
      };

  const marker: CustomMarker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: position,
    content: markerDivChild,
    gmpDraggable: positionMode === PositionMode.Update,
  });

  marker.document = doc;

  let hoverArea: google.maps.Polygon | null = null;

  const content = document.createElement("div");
  content.innerHTML = doc.title;
  content.classList.add("info-window");

  const infoWindow = new google.maps.InfoWindow({
    headerDisabled: true,
    content: content,
  });

  if (positionMode === PositionMode.None) {
    marker.content?.addEventListener("mouseenter", () => {
      if (doc.area && map) {
        hoverArea = createArea(doc, map, positionMode);
      }
      infoWindow.open(map, marker);
      setTimeout(() => content.classList.add("show"), 0);
    });

    marker.content?.addEventListener("mouseleave", () => {
      if (hoverArea) {
        hoverArea.setMap(null);
        hoverArea = null;
      }
      infoWindow.close();
      content.classList.remove("show");
    });
  }

  if (
    setSidebarOpen &&
    setdocumentSelected &&
    positionMode !== PositionMode.Update
  ) {
    marker.addListener("click", () => {
      setSidebarOpen(true);
      setdocumentSelected(doc);
      if (setShowTooltipUploads) setShowTooltipUploads(false);

      const newCenter = doc.coordinates
        ? {
            lat: doc.coordinates.latitude,
            lng: doc.coordinates.longitude,
          }
        : doc.area
          ? (getPolygonCentroid(doc.area) ?? kirunaCoords)
          : kirunaCoords;
      if ((map?.getZoom() ?? 0) < 12) map?.setZoom(12);
      map?.setCenter(newCenter);
      map?.panTo(newCenter);
    });
  }

  if (positionMode === PositionMode.Update && setDrawnMarker) {
    marker.addListener("dragend", (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const newLatLng = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        const newMarker = new google.maps.Marker({
          position: newLatLng,
        });
        setDrawnMarker(newMarker);
      }
    });
  }

  return marker;
};
