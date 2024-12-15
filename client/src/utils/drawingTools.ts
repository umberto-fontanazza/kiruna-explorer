import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { AlertHandle } from "../components/Alert";
import { useAppContext } from "../context/appContext";
import { AlertType } from "./alertType";
import { PositionMode } from "./modes";

export const useDrawingTools = (
  map: google.maps.Map | null,
  drawnPolygon: google.maps.Polygon | undefined,
  drawnMarker: google.maps.Marker | undefined,
  setDrawingManager: Dispatch<
    SetStateAction<google.maps.drawing.DrawingManager | undefined>
  >,
  setDrawnPolygon: Dispatch<SetStateAction<google.maps.Polygon | undefined>>,
  setDrawnMarker: Dispatch<SetStateAction<google.maps.Marker | undefined>>,
  setActiveButton: Dispatch<SetStateAction<string>>,
  alertRef: RefObject<AlertHandle>,
) => {
  const { positionMode } = useAppContext();
  const [drawingMode, setDrawingMode] =
    useState<google.maps.drawing.OverlayType | null>(null);

  useEffect(() => {
    if (!map || positionMode === PositionMode.None) {
      setDrawingMode(null);
      return;
    }

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: drawingMode,
      drawingControl: false,
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
    setDrawingManager(drawingManager);

    document.getElementById("polygon-btn")?.addEventListener("click", () => {
      setDrawnMarker(undefined);
      if (drawnMarker) {
        drawnMarker.setMap(null);
        setDrawnMarker(undefined);
      }
      setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    });

    document.getElementById("marker-btn")?.addEventListener("click", () => {
      setDrawnPolygon(undefined);
      if (drawnMarker) {
        drawnMarker.setMap(null);
        setDrawnMarker(undefined);
      }
      if (drawnPolygon) {
        drawnPolygon.setMap(null);
        setDrawnPolygon(undefined);
      }
      setDrawingMode(google.maps.drawing.OverlayType.MARKER);
    });

    const overlayCompleteListener = google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (event: google.maps.drawing.OverlayCompleteEvent) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const newPolygon = event.overlay as google.maps.Polygon;
          const path = newPolygon.getPath().getArray();
          const rewindPath = rewindRing(path, true);
          newPolygon.setPath(rewindPath);

          if (!drawnPolygon) {
            newPolygon.setEditable(true);
            newPolygon.setDraggable(true);
            setDrawnPolygon(newPolygon);
          } else {
            if (isPolygonInsidePolygon(newPolygon, drawnPolygon)) {
              const adjustedPath = rewindRing(path, false);
              drawnPolygon
                .getPaths()
                .push(new google.maps.MVCArray(adjustedPath));
              newPolygon.setMap(null);
              drawnPolygon.setEditable(true);
              drawnPolygon.setDraggable(true);
              setDrawnPolygon(drawnPolygon);
            } else {
              newPolygon.setMap(null);
              alertRef.current?.showAlert(
                "You can only create holes inside the main polygon. Please try again.",
                AlertType.Error,
                3000,
              );
            }
          }
          setActiveButton("");
          setDrawingManager(undefined);
          setDrawingMode(null);
        }
      },
    );

    const markerCompleteListener = google.maps.event.addListener(
      drawingManager,
      "markercomplete",
      (marker: google.maps.Marker) => {
        setActiveButton("");
        setDrawnMarker(marker);
        setDrawingMode(null);
      },
    );

    return () => {
      google.maps.event.removeListener(overlayCompleteListener);
      google.maps.event.removeListener(markerCompleteListener);
      drawingManager.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, positionMode, drawnMarker, drawnPolygon, drawingMode]);
};

function isPolygonInsidePolygon(
  innerPolygon: google.maps.Polygon,
  outerPolygon: google.maps.Polygon,
): boolean {
  const points = innerPolygon.getPath().getArray();
  return points.every((point) =>
    google.maps.geometry.poly.containsLocation(point, outerPolygon),
  );
}

export function rewindRing(
  ring: google.maps.LatLng[],
  clockwise: boolean,
): google.maps.LatLng[] {
  let area = 0;
  for (let i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
    area += (ring[i].lng() - ring[j].lng()) * (ring[j].lat() + ring[i].lat());
  }
  if (area >= 0 !== clockwise) {
    ring.reverse();
  }
  return ring;
}
