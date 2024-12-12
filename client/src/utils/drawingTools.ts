import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import { Document } from "./interfaces";
import { PositionMode } from "./modes";

export const useDrawingTools = (
  map: google.maps.Map | null,
  setDrawingManager: Dispatch<
    SetStateAction<google.maps.drawing.DrawingManager | undefined>
  >,
  setDrawnPolygon: Dispatch<SetStateAction<google.maps.Polygon | undefined>>,
  setDrawnMarker: Dispatch<SetStateAction<google.maps.Marker | undefined>>,
  setdocumentSelected: Dispatch<SetStateAction<Document | null>>,
) => {
  const { positionMode } = useAppContext();
  const { setModalOpen } = useAppContext();
  const [currentMarker, setCurrentMarker] = useState<google.maps.Marker | null>(
    null,
  );
  const [mainPolygon, setMainPolygon] = useState<google.maps.Polygon | null>(
    null,
  );
  const [drawingMode, setDrawingMode] =
    useState<google.maps.drawing.OverlayType | null>(null);

  useEffect(() => {
    if (!map || positionMode !== PositionMode.Insert) return;

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
      if (currentMarker) {
        currentMarker.setMap(null);
        setCurrentMarker(null);
      }
      setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    });

    document.getElementById("marker-btn")?.addEventListener("click", () => {
      if (currentMarker) {
        currentMarker.setMap(null);
        setCurrentMarker(null);
      }
      if (mainPolygon) {
        mainPolygon.setMap(null);
        setMainPolygon(null);
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

          if (!mainPolygon) {
            const firstPoly = newPolygon;
            setMainPolygon(newPolygon);
            firstPoly.setEditable(true);
            firstPoly.setDraggable(true);

            setDrawnPolygon(firstPoly);
          } else {
            // Se esiste un poligono principale, controlliamo cosa fare
            if (isPolygonInsidePolygon(newPolygon, mainPolygon)) {
              // Il nuovo poligono è un buco, aggiungiamolo al poligono principale
              const adjustedPath = rewindRing(path, false); // Rewind per il buco
              mainPolygon
                .getPaths()
                .push(new google.maps.MVCArray(adjustedPath)); // Aggiungiamo il buco
              newPolygon.setMap(null); // Rimuoviamo il poligono dalla mappa
              mainPolygon.setEditable(true);
              mainPolygon.setDraggable(true);
              setDrawnPolygon(mainPolygon); // Aggiorniamo lo stato
            } else {
              // Il nuovo poligono non è un buco, mostriamo un errore
              newPolygon.setMap(null); // Rimuoviamo il nuovo poligono
              alert(
                "Error: You can only create holes inside the main polygon. Please try again.",
              );
            }
            setDrawingMode(null);
          }
        }
      },
    );

    const markerCompleteListener = google.maps.event.addListener(
      drawingManager,
      "markercomplete",
      (marker: google.maps.Marker) => {
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
  }, [map, positionMode, currentMarker, mainPolygon, drawingMode]);
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
function rewindRing(
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
