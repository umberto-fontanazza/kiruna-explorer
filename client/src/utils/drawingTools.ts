import { Dispatch, SetStateAction, useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import { Document, PolygonArea } from "./interfaces";
import { kirunaCoords } from "./map";
import { PositionMode } from "./modes";

export const useDrawingTools = (
  map: google.maps.Map | null,
  positionMode: PositionMode,
  setdocumentSelected: Dispatch<SetStateAction<Document | null>>,
) => {
  const { setModalOpen } = useAppContext();
  const { setDocumentFormSelected } = useDocumentFormContext();

  useEffect(() => {
    if (!map || positionMode === PositionMode.None) return;

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
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
  setSidebarOpen: Dispatch<SetStateAction<boolean>>,
  setdocumentSelected: Dispatch<SetStateAction<Document>>,
): google.maps.Polygon => {
  const area = new google.maps.Polygon({
    paths: [doc.area?.include, doc.area?.exclude],
    fillColor: "#00FF00",
    fillOpacity: 0.5,
    strokeWeight: 2,
    clickable: true,
    zIndex: 1,
  });

  area.addListener("click", () => {
    area.addListener("click", () => {
      setSidebarOpen(true);
      setdocumentSelected(doc);

      //TODO: Center Area
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
  });
  return area;
};

export const clearAreas = (areas: google.maps.Polygon[]) => {
  areas.forEach((area) => area.setMap(null));
};
