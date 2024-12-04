import { Libraries } from "@react-google-maps/api";
export const libraries: Libraries = ["marker", "drawing"];
export const kirunaCoords = { lat: 67.8558, lng: 20.2253 };
export const kirunaCoordinates = {
  latitude: kirunaCoords.lat,
  longitude: kirunaCoords.lng,
};
export const kirunaBoundaries = {
  north: 80.0,
  south: 80.7,
  east: 48.7,
  west: 35.6,
};

export const mapOptions = {
  mapId: "group_15",
  mapTypeControl: false,
  mapTypeControlOptions: {
    mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"],
  },
  minZoom: 8,
  maxZoom: 20,
  fullscreenControl: false,
  restriction: {
    latLngBounds: kirunaBoundaries,
    strictBounds: false,
  },
};
