import { Dayjs } from "dayjs";
import { FC, useEffect, useRef, useState } from "react";
import "../styles/Diagram.scss";
import { SVGElement, updateSvg } from "../utils/diagram";
import { DiagramLink } from "../utils/diagramNode";
import { Document, DocumentType, Link, ScaleType } from "../utils/interfaces";
import { TimeInterval } from "../utils/timeInterval";
import { capitalizeFirstLetter, enumDefOrderComparator } from "../utils/utils";

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
interface DiagramProps {
  documents: Document[];
  onDocumentClick: (d: Document) => void;
}

const Diagram: FC<DiagramProps> = ({ documents, onDocumentClick }) => {
  const svgRef = useRef<SVGElement | null>(null);
  const [interval, setInterval] = useState<TimeInterval | null>(null);

  useEffect(() => {
    const diagDocuments = documents
      // .filter((d) => d.issuanceTime)
      .map((d) => ({
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
  }, [documents, onDocumentClick]);

  return (
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
    </section>
  );
};

export default Diagram;
