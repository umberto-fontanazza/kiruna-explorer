import { Dispatch, MutableRefObject, SetStateAction } from "react";
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
  previousClusterElement: MutableRefObject<HTMLDivElement | undefined>,
  setDrawnMarker: Dispatch<SetStateAction<google.maps.Marker | undefined>>,
  setDrawnPolygon: Dispatch<SetStateAction<google.maps.Polygon | undefined>>,
  setShowTooltipUploads?: Dispatch<SetStateAction<boolean>>,
  setdocumentSelected?: Dispatch<SetStateAction<Document | null>>,
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>,
  previousMarkerRef?: MutableRefObject<CustomMarker | undefined>,
  drawnPolygon?: google.maps.Polygon,
  drawnMarker?: google.maps.Marker,
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
    // (positionMode !== PositionMode.Insert &&
    drawingMode === "existing"
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
    setdocumentSelected
    // positionMode !== PositionMode.Update
  ) {
    marker.addListener("click", () => {
      if (previousMarkerRef?.current) {
        const prevMarkerContent = previousMarkerRef.current
          .content as HTMLElement;
        // Assicurati che il contenuto precedente esista prima di modificarlo
        if (prevMarkerContent) {
          prevMarkerContent.classList.remove("iytig");
        }
      }
      // Aggiungi la nuova classe al contenuto del marker corrente
      if (marker.content) {
        const currentMarkerContent = marker.content as HTMLElement;
        currentMarkerContent.classList.add("iytig");
      }

      // Aggiorna il riferimento al marker corrente
      if (previousMarkerRef) {
        previousMarkerRef.current = marker;
      }

      if (previousClusterElement?.current) {
        previousClusterElement.current.classList.remove("selected");
        previousClusterElement.current = undefined;
      }
      if (drawingMode !== "existing") {
        setSidebarOpen(true);
        setdocumentSelected(doc);
        if (setShowTooltipUploads) setShowTooltipUploads(false);
      }
      if (drawnPolygon) {
        drawnPolygon.setMap(null);
        setDrawnPolygon(undefined);
      }
      if (drawnMarker) {
        drawnMarker.setMap(null);
        setDrawnMarker(undefined);
      }
      if (doc.area) {
        const newPolygon = convertPolygonAreaToPolygon(doc.area, map);
        setDrawnPolygon(newPolygon);
      } else if (doc.coordinates) {
        const newMarker = convertCoordinatesToMarkers(doc.coordinates);
        setDrawnMarker(newMarker);
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
        setDrawnPolygon(undefined);
      }
    });
  }

  return marker;
};

export function convertPolygonAreaToPolygon(
  polygonArea: PolygonArea,
  map: google.maps.Map,
): google.maps.Polygon {
  const paths: google.maps.LatLngLiteral[][] = [];

  const includePath = polygonArea.include.map((coord) => ({
    lat: coord.latitude,
    lng: coord.longitude,
  }));
  const includeLatLngs = includePath.map(
    (coord) => new google.maps.LatLng(coord),
  );
  const orientedIncludePath = rewindRing(includeLatLngs, false);
  paths.push(
    orientedIncludePath.map((latLng) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    })),
  );

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
    strokeColor: "#fecb00",
    strokeOpacity: 0.8,
    strokeWeight: 4,
    fillColor: "#fecb00",
    fillOpacity: 0.35,
    map,
  });

  return polygon;
}

export function convertCoordinatesToMarkers(
  coordinates: Coordinates,
): google.maps.Marker {
  // Crea il singolo marker
  return new google.maps.Marker({
    position: { lat: coordinates.latitude, lng: coordinates.longitude }, // Converte in LatLngLiteral
  });
}
