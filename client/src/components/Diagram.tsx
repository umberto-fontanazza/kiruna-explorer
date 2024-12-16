import { FC, useEffect, useRef } from "react";
import "../styles/Diagram.scss";
import { SVGElement, updateSvg } from "../utils/diagram";
import { mockDocks } from "../utils/mockDocs";

interface DiagramProps {
  documents: Document[];
  onDocumentClick: (d: Document) => void;
}

const Diagram: FC<DiagramProps> = ({ documents, onDocumentClick }) => {
  const svgRef = useRef<SVGElement | null>(null);

  useEffect(() => {
    updateSvg(svgRef, mockDocks);
  }, [documents]);

  return (
    <section id="diagram">
      <div className="labels-container">
        <span className="label">Ratio</span>
      </div>
      <svg ref={svgRef}>
        <g className="documents"></g>
        <g className="links"></g>
      </svg>
    </section>
  );
};

export default Diagram;
