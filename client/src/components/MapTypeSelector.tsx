import { Dispatch, FC, SetStateAction } from "react";
import "../styles/MapTypeSelector.scss";

interface MapTypeSelectorProps {
  mapType: string;
  setMapType: Dispatch<SetStateAction<string>>;
}

const MapTypeSelector: FC<MapTypeSelectorProps> = ({ mapType, setMapType }) => {
  return (
    <div className="map-type-selector-wrapper">
      <span className="material-symbols-outlined">pageview</span>
      <select
        className="map-types"
        value={mapType}
        onChange={(e) => setMapType(e.target.value)}
        required
      >
        <option value={"roadmap"}>RoadMap</option>
        <option value={"satellite"}>Satellite</option>
        <option value={"hybrid"}>Hybrid</option>
        <option value={"terrain"}>Terrain</option>
      </select>
    </div>
  );
};

export default MapTypeSelector;
