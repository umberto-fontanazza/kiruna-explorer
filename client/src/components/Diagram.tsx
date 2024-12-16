import { FC, useEffect, useRef } from "react";
import "../styles/Diagram.scss";
import { SVGElement, updateSvg } from "../utils/diagram";
import { DiagramLink } from "../utils/diagramNode";
import { Document, Link } from "../utils/interfaces";
import { capitalizeFirstLetter } from "../utils/utils";

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
      <div className="scale-types-container">
        {[...new Set((documents ?? []).map((d) => d.scale.type))].map(
          (scaleTName) => (
            <span className="scale-type" key={scaleTName}>
              {capitalizeFirstLetter(scaleTName).replace("_", " ")}
            </span>
          ),
        )}
      </div>
      <svg ref={svgRef}>
        <g className="links"></g>
        <g className="documents"></g>
      </svg>
    </section>
  );
};

export default Diagram;
