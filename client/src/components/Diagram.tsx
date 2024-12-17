import { FC, useEffect, useRef } from "react";
import "../styles/Diagram.scss";
import { SVGElement, updateSvg } from "../utils/diagram";
import { DiagramLink } from "../utils/diagramNode";
import { Document, DocumentType, Link, ScaleType } from "../utils/interfaces";
import { capitalizeFirstLetter, enumDefOrderComparator } from "../utils/utils";

const linksExtractor = (docs: Document[]): DiagramLink[] =>
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

  useEffect(() => {
    const extractedLinks: DiagramLink[] = linksExtractor(documents);
    updateSvg(svgRef, documents, extractedLinks, onDocumentClick);
  }, [documents]);

  return (
    <section id="diagram">
      <div className="time-axis">
        <div className="combine-axes"></div>
        <div className="time-cells-container"></div>
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
              .map((v) => v.replace("_", "-"))
              .map((v) => (
                <pattern
                  id={v}
                  key={v}
                  x="0%"
                  y="0%"
                  height="100%"
                  width="100%"
                  viewBox="0 0 128 128"
                >
                  <image
                    x="0%"
                    y="0%"
                    width="128"
                    height="128"
                    xlinkHref="/document-material_effect-icon.png" //TODO: parametrize
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
