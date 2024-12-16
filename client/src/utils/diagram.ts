import * as d3 from "d3";
import { MutableRefObject } from "react";
import { mockDocks } from "../utils/mockDocs";

export type SVGElement = SVGSVGElement;

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

const links = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
];

const [minX, maxX, minY, maxY] = rangeExtractor(data);
const [width, heigth] = [maxX - minX, maxY - minY];
const [padX, padY] = [
  10, 20,
]; /** eg: if padX is 5 it means we have 2.5% padding left and right */
const padXAbsolute = (width * padX) / 2 / 100;
const padYAbsolute = (heigth * padY) / 2 / 100;
const [padMinX, padMaxX] = [minX - padXAbsolute, maxX + padXAbsolute];
const [padMinY, padMaxY] = [minY - padYAbsolute, maxY + padYAbsolute];

function toPercentage(value: number, min: number, max: number): string {
  return `${((value - min) * 100) / (max - min)}%`;
}

export const updateSvg = (ref: MutableRefObject<SVGElement | null>) => {
  const svg = ref.current;
  if (!svg) return;
  const d3sel = d3.select(svg);

  d3sel
    .selectAll("g.documents")
    .selectAll("*")
    .data(data)
    .join("circle")
    .attr("cx", (d) => toPercentage(d.x, padMinX, padMaxX))
    .attr("cy", (d) => toPercentage(d.y, padMinY, padMaxY));
  d3sel
    .selectAll("g.links")
    .selectAll("*")
    .data(links)
    .join("line")
    .attr("x1", (link) => toPercentage(data[link.source].x, padMinX, padMaxX))
    .attr("x2", (link) => toPercentage(data[link.target].x, padMinX, padMaxX))
    .attr("y1", (link) => toPercentage(data[link.source].y, padMinY, padMaxY))
    .attr("y2", (link) => toPercentage(data[link.target].y, padMinY, padMaxY));
};
