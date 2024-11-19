import { Libraries } from "@react-google-maps/api";
export const libraries: Libraries = ["marker"];
export const kirunaCoords = { lat: 67.8558, lng: 20.2253 };
export const kirunaBoundaries = {
  north: 67.9,
  south: 67.8,
  east: 20.4,
  west: 20.0,
};

export const mapOptions = {
  mapId: "group_15",
  mapTypeControl: false,
  mapTypeControlOptions: {
    mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"],
  },
  minZoom: 12,
  maxZoom: 20,
  restriction: {
    latLngBounds: kirunaBoundaries,
    strictBounds: false,
  },
};
