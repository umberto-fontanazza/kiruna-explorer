import { Dayjs } from "dayjs";
import { FC, useEffect, useRef, useState } from "react";
import API from "../API/API";
import { useAppContext } from "../context/appContext";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import { usePopupContext } from "../context/PopupContext";
import "../styles/Diagram.scss";
import { SVGElement, updateSvg } from "../utils/diagram";
import { DiagramLink } from "../utils/diagramNode";
import {
  Coordinates,
  Document,
  DocumentType,
  Link,
  PolygonArea,
  ScaleType,
} from "../utils/interfaces";
import { PositionMode } from "../utils/modes";
import { TimeInterval } from "../utils/timeInterval";
import { capitalizeFirstLetter, enumDefOrderComparator } from "../utils/utils";
import Minimap from "./MapComponents/Minimap";
import NavHeader from "./NavHeader";
import Sidebar from "./Sidebar";

export type DiagramDoc = Omit<Document, "issuanceTime"> & {
  issuanceDate: Dayjs;
};

const linksExtractor = (docs: DiagramDoc[]): DiagramLink[] =>
  docs
    .flatMap((d) =>
      (d.links ?? []).flatMap((l: Link) =>
        l.linkTypes.map((type) => ({
          source: d.id,
          target: l.targetDocumentId,
          type: type,
        })),
      ),
    )
    .filter((l) => l.target > l.source);

const Diagram: FC = () => {
  const svgRef = useRef<SVGElement | null>(null);
  const [interval, setInterval] = useState<TimeInterval | null>(null);

  // Batman fixes
  const [documents, setDocuments] = useState<Document[]>([]);
  const [docSelected, setDocSelected] = useState<Document | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { isDeleted } = usePopupContext();
  const { isSubmit } = useDocumentFormContext();
  const [documentLocation, setDocumentLocation] = useState<
    Coordinates | PolygonArea | null
  >(null);

  const { setPositionMode, handleEditPositionModeConfirm } = useAppContext();

  const handleEditPositionMode = () => {
    setSidebarOpen(false);
    if (docSelected) {
      if (docSelected.coordinates) {
        setDocumentLocation(docSelected.coordinates);
      } else if (docSelected.area) {
        setDocumentLocation(docSelected.area);
      }
    }
    setPositionMode(PositionMode.Update);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents: Document[] = await API.getDocuments();
        setDocuments(documents);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocuments();
  }, [isDeleted, isSubmit, handleEditPositionModeConfirm]);

  useEffect(() => {
    function onDocumentClick(d: Document) {
      const { id: selectedDocumentId } = d;
      const activeDoc = documents.find((d) => d.id == selectedDocumentId)!;
      setDocSelected(activeDoc);
      setSidebarOpen(true);
    }

    const diagDocuments = documents.map((d) => ({
      ...d,
      issuanceTime: undefined,
      issuanceDate: TimeInterval.parse(d.issuanceTime!).toDayjs(),
    }));
    if (diagDocuments.length > 0) {
      const dateInit = diagDocuments[0].issuanceDate!;
      const { min, max } = diagDocuments
        .map((d) => d.issuanceDate!)
        .reduce(
          (found: { min: Dayjs; max: Dayjs }, cur: Dayjs) => {
            if (cur.diff(found.min) < 0) found.min = cur;
            if (cur.diff(found.max) > 0) found.max = cur;
            return found;
          },
          { min: dateInit, max: dateInit },
        );
      setInterval(new TimeInterval(min, max));
    }
    const extractedLinks: DiagramLink[] = linksExtractor(diagDocuments);
    updateSvg(svgRef, diagDocuments, extractedLinks, onDocumentClick);
  }, [documents]);

  return (
    <>
      <NavHeader />
      <section id="diagram">
        <div className="time-axis">
          <div className="combine-axes"></div>
          <div className="time-cells-container">
            {interval && (
              <p>{`Time range ${interval?.begin.format().split("T")[0]} to ${interval?.end.format().split("T")[0]}`}</p>
            )}
          </div>
        </div>
        <div className="scale-n-svg">
          <div className="scale-types-container">
            {[...new Set((documents ?? []).map((d) => d.scale.type))]
              .sort(enumDefOrderComparator(ScaleType))
              .map((scaleTName) => (
                <span className={`scale-type ${scaleTName}`} key={scaleTName}>
                  {capitalizeFirstLetter(scaleTName).replace("_", " ")}
                </span>
              ))}
          </div>
          <svg ref={svgRef}>
            <defs>
              {Object.values(DocumentType)
                .map((type) => [type, type.replace("_", "-")])
                .map(([type, printType]) => (
                  <pattern
                    id={printType}
                    key={printType}
                    x="0%"
                    y="0%"
                    height="100%"
                    width="100%"
                    viewBox="0 0 100 100"
                  >
                    <rect width="100%" height="100%" fill="white"></rect>
                    <image
                      x="10"
                      y="10"
                      width="80"
                      height="80"
                      xlinkHref={`/document-${type}-icon.png`}
                    ></image>
                  </pattern>
                ))}
            </defs>
            <g className="links"></g>
            <g className="documents">
              <circle r="30" cx="100" cy="100" fill="url(#image)"></circle>
            </g>
          </svg>
        </div>
        {documentLocation && docSelected && (
          <Minimap
            documentSelected={docSelected}
            documentLocation={documentLocation}
            onClose={() => setDocumentLocation(null)}
          />
        )}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          {
            <Sidebar
              setSidebarOpen={setSidebarOpen}
              document={docSelected}
              documents={documents}
              setDocuments={setDocuments}
              setDocument={setDocSelected}
              toEditPos={handleEditPositionMode}
            />
          }
        </div>
      </section>
    </>
  );
};

export default Diagram;
