import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import { PositionMode } from "./modes";

export const useDrawingTools = (
  map: google.maps.Map | null,
  drawnPolygon: google.maps.Polygon | undefined,
  setDrawingManager: Dispatch<
    SetStateAction<google.maps.drawing.DrawingManager | undefined>
  >,
  setDrawnPolygon: Dispatch<SetStateAction<google.maps.Polygon | undefined>>,
  setDrawnMarker: Dispatch<SetStateAction<google.maps.Marker | undefined>>,
  setActiveButton: Dispatch<SetStateAction<string>>,
) => {
  const { positionMode } = useAppContext();
  const [currentMarker, setCurrentMarker] = useState<google.maps.Marker | null>(
    null,
  );
  const [drawingMode, setDrawingMode] =
    useState<google.maps.drawing.OverlayType | null>(null);

  useEffect(() => {
    if (!map || positionMode === PositionMode.None) {
      setCurrentMarker(null);
      setDrawingMode(null);
      return;
    }

    // Inizializzazione del DrawingManager
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
      if (currentMarker) {
        currentMarker.setMap(null);
        setCurrentMarker(null);
      }
      setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    });

    document.getElementById("marker-btn")?.addEventListener("click", () => {
      setDrawnPolygon(undefined);
      if (currentMarker) {
        currentMarker.setMap(null);
        setCurrentMarker(null);
      }
      if (drawnPolygon) {
        drawnPolygon.setMap(null);
        setDrawnPolygon(undefined);
      }
      setDrawingMode(google.maps.drawing.OverlayType.MARKER);
    });

    // Listener per l'evento di completamento del disegno
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
            // Se esiste un poligono principale, controlliamo cosa fare
            if (isPolygonInsidePolygon(newPolygon, drawnPolygon)) {
              // Il nuovo poligono è un buco, aggiungiamolo al poligono principale
              const adjustedPath = rewindRing(path, false); // Rewind per il buco
              drawnPolygon
                .getPaths()
                .push(new google.maps.MVCArray(adjustedPath)); // Aggiungiamo il buco
              newPolygon.setMap(null); // Rimuoviamo il poligono dalla mappa
              drawnPolygon.setEditable(true);
              drawnPolygon.setDraggable(true);
              setDrawnPolygon(drawnPolygon); // Aggiorniamo lo stato
            } else {
              // Il nuovo poligono non è un buco, mostriamo un errore
              newPolygon.setMap(null); // Rimuoviamo il nuovo poligono
              alert(
                "Error: You can only create holes inside the main polygon. Please try again.",
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
        setCurrentMarker(marker);
        setDrawnMarker(marker);
        setDrawingMode(null);
      },
    );

    // Cleanup del listener e del DrawingManager
    return () => {
      google.maps.event.removeListener(overlayCompleteListener);
      google.maps.event.removeListener(markerCompleteListener);
      drawingManager.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, positionMode, currentMarker, drawnPolygon, drawingMode]);
};

// Funzione per verificare se un poligono è dentro un altro
function isPolygonInsidePolygon(
  innerPolygon: google.maps.Polygon,
  outerPolygon: google.maps.Polygon,
): boolean {
  const points = innerPolygon.getPath().getArray();
  return points.every((point) =>
    google.maps.geometry.poly.containsLocation(point, outerPolygon),
  );
}

// Funzione per calcolare l'orientamento del poligono (reversa o meno)
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
