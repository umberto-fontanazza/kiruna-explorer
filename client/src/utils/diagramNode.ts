import { Document, ScaleType } from "./interfaces";
export type DiagramNode = { ref: Document; x: number; y: number };

export const xyExtractor = (docs: Document[]): DiagramNode[] =>
  docs.map(
    (d: Document) =>
      ({
        ref: d,
        x: 40, //TODO: time
        y: d.scale.type === ScaleType.ArchitecturalScale ? d.scale.ratio : 30,
      }) as DiagramNode,
  );
