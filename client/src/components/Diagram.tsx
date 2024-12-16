import { FC, useEffect, useRef } from "react";
import "../styles/Diagram.scss";
import { SVGElement, updateSvg } from "../utils/diagram";
import { Document, Link, LinkType } from "../utils/interfaces";
import { mockDocks } from "../utils/mockDocs";

const linksExtractor = (
  docs: Document[],
): { source: number; target: number; type: LinkType }[] =>
  docs
    .flatMap((d) =>
      (d.links ?? []).flatMap((l: Link) =>
        l.linkTypes.map((type) => ({
          source: d.id,
          target: l.targetDocumentId,
          type: type,
        })),
      ),
    )
    .filter((l) => l.target > l.source);
interface DiagramProps {
  documents: Document[];
  onDocumentClick: (d: Document) => void;
}

const Diagram: FC<DiagramProps> = ({ documents, onDocumentClick }) => {
  const svgRef = useRef<SVGElement | null>(null);

  useEffect(() => {
    const docs = mockDocks;
    const extractedLinks: { source: number; target: number; type: LinkType }[] =
      linksExtractor(docs);
    updateSvg(svgRef, docs, extractedLinks);
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
