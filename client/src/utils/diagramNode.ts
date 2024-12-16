import { Document, LinkType, Scale, ScaleType } from "./interfaces";
export type DiagramNode = { ref: Document; x: number; y: number };
export type DiagramLink = { source: number; target: number; type: LinkType };
export type IndexedLink = DiagramLink;

const randValues = [30, 50, 120, 300];

export const DISCRETE_RANGE = 1000;
const scaleToY =
  (text = true, concept = true, maxRatio: number, blueprint = true) =>
  (scale: Scale): number => {
    let offset = 0;
    // text
    if (scale.type === ScaleType.Text) return DISCRETE_RANGE / 2;
    offset += text ? DISCRETE_RANGE : 0;

    // concept
    if (scale.type === ScaleType.Concept) return offset + DISCRETE_RANGE / 2;
    offset += concept ? DISCRETE_RANGE : 0;

    // ratio
    const ratioFlex = 3;
    const ratioRange = DISCRETE_RANGE * ratioFlex;
    if (scale.type === ScaleType.ArchitecturalScale)
      return offset + (scale.ratio! * ratioRange) / maxRatio;
    offset += ratioRange;

    // blueprint
    if (scale.type === ScaleType.BlueprintsOrEffect)
      return offset + DISCRETE_RANGE / 2;

    throw new Error(`Invalid scale type: ${scale.type}`);
  };

export const xyExtractor = (
  docs: Document[],
  ratioRange: number,
): DiagramNode[] =>
  docs.map(
    (d: Document) =>
      ({
        ref: d,
        x: d.id % 2 == 0 ? 40 : 20, //TODO: time
        y: scaleToY(true, true, ratioRange, true)(d.scale),
        // d.scale.type === ScaleType.ArchitecturalScale
        //   ? d.scale.ratio
        //   : randValues[Math.floor(Math.random() * randValues.length)], //TODO: parametrization
      }) as DiagramNode,
  );
