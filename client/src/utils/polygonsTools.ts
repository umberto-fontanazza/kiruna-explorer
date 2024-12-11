import { Document, PolygonArea } from "./interfaces";
import { PositionMode } from "./modes";

export const createArea = (
  doc: Document,
  map: google.maps.Map,
  positionMode: PositionMode,
): google.maps.Polygon | null => {
  if (!doc.area) return null;
  const { include, exclude } = parseAreaPaths(doc.area);

  if (include.length === 0) {
    console.error("Invalid include paths for document", doc);
    return null;
  }

  const area = new google.maps.Polygon({
    paths: [include, ...exclude],
    fillColor: "#fecb00",
    fillOpacity: 0.5,
    strokeWeight: 4,
    strokeColor: "#fecb00",
    zIndex: 1,
    clickable: true,
    draggable: positionMode === PositionMode.Update,
    editable: positionMode === PositionMode.Update,
  });

  area.setMap(map);

  return area;
};

export const clearAreas = (areas: google.maps.Polygon[]) => {
  areas.forEach((area) => area.setMap(null));
};

export const getPolygonCentroid = (polygonArea: {
  include: { latitude: number; longitude: number }[];
}): { lat: number; lng: number } => {
  const coordinates = polygonArea.include;

  if (coordinates.length < 3) {
    throw new Error("A polygon must have at least three vertices.");
  }

  let area = 0;
  let centroidX = 0;
  let centroidY = 0;

  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const x1 = coordinates[i].longitude;
    const y1 = coordinates[i].latitude;
    const x2 = coordinates[(i + 1) % n].longitude;
    const y2 = coordinates[(i + 1) % n].latitude;

    const crossProduct = x1 * y2 - x2 * y1;

    area += crossProduct;
    centroidX += (x1 + x2) * crossProduct;
    centroidY += (y1 + y2) * crossProduct;
  }

  area *= 0.5;

  if (area === 0) {
    throw new Error("The polygon has zero area and is likely degenerate.");
  }

  centroidX /= 6 * area;
  centroidY /= 6 * area;

  return { lat: centroidY, lng: centroidX };
};

// Calcola l'area del poligono per determinare l'orientamento
const calculatePolygonArea = (coordinates: { lat: number; lng: number }[]) => {
  let area = 0;
  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    area +=
      coordinates[i].lng * coordinates[j].lat -
      coordinates[j].lng * coordinates[i].lat;
  }
  return area / 2;
};

// Verifica se il poligono è orientato in senso orario
const isClockwise = (coordinates: { lat: number; lng: number }[]) =>
  calculatePolygonArea(coordinates) < 0;

// Inverte le coordinate per cambiare l'orientamento
const reverseCoordinates = (coordinates: { lat: number; lng: number }[]) =>
  [...coordinates].reverse();

export const parseAreaPaths = (area: PolygonArea) => {
  const includePaths = (area.include || []).map((coord) => ({
    lat: parseFloat(coord.latitude?.toString() || "NaN"),
    lng: parseFloat(coord.longitude?.toString() || "NaN"),
  }));

  const excludePaths = (area.exclude || []).map((exclude) =>
    exclude.map((coord) => ({
      lat: parseFloat(coord.latitude?.toString() || "NaN"),
      lng: parseFloat(coord.longitude?.toString() || "NaN"),
    })),
  );

  const isValidLatLng = (coord: { lat: number; lng: number }) =>
    !isNaN(coord.lat) && !isNaN(coord.lng);

  const validIncludePaths = includePaths.filter(isValidLatLng);
  const validExcludePaths = excludePaths.map((exclude) =>
    exclude.filter(isValidLatLng),
  );

  // Orientamento corretto
  const orientedIncludePaths = isClockwise(validIncludePaths)
    ? reverseCoordinates(validIncludePaths)
    : validIncludePaths;

  const orientedExcludePaths = validExcludePaths.map((exclude) =>
    !isClockwise(exclude) ? reverseCoordinates(exclude) : exclude,
  );

  return { include: orientedIncludePaths, exclude: orientedExcludePaths };
};
