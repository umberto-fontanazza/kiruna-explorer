import geoJsonData from "../assets/municipal_area/rewound-geojson.json";

type Coordinate = [number, number]; // [lng, lat]
type MultiPolygonCoordinates = Coordinate[][][]; // MultiPolygon: [ [ [lng, lat], ... ] ]

const extractCoordinates = (features: any) => {
  return features.map((feature: any) => {
    const coordinates: MultiPolygonCoordinates = feature.geometry.coordinates;

    // Ogni MultiPolygon contiene più poligoni
    return coordinates.map((polygon: any) => {
      const outerCoords = polygon[0].map(([lng, lat]: Coordinate) => ({
        lat,
        lng,
      }));

      const innerCoords = polygon
        .slice(1)
        .map((ring: any) =>
          ring.map(([lng, lat]: Coordinate) => ({ lat, lng })),
        );

      return { outerCoords, innerCoords };
    });
  });
};

export const createMunicipalArea = (
  map: google.maps.Map,
): google.maps.Polygon[] => {
  const multiPolygons = extractCoordinates(geoJsonData.features);

  // Array per raccogliere tutti i poligoni
  const municipalPolygons: google.maps.Polygon[] = [];

  multiPolygons.forEach((polygons: any) => {
    polygons.forEach((polygon: any) => {
      const { outerCoords, innerCoords } = polygon;

      // Validazione delle coordinate
      const isValidLatLng = (coord: { lat: number; lng: number }) =>
        typeof coord.lat === "number" &&
        typeof coord.lng === "number" &&
        isFinite(coord.lat) &&
        isFinite(coord.lng);

      const validOuterCoords = outerCoords.filter(isValidLatLng);
      const validInnerCoords = innerCoords.map((ring: any) =>
        ring.filter(isValidLatLng),
      );

      // Crea il poligono
      const municipalPolygon = new google.maps.Polygon({
        paths: [validOuterCoords, ...validInnerCoords],
        fillColor: "#fecb00",
        fillOpacity: 0.5,
        strokeWeight: 4,
        strokeColor: "#fecb00",
        zIndex: 1,
      });

      municipalPolygon.setMap(map);

      municipalPolygons.push(municipalPolygon);
    });
  });

  return municipalPolygons;
};
