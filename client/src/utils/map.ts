import { Libraries } from "@react-google-maps/api";
export const libraries: Libraries = ["marker"];
export const kirunaCoords = { lat: 67.8558, lng: 20.2253 };
export const kirunaCoordinates = {
  latitude: kirunaCoords.lat,
  longitude: kirunaCoords.lng,
};
export const kirunaBoundaries = {
  north: 68.0,
  south: 67.7,
  east: 20.7,
  west: 19.6,
};

export const mapOptions = {
  mapId: "group_15",
  mapTypeControl: false,
  mapTypeControlOptions: {
    mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"],
  },
  minZoom: 11,
  maxZoom: 20,
  fullscreenControl: false,
  restriction: {
    latLngBounds: kirunaBoundaries,
    strictBounds: false,
  },
};
