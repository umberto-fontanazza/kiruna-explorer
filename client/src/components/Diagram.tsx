import * as d3 from "d3";
import { FC, MutableRefObject, useEffect, useRef } from "react";
import "../styles/Diagram.scss";
import { mockDocks } from "../utils/mockDocs";

type SVGElement = SVGSVGElement;

const positions = [
  { x: 50, y: 200 },
  { x: 200, y: 50 },
  { x: 300, y: 300 },
];
const data = mockDocks.map((d, i) => ({
  ...d,
  x: positions[i].x,
  y: positions[i].y,
}));

const color = d3.scaleOrdinal(d3.schemeCategory10);

interface DiagramProps {
  documents: Document[];
}

const updateSvg = (ref: MutableRefObject<SVGElement | null>) => {
  const svg = ref.current;
  if (!svg) return;
  const d3sel = d3.select(svg);

  d3sel
    .selectAll("g.documents")
    .selectAll("*")
    .data(data)
    .join("circle")
    .attr("r", 20)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y);
};

const Diagram: FC<DiagramProps> = ({ documents }) => {
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
