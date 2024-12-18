import { Cluster } from "@googlemaps/markerclusterer";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { CustomMarker, Document, fromDocumentTypeToIcon } from "./interfaces";
import {
  convertCoordinatesToMarkers,
  convertPolygonAreaToPolygon,
} from "./markersTools";
import { getPolygonCentroid } from "./polygonsTools";

const haveSameCoordinates = (documents: Document[]): boolean => {
  if (documents.length === 0) return false;

  const coordinates = documents[0].coordinates;
  if (!coordinates) return false;

  const { latitude: lat, longitude: lng } = coordinates;

  return documents.every(
    (doc) =>
      doc.coordinates?.latitude === lat && doc.coordinates?.longitude === lng,
  );
};

const haveSameArea = (documents: Document[]): boolean => {
  if (documents.length === 0) return false;

  const roundTo = (num: number, decimals: number): number =>
    Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);

  const centroids = documents.map((doc) => {
    if (!doc.area) return null;
    return getPolygonCentroid(doc.area);
  });

  if (centroids.includes(null)) return false;

  const roundedCentroids = centroids.map((centroid) =>
    centroid
      ? {
          lat: roundTo(centroid.lat, 9),
          lng: roundTo(centroid.lng, 9),
        }
      : null,
  );

  return roundedCentroids.every(
    (centroid) =>
      centroid!.lat === roundedCentroids[0]!.lat &&
      centroid!.lng === roundedCentroids[0]!.lng,
  );
};

const samePosition = (documents: Document[]): boolean => {
  const filteredDocuments = documents.filter(
    (doc): doc is Document => doc !== undefined,
  );

  if (filteredDocuments.length === 0) return false;

  const hasArea = filteredDocuments.every((doc) => doc.area !== undefined);
  const hasCoordinates = filteredDocuments.every(
    (doc) => doc.coordinates !== undefined,
  );

  if (hasArea) {
    return haveSameArea(filteredDocuments);
  } else if (hasCoordinates) {
    return haveSameCoordinates(filteredDocuments);
  }

  return false;
};

const createClusterIconContent = (count: number, isSamePosition: boolean) => {
  const div = document.createElement("div");

  const svgNamespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("width", "80");
  svg.setAttribute("height", "80");
  svg.setAttribute("viewBox", "0 0 50 50");

  const outerCircleColor = isSamePosition
    ? "rgba(254, 152, 0, 0.3)"
    : "rgba(33, 150, 243, 0.3)";

  const middleCircleColor = isSamePosition
    ? "rgba(254, 152, 0, 0.6)"
    : "rgba(33, 150, 243, 0.6)";
  const innerCircleColor = isSamePosition
    ? "rgb(254, 152, 0)"
    : "rgb(33, 150, 243)";

  const createCircle = (r: number, color: string) => {
    const circle = document.createElementNS(svgNamespace, "circle");
    circle.setAttribute("cx", "25");
    circle.setAttribute("cy", "25");
    circle.setAttribute("r", r.toString());
    circle.setAttribute("fill", color);
    return circle;
  };

  svg.appendChild(createCircle(20, outerCircleColor));
  svg.appendChild(createCircle(16, middleCircleColor));
  svg.appendChild(createCircle(11, innerCircleColor));

  const text = document.createElementNS(svgNamespace, "text");
  text.setAttribute("x", "25");
  text.setAttribute("y", "30");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", "13");
  text.setAttribute("fill", "white");
  text.setAttribute("font-family", "SwedenSansBold, sans-serif");
  text.textContent = count.toString();
  svg.appendChild(text);

  div.appendChild(svg);

  return div;
};

const createAdvancedMarker = (
  position: google.maps.LatLng,
  count: number,
  isSamePosition: boolean,
) => {
  return new google.maps.marker.AdvancedMarkerElement({
    position,
    content: createClusterIconContent(count, isSamePosition),
  });
};

export const renderClusterMarker = (
  cluster: Cluster,
  stats: any,
  map: google.maps.Map,
) => {
  const clusterDocuments =
    cluster.markers?.map((marker) => (marker as CustomMarker).document) || [];
  const result = samePosition(
    clusterDocuments.filter((doc): doc is Document => doc !== undefined),
  );
  return createAdvancedMarker(cluster.position, cluster.count, result);
};

const createDocumentElement = (
  doc: Document,
  drawingMode: string,
  drawnPolygon: SetStateAction<google.maps.Polygon | undefined>,
  map: google.maps.Map | undefined,
  previousClusterElement: MutableRefObject<HTMLDivElement | undefined>,
  previousMarkerRef: MutableRefObject<
    google.maps.marker.AdvancedMarkerElement | undefined
  >,
  previousPolygonRef: MutableRefObject<google.maps.Polygon | undefined>,
  setdocumentSelected: (doc: Document) => void,
  setDrawnPolygon: Dispatch<SetStateAction<google.maps.Polygon | undefined>>,
  setSidebarOpen?: (isOpen: boolean) => void,
  setDrawnMarker?: Dispatch<SetStateAction<google.maps.Marker | undefined>>,
): HTMLElement => {
  const docElement = document.createElement("div");
  docElement.className = "doc-item";

  const docImage = document.createElement("div");
  const docType = fromDocumentTypeToIcon.get(doc.type);
  const icon = document.createElement("span");
  icon.className = `material-symbols-outlined color-${docType} size iw-type-image`;
  icon.textContent = docType ?? "";
  docImage.appendChild(icon);

  const docTitle = document.createElement("div");
  docTitle.textContent = doc.title;
  docTitle.className = "doc-title";

  docElement.appendChild(docImage);
  docElement.appendChild(docTitle);

  docElement.onclick = () => {
    // Resetta il marker precedente
    if (previousMarkerRef?.current) {
      const prevMarkerContent = previousMarkerRef.current
        .content as HTMLElement;
      if (prevMarkerContent) {
        prevMarkerContent.classList.remove("iytig");
        previousMarkerRef.current = undefined;
      }
    }

    // Resetta il poligono precedente
    if (previousPolygonRef?.current) {
      previousPolygonRef.current.setMap(null);
      previousPolygonRef.current = undefined;
    }

    // Rimuove la classe "selected" dall'elemento precedente
    if (previousClusterElement.current) {
      previousClusterElement.current.classList.remove("selected");
    }

    // Aggiorna il riferimento all'elemento corrente
    previousClusterElement.current = docElement;

    // Aggiunge la classe "selected" all'elemento corrente
    docElement.classList.add("selected");

    if (drawingMode !== "existing") {
      // Logica specifica per il caso "non existing"
      setdocumentSelected(doc);
      setSidebarOpen?.(true);
      if (drawnPolygon instanceof google.maps.Polygon) {
        drawnPolygon.setMap(null);
      }
      setDrawnPolygon(undefined);
    }

    // Logica comune per aggiungere marker o poligoni sulla mappa
    if (doc.area && map) {
      const newPolygon = convertPolygonAreaToPolygon(doc.area, map);
      setDrawnPolygon?.(newPolygon);
    } else if (doc.coordinates && map) {
      const newMarker = convertCoordinatesToMarkers(doc.coordinates);
      setDrawnMarker?.(newMarker);
    }
  };

  return docElement;
};

export const handleClusterClick = (
  _event: google.maps.MapMouseEvent,
  cluster: Cluster,
  map: google.maps.Map | undefined,
  drawingMode: string,
  drawnPolygon: SetStateAction<google.maps.Polygon | undefined>,
  previousClusterElement: MutableRefObject<HTMLDivElement | undefined>,
  previousMarkerRef: MutableRefObject<
    google.maps.marker.AdvancedMarkerElement | undefined
  >,
  previousPolygonRef: MutableRefObject<google.maps.Polygon | undefined>,
  setdocumentSelected: (doc: Document) => void,
  setSidebarOpen: (isOpen: boolean) => void,
  setInfoWindow: (infoWindow: google.maps.InfoWindow) => void,
  setDrawnPolygon: Dispatch<SetStateAction<google.maps.Polygon | undefined>>,
  setDrawnMarker?: Dispatch<SetStateAction<google.maps.Marker | undefined>>,
) => {
  const currentZoom = map?.getZoom() ?? 0;

  const clusterDocuments =
    cluster.markers?.map((marker) => (marker as CustomMarker).document) || [];

  const result = samePosition(
    clusterDocuments.filter((doc): doc is Document => doc !== undefined),
  );

  if (result) {
    const position = cluster.position;

    const content = document.createElement("div");
    content.className = "info-cluster";

    clusterDocuments?.forEach((doc) => {
      if (doc) {
        const docElement = createDocumentElement(
          doc,
          drawingMode,
          drawnPolygon,
          map,
          previousClusterElement,
          previousMarkerRef,
          previousPolygonRef,
          setdocumentSelected,
          setDrawnPolygon,
          drawingMode !== "existing" ? setSidebarOpen : undefined,
          drawingMode == "existing" ? setDrawnMarker : undefined,
        );
        content.appendChild(docElement);
      }
    });

    const newInfoWindow = new google.maps.InfoWindow({ headerDisabled: true });
    newInfoWindow.setContent(content);
    newInfoWindow.setPosition(position);
    newInfoWindow.open(map, cluster.marker);

    setTimeout(() => content.classList.add("show"), 0);
    setInfoWindow(newInfoWindow);

    map?.setCenter(position);
    map?.panTo(position);
  } else {
    const newZoom = Math.min(currentZoom + 3, 16);
    if (cluster.bounds) {
      map?.fitBounds(cluster.bounds);
    }
    map?.setZoom(newZoom);
  }
};
