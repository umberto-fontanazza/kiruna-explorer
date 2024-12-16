import { Document, LinkType, ScaleType } from "./interfaces";
export type DiagramNode = { ref: Document; x: number; y: number };
export type DiagramLink = { source: number; target: number; type: LinkType };
export type IndexedLink = DiagramLink;

const randValues = [30, 50, 120, 300];

export const xyExtractor = (docs: Document[]): DiagramNode[] =>
  docs.map(
    (d: Document) =>
      ({
        ref: d,
        x: d.id % 2 == 0 ? 40 : 20, //TODO: time
        y:
          d.scale.type === ScaleType.ArchitecturalScale
            ? d.scale.ratio
            : randValues[Math.floor(Math.random() * randValues.length)], //TODO: parametrization
      }) as DiagramNode,
  );
