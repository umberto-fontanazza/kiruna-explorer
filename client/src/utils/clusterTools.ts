import { Cluster } from "@googlemaps/markerclusterer";
import { CustomMarker, Document, fromDocumentTypeToIcon } from "./interfaces";

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

  const area = documents[0].area;
  if (!area) return false;

  return documents.every((doc) => doc.area === area);
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
  setdocumentSelected: (doc: Document) => void,
  setSidebarOpen: (isOpen: boolean) => void,
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
    setdocumentSelected(doc);
    setSidebarOpen(true);
  };

  return docElement;
};

export const handleClusterClick = (
  _event: google.maps.MapMouseEvent,
  cluster: Cluster,
  map: google.maps.Map | undefined,
  setdocumentSelected: (doc: Document) => void,
  setSidebarOpen: (isOpen: boolean) => void,
  setInfoWindow: (infoWindow: google.maps.InfoWindow) => void,
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
          setdocumentSelected,
          setSidebarOpen,
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
