import { Dispatch, SetStateAction, useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import { Document, PolygonArea } from "./interfaces";
import { PositionMode } from "./modes";

export const useDrawingTools = (
  map: google.maps.Map | null,
  setdocumentSelected: Dispatch<SetStateAction<Document | null>>,
) => {
  const { setModalOpen, positionMode } = useAppContext();
  const { setDocumentFormSelected } = useDocumentFormContext();

  useEffect(() => {
    if (!map || positionMode !== PositionMode.Insert) return;

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: "#00FF00",
        fillOpacity: 0.5,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(map);

    const overlayCompleteListener = google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      async (event: google.maps.drawing.OverlayCompleteEvent) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const polygon = event.overlay as google.maps.Polygon;
          const path = polygon.getPath();
          const newPolygonArea: PolygonArea = {
            include: path.getArray().map((latLng) => ({
              latitude: latLng.lat(),
              longitude: latLng.lng(),
            })),
            exclude: [],
          };
          setDocumentFormSelected((prev) => ({
            ...prev,
            coordinates: undefined,
            area: newPolygonArea,
          }));
          drawingManager.setDrawingMode(null);
          setdocumentSelected(null);
          setModalOpen(true);
          polygon.setMap(null);
        }
      },
    );

    return () => {
      google.maps.event.removeListener(overlayCompleteListener);
      drawingManager.setMap(null);
    };
  }, [map, positionMode]);
};

export const createArea = (
  doc: Document,
  map: google.maps.Map,
  positionMode: PositionMode,
  setPolygon?: Dispatch<SetStateAction<google.maps.Polygon | null>>,
): google.maps.Polygon | null => {
  if (!doc.area) return null;
  const includePaths = (doc.area.include || []).map((coord) => ({
    lat: parseFloat(coord.latitude?.toString() || "NaN"),
    lng: parseFloat(coord.longitude?.toString() || "NaN"),
  }));

  const excludePaths = (doc.area.exclude || []).map((exclude) =>
    exclude.map((coord) => ({
      lat: parseFloat(coord.latitude?.toString() || "NaN"),
      lng: parseFloat(coord.longitude?.toString() || "NaN"),
    })),
  );

  const isValidLatLng = (coord: { lat: number; lng: number }) =>
    !isNaN(coord.lat) && !isNaN(coord.lng);

  const validIncludePaths = includePaths.filter(isValidLatLng);
  const validExcludePaths = excludePaths.map((exclude) =>
    exclude.filter(isValidLatLng),
  );

  if (validIncludePaths.length === 0) {
    console.error("Invalid include paths for document", doc);
    return null;
  }

  const area = new google.maps.Polygon({
    paths: [validIncludePaths, ...validExcludePaths],
    fillColor: "#00FF00",
    fillOpacity: 0.5,
    strokeWeight: 2,
    clickable: true,
    draggable: positionMode === PositionMode.Update,
    editable: positionMode === PositionMode.Update,
    zIndex: 1,
  });

  area.setMap(map);

  if (positionMode === PositionMode.Update && setPolygon) setPolygon(area);

  return area;
};

export const clearAreas = (areas: google.maps.Polygon[]) => {
  areas.forEach((area) => area.setMap(null));
};

export const getPolygonCenter = (
  polygonArea: PolygonArea,
): { lat: number; lng: number } => {
  const bounds = new google.maps.LatLngBounds();
  polygonArea.include.forEach((coord) =>
    bounds.extend({ lat: coord.latitude, lng: coord.longitude }),
  );

  const center = bounds.getCenter();
  return { lat: center.lat(), lng: center.lng() };
};
