import { Dispatch, SetStateAction } from "react";
import "../styles/MapComponentsStyles/markers.scss";
import { rewindRing } from "./drawingTools";
import {
  Coordinates,
  CustomMarker,
  Document,
  fromDocumentTypeToIcon,
  PolygonArea,
} from "./interfaces";
import { kirunaCoords } from "./map";
import { PositionMode } from "./modes";
import { createArea, getPolygonCentroid } from "./polygonsTools";

export const createMarker = (
  doc: Document,
  linked: boolean = false,
  map: google.maps.Map,
  positionMode: PositionMode,
  drawingMode: string,
  setDrawnMarker: Dispatch<SetStateAction<google.maps.Marker | undefined>>,
  setDrawnPolygon: Dispatch<SetStateAction<google.maps.Polygon | undefined>>,
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

  if (
    positionMode === PositionMode.None ||
    (positionMode === PositionMode.Insert && drawingMode === "existing")
  ) {
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
      if (drawingMode !== "existing") {
        setSidebarOpen(true);
        setdocumentSelected(doc);
        if (setShowTooltipUploads) setShowTooltipUploads(false);
      } else {
        if (doc.area) {
          const newPolygon = convertPolygonAreaToPolygon(doc.area, map);
          setDrawnPolygon(newPolygon);
        } else if (doc.coordinates) {
          const newMarker = convertCoordinatesToMarkers(doc.coordinates, map);
          setDrawnMarker(newMarker);
        }
      }
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

function convertPolygonAreaToPolygon(
  polygonArea: PolygonArea,
  map: google.maps.Map,
): google.maps.Polygon {
  // 1. Trasforma le coordinate incluse (include) e le escluse (exclude) in percorsi (paths)
  const paths: google.maps.LatLngLiteral[][] = [];

  // Aggiungi il path principale (inclusione)
  const includePath = polygonArea.include.map((coord) => ({
    lat: coord.latitude,
    lng: coord.longitude,
  }));
  const includeLatLngs = includePath.map(
    (coord) => new google.maps.LatLng(coord),
  );
  const orientedIncludePath = rewindRing(includeLatLngs, false); // Antiorario
  paths.push(
    orientedIncludePath.map((latLng) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    })),
  );

  // Aggiungi i percorsi esclusi (buchi)
  polygonArea.exclude.forEach((excludedPath) => {
    const excludePath = excludedPath.map((coord) => ({
      lat: coord.latitude,
      lng: coord.longitude,
    }));
    const excludeLatLngs = excludePath.map(
      (coord) => new google.maps.LatLng(coord),
    );
    const orientedExcludePath = rewindRing(excludeLatLngs, true); // Orario
    paths.push(
      orientedExcludePath.map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      })),
    );
  });

  // 2. Crea e restituisci un oggetto google.maps.Polygon
  const polygon = new google.maps.Polygon({
    paths,
    strokeColor: "rgb(0,255,0)",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "rgb(0,255,0)",
    fillOpacity: 0.35,
    map,
  });

  return polygon;
}

function convertCoordinatesToMarkers(
  coordinates: Coordinates,
  map: google.maps.Map,
): google.maps.Marker {
  // Crea il singolo marker
  return new google.maps.Marker({
    position: { lat: coordinates.latitude, lng: coordinates.longitude }, // Converte in LatLngLiteral
  });
}
