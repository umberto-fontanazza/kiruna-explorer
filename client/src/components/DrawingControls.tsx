import { Dispatch, FC, SetStateAction } from "react";
import { kirunaCoords } from "../utils/map";
import { PositionMode } from "../utils/modes";
import { createMunicipalArea } from "../utils/municipalArea";

interface DrawingControlsProps {
  positionMode: PositionMode;
  activeButton: string;
  setActiveButton: Dispatch<SetStateAction<string>>;
  map: google.maps.Map | null;
  drawnPolygon: google.maps.Polygon | undefined;
  drawnMarker: google.maps.Marker | undefined;
  drawingManager: google.maps.drawing.DrawingManager | undefined;
  setDrawingMode: Dispatch<SetStateAction<string>>;
  municipalArea: google.maps.Polygon[] | undefined;
  setMunicipalArea: Dispatch<SetStateAction<google.maps.Polygon[] | undefined>>;
}

const DrawingControls: FC<DrawingControlsProps> = ({
  positionMode,
  activeButton,
  setActiveButton,
  map,
  drawnPolygon,
  drawnMarker,
  drawingManager,
  setDrawingMode,
  municipalArea,
  setMunicipalArea,
}) => {
  const handleMunicipalButtonClick = () => {
    setActiveButton("municipal-btn");

    if (!map) return;

    // Nascondi poligoni o marker esistenti
    drawnPolygon?.setMap(null);
    drawnMarker?.setMap(null);

    // Crea l'area municipale
    if (!municipalArea) {
      const municipalPolygons = createMunicipalArea(map);
      setMunicipalArea(municipalPolygons);
    }

    // Resetta il drawing manager
    drawingManager?.setDrawingMode(null);
    setDrawingMode("");
  };

  const handlePolygonButtonClick = () => {
    setActiveButton("polygon-btn");

    if (positionMode !== PositionMode.Update) {
      map?.setZoom(11);
      map?.setCenter(kirunaCoords);
    }

    // Rimuovi eventuali aree municipali esistenti
    if (municipalArea) {
      municipalArea.forEach((area) => area.setMap(null));
      setMunicipalArea(undefined);
    }

    // Cambia la modalità di disegno in POLYGON
    drawingManager?.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    setDrawingMode("polygon");
  };

  const handleMarkerButtonClick = () => {
    setActiveButton("marker-btn");

    // Centra la mappa sulle coordinate di default
    if (positionMode !== PositionMode.Update) {
      map?.setZoom(11);
      map?.setCenter(kirunaCoords);
    }

    if (municipalArea) {
      municipalArea.forEach((area) => area.setMap(null));
      setMunicipalArea(undefined);
    }
    setDrawingMode("marker");
  };

  return (
    positionMode !== PositionMode.None && (
      <div className="drawing-controls">
        <button
          id="municipal-btn"
          className={activeButton === "municipal-btn" ? "active" : ""}
          onClick={handleMunicipalButtonClick}
        >
          <div className="municipal-container">
            <span className="material-symbols-outlined">location_city</span>
            <h4>Municipal Area</h4>
          </div>
        </button>
        <button
          id="polygon-btn"
          className={activeButton === "polygon-btn" ? "active" : ""}
          onClick={handlePolygonButtonClick}
        >
          <div className="polygon-container">
            <span className="material-symbols-outlined">polyline</span>
            <h4>{drawnPolygon ? "Add a Hole" : "Polygon"}</h4>
          </div>
        </button>
        <button
          id="marker-btn"
          className={activeButton === "marker-btn" ? "active" : ""}
          onClick={handleMarkerButtonClick}
        >
          <div className="marker-container">
            <span className="material-symbols-outlined">explore_nearby</span>
            <h4>Marker</h4>
          </div>
        </button>
      </div>
    )
  );
};

export default DrawingControls;
