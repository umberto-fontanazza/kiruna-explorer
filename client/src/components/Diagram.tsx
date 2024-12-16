import { FC, useEffect, useRef } from "react";
import "../styles/Diagram.scss";
import { SVGElement, updateSvg } from "../utils/diagram";

interface DiagramProps {
  documents: Document[];
  onDocumentClick: (d: Document) => void;
}

const Diagram: FC<DiagramProps> = ({ documents, onDocumentClick }) => {
  const svgRef = useRef<SVGElement | null>(null);

  useEffect(() => {
    updateSvg(svgRef);
  }, [documents]);

  return (
    <svg id="diagram" ref={svgRef}>
      <g className="documents"></g>
      <g className="links"></g>
    </svg>
  );
};

export default Diagram;
