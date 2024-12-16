import * as d3 from "d3";
import { MutableRefObject } from "react";
import { DiagramNode, xyExtractor } from "./diagramNode";
import { Document, LinkType } from "./interfaces";

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

const indexLinks = (
  docs: Document[],
  links: { source: number; target: number; type: LinkType }[],
): { source: number; target: number; type: LinkType }[] => {
  const hashMap: Record<string, number> = {};
  docs.forEach((d, idx) => {
    hashMap[`${d.id}`] = idx;
  });
  return links.map((l) => ({
    source: hashMap[l.source.toString()],
    target: hashMap[l.target.toString()],
    type: l.type,
  }));
};

const [padX, padY] = [
  10, 20,
]; /** eg: if padX is 5 it means we have 2.5% padding left and right */

function toPercentage(value: number, min: number, max: number): string {
  return `${((value - min) * 100) / (max - min)}%`;
}

export const updateSvg = (
  ref: MutableRefObject<SVGElement | null>,
  documents: Document[],
  links: { source: number; target: number; type: LinkType }[],
) => {
  links = indexLinks(documents, links);
  const data: DiagramNode[] = xyExtractor(documents);
  const [minX, maxX, minY, maxY] = rangeExtractor(data);
  const [width, heigth] = [maxX - minX, maxY - minY];
  const padXAbsolute = (width * padX) / 2 / 100;
  const padYAbsolute = (heigth * padY) / 2 / 100;
  const [padMinX, padMaxX] = [minX - padXAbsolute, maxX + padXAbsolute];
  const [padMinY, padMaxY] = [minY - padYAbsolute, maxY + padYAbsolute];

  const svg = ref.current;
  if (!svg) return;
  const d3sel = d3.select(svg);

  d3sel
    .selectAll("g.documents")
    .selectAll("*")
    .data(data)
    .join("circle")
    .attr("cx", (data) => toPercentage(data.x, padMinX, padMaxX))
    .attr("cy", (data) => toPercentage(data.y, padMinY, padMaxY));
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
