import * as d3 from "d3";
import { FC, MutableRefObject, useEffect, useRef } from "react";
import "../styles/Diagram.scss";
import { mockDocks } from "../utils/mockDocs";

type SVGElement = SVGSVGElement;

const rangeExtractor = (
  arr: { x: number; y: number }[],
): [number, number, number, number] => {
  const [minX, maxX, minY, maxY] = [
    Math.min(...arr.map((e) => e.x)),
    Math.max(...arr.map((e) => e.x)),
    Math.min(...arr.map((e) => e.y)),
    Math.max(...arr.map((e) => e.y)),
  ];
  return [minX, maxX, minY, maxY];
};

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

const [minX, maxX, minY, maxY] = rangeExtractor(data);
const [width, heigth] = [maxX - minX, maxY - minY];
const padPercentage = 5; /** if padPercentage is 5 it means we have 2.5% padding left and right */
const padAbsolute = (width * padPercentage) / 2 / 100;
const [padMinX, padMaxX] = [minX - padAbsolute, maxX + padAbsolute];

function toPercentage(value: number, min: number, max: number): number {
  return ((value - min) * 100) / (max - min);
}
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
    .attr("cx", (d) => `${toPercentage(d.x, padMinX, padMaxX)}%`)
    .attr("cy", (d) => `${toPercentage(d.y, minY, maxY)}%`);
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
