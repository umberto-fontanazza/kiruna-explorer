import { Cluster } from "@googlemaps/markerclusterer";
import { CustomMarker, Document, fromDocumentTypeToIcon } from "./interfaces";

const createClusterIconContent = (count: number, zoomLevel: number) => {
  const div = document.createElement("div");

  const svgNamespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("width", "80");
  svg.setAttribute("height", "80");
  svg.setAttribute("viewBox", "0 0 50 50");

  const isZoomedIn = zoomLevel >= 15;
  const outerCircleColor = isZoomedIn
    ? "rgba(254, 188, 0, 0.3)"
    : "rgba(33, 150, 243, 0.3)";
  const middleCircleColor = isZoomedIn
    ? "rgba(254, 188, 0, 0.6)"
    : "rgba(33, 150, 243, 0.6)";
  const innerCircleColor = isZoomedIn ? "#fecb00" : "#2196f3";

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
  zoomLevel: number,
) => {
  return new google.maps.marker.AdvancedMarkerElement({
    position,
    content: createClusterIconContent(count, zoomLevel),
  });
};

export const renderClusterMarker = (
  cluster: Cluster,
  stats: any,
  map: google.maps.Map,
) => {
  const zoom = map.getZoom() ?? 0;
  return createAdvancedMarker(cluster.position, cluster.count, zoom);
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

  if (cluster.bounds && currentZoom < 15) {
    const newZoom = Math.min(currentZoom + 3, 16);
    map?.fitBounds(cluster.bounds);
    map?.setZoom(newZoom);
  } else if (currentZoom >= 15) {
    const position = cluster.position;
    const clusterDocuments = cluster.markers?.map(
      (marker) => (marker as CustomMarker).document,
    );

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
  }
};
