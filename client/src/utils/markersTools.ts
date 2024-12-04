import { Dispatch, SetStateAction } from "react";
import "../styles/MapComponentsStyles/markers.scss";
import { createArea, getPolygonCentroid } from "./drawingTools";
import { Coordinates, Document, fromDocumentTypeToIcon } from "./interfaces";
import { kirunaCoords } from "./map";
import { PositionMode } from "./modes";

export const createMarker = (
  doc: Document,
  linked: boolean = false,
  map: google.maps.Map,
  positionMode: PositionMode,
  setdocumentSelected?: Dispatch<SetStateAction<Document | null>>,
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>,
  setNewMarkerPosition?: Dispatch<SetStateAction<Coordinates | null>>,
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
    //TODO: Heeelp
    //createMunicipalArea(map);
  });

  // Event listener per il mouseout
  marker.content?.addEventListener("mouseleave", () => {
    if (hoverArea) {
      hoverArea.setMap(null);
      hoverArea = null;
    }
  });

  if (setSidebarOpen && setdocumentSelected) {
    marker.addListener("click", () => {
      setSidebarOpen(true);
      setdocumentSelected(doc);

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

  if (positionMode === PositionMode.Update && setNewMarkerPosition) {
    marker.addListener("dragend", (event: any) => {
      const newLatLng = {
        latitude: event.latLng.lat(),
        longitude: event.latLng.lng(),
      };
      setNewMarkerPosition(newLatLng);
    });
  }

  return marker;
};
