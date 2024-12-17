import { Dayjs } from "dayjs";
import { Document, LinkType, Scale, ScaleType } from "./interfaces";

export type DiagramNode = { ref: Document; x: number; y: number };
export type DiagramLink = { source: number; target: number; type: LinkType };
export type IndexedLink = DiagramLink;

const dateToXFactory = (docs: Document[]) => {
  if (docs.length === 0) return (date: Dayjs): number => date.toDate().getDay();
  const dateInit = docs[0].issuanceDate!;
  const { min, max } = docs
    .map((d) => d.issuanceDate!)
    .reduce(
      (found: { min: Dayjs; max: Dayjs }, cur: Dayjs) => {
        if (cur.diff(found.min) < 0) found.min = cur;
        if (cur.diff(found.max) > 0) found.max = cur;
        return found;
      },
      { min: dateInit, max: dateInit },
    );
  const range = max.diff(min, "day");
  return (date: Dayjs): number => {
    const a = date.diff(min, "day") / range;
    console.log(a);
    return a;
  };
};

export const DISCRETE_RANGE = 1000;
const scaleToYFactory =
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
): DiagramNode[] => {
  const scaleToY = scaleToYFactory(true, true, ratioRange, true);
  const dateToX = dateToXFactory(docs);
  return docs.map(
    (d: Document) =>
      ({
        ref: d,
        x: dateToX(d.issuanceDate!),
        y: scaleToY(d.scale),
      }) as DiagramNode,
  );
};
