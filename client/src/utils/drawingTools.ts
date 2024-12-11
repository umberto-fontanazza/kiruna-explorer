import { Dispatch, SetStateAction, useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { PositionMode } from "./modes";

// export const useDrawingTools = (
//   map: google.maps.Map | null,
//   setDrawingManager: Dispatch<
//     SetStateAction<google.maps.drawing.DrawingManager>
//   >,
//   setDrawnPolygon: Dispatch<SetStateAction<google.maps.Polygon>>,
// ) => {
//   const { positionMode } = useAppContext();
//   const [mainPolygon, setMainPolygon] = useState<google.maps.Polygon | null>(
//     null,
//   );

//   useEffect(() => {
//     if (!map || positionMode !== PositionMode.Insert) return;

//     const drawingManager = new google.maps.drawing.DrawingManager({
//       drawingMode: google.maps.drawing.OverlayType.POLYGON,
//       drawingControl: false,
//       polygonOptions: {
//         fillColor: "#fecb00",
//         fillOpacity: 0.5,
//         strokeWeight: 4,
//         editable: true,
//         strokeColor: "#fecb00",
//         zIndex: 1,
//       },
//     });

//     drawingManager.setMap(map);
//     console.log(drawingManager);
//     setDrawingManager(drawingManager);

//     document.getElementById("polygon-btn")?.addEventListener("click", () => {
//       drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
//     });

//     document.getElementById("marker-btn")?.addEventListener("click", () => {
//       drawingManager.setDrawingMode(null);
//     });

//     const overlayCompleteListener = google.maps.event.addListener(
//       drawingManager,
//       "overlaycomplete",
//       async (event: google.maps.drawing.OverlayCompleteEvent) => {
//         if (event.type === google.maps.drawing.OverlayType.POLYGON) {
//           const polygon = event.overlay as google.maps.Polygon;
//           const path = polygon.getPath().getArray();

//           if (!mainPolygon) {
//             // Se non esiste un poligono principale, questo diventa il principale
//             setMainPolygon(polygon);
//             setDrawnPolygon(polygon);
//             return;
//           }

//           if (isPolygonInsidePolygon(polygon, mainPolygon)) {
//             // Se il poligono è dentro il principale, trattalo come un buco
//             const mainPaths = mainPolygon.getPaths();
//             mainPaths.push(new google.maps.MVCArray(path));
//             polygon.setMap(null); // Rimuovi il poligono-buco dalla mappa
//           } else {
//             // Se il poligono è più grande del principale
//             const mainBounds = calculatePolygonBounds(mainPolygon);
//             const newBounds = calculatePolygonBounds(polygon);

//             if (isPolygonLarger(newBounds, mainBounds)) {
//               // Cancella il poligono principale precedente
//               mainPolygon.setMap(null);
//               setMainPolygon(polygon);
//               setDrawnPolygon(polygon);
//             } else {
//               // Se non è valido (es. un buco più grande), cancella il poligono e mostra errore
//               alert("Error: The hole can't be larger than the main Polygon!");
//               polygon.setMap(null);
//             }
//           }
//         }
//       },
//     );

//     return () => {
//       google.maps.event.removeListener(overlayCompleteListener);
//       drawingManager.setMap(null);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [map, positionMode]);

// Funzione per calcolare i limiti di un poligono
function calculatePolygonBounds(polygon: google.maps.Polygon) {
  const bounds = new google.maps.LatLngBounds();
  const paths = polygon.getPaths().getArray();
  paths.forEach((path) => {
    path.getArray().forEach((latLng) => bounds.extend(latLng));
  });
  return bounds;
}

// Funzione per confrontare le dimensioni di due bounds
function isPolygonLarger(
  newBounds: google.maps.LatLngBounds,
  existingBounds: google.maps.LatLngBounds,
): boolean {
  const newArea =
    (newBounds.getNorthEast().lat() - newBounds.getSouthWest().lat()) *
    (newBounds.getNorthEast().lng() - newBounds.getSouthWest().lng());
  const existingArea =
    (existingBounds.getNorthEast().lat() -
      existingBounds.getSouthWest().lat()) *
    (existingBounds.getNorthEast().lng() - existingBounds.getSouthWest().lng());
  return newArea > existingArea;
}
// };

export const useDrawingTools = (
  map: google.maps.Map | null,
  setDrawingManager: Dispatch<
    SetStateAction<google.maps.drawing.DrawingManager | undefined>
  >,
  setDrawnPolygon: Dispatch<SetStateAction<google.maps.Polygon | undefined>>,
) => {
  const { positionMode } = useAppContext();

  useEffect(() => {
    if (!map || positionMode !== PositionMode.Insert) return;

    // Inizializzazione del DrawingManager
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
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
    setDrawingManager(drawingManager); // Aggiorniamo lo stato con il DrawingManager

    let mainPolygon: google.maps.Polygon | null = null; // Poligono principale

    // Listener per l'evento di completamento del disegno
    const overlayCompleteListener = google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (event: google.maps.drawing.OverlayCompleteEvent) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const newPolygon = event.overlay as google.maps.Polygon;
          const path = newPolygon.getPath().getArray();
          const rewindPath = rewindRing(path, true); // Assicuriamoci che il path sia coerente
          newPolygon.setPath(rewindPath);

          if (!mainPolygon) {
            // Se non esiste un poligono principale, impostiamolo
            mainPolygon = newPolygon;
            setDrawnPolygon(mainPolygon);
          } else {
            // Se esiste un poligono principale, controlliamo cosa fare
            if (isPolygonInsidePolygon(newPolygon, mainPolygon)) {
              // Il nuovo poligono è un buco, aggiungiamolo al poligono principale
              const adjustedPath = rewindRing(path, false); // Rewind per il buco
              mainPolygon
                .getPaths()
                .push(new google.maps.MVCArray(adjustedPath)); // Aggiungiamo il buco
              newPolygon.setMap(null); // Rimuoviamo il poligono dalla mappa
              setDrawnPolygon(mainPolygon); // Aggiorniamo lo stato
            } else {
              // Il nuovo poligono non è un buco, mostriamo un errore
              newPolygon.setMap(null); // Rimuoviamo il nuovo poligono
              alert(
                "Error: You can only create holes inside the main polygon. Please try again.",
              );
            }
          }
        }
      },
    );

    // Cleanup del listener e del DrawingManager
    return () => {
      google.maps.event.removeListener(overlayCompleteListener);
      drawingManager.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, positionMode]);
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
