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
        fillColor: "#fecb00",
        fillOpacity: 0.5,
        strokeWeight: 4,
        editable: true,
        strokeColor: "#fecb00",
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
    fillColor: "#fecb00",
    fillOpacity: 0.5,
    strokeWeight: 4,
    strokeColor: "#fecb00",
    zIndex: 1,
    clickable: true,
    draggable: positionMode === PositionMode.Update,
    editable: positionMode === PositionMode.Update,
  });

  area.setMap(map);

  if (positionMode === PositionMode.Update && setPolygon) setPolygon(area);

  return area;
};

export const clearAreas = (areas: google.maps.Polygon[]) => {
  areas.forEach((area) => area.setMap(null));
};

export const getPolygonCentroid = (polygonArea: {
  include: { latitude: number; longitude: number }[];
}): { lat: number; lng: number } => {
  const coordinates = polygonArea.include;

  if (coordinates.length < 3) {
    throw new Error("A polygon must have at least three vertices.");
  }

  let area = 0;
  let centroidX = 0;
  let centroidY = 0;

  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const x1 = coordinates[i].longitude;
    const y1 = coordinates[i].latitude;
    const x2 = coordinates[(i + 1) % n].longitude;
    const y2 = coordinates[(i + 1) % n].latitude;

    const crossProduct = x1 * y2 - x2 * y1;

    area += crossProduct;
    centroidX += (x1 + x2) * crossProduct;
    centroidY += (y1 + y2) * crossProduct;
  }

  area *= 0.5;

  if (area === 0) {
    throw new Error("The polygon has zero area and is likely degenerate.");
  }

  centroidX /= 6 * area;
  centroidY /= 6 * area;

  return { lat: centroidY, lng: centroidX };
};
