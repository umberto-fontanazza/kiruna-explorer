import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

interface Node {
  id: string;
  date: string;
  type: string;
  x: number;
  y: number;
}

interface Link {
  source: string;
  target: string;
}

const dates = ["2024-12-01", "2024-12-02", "2024-12-03"];
const types = ["Type A", "Type B", "Type C"];

const initialNodes: Node[] = [
  { id: "1", date: "2024-12-01", type: "Type A", x: 0, y: 0 },
  { id: "2", date: "2024-12-02", type: "Type B", x: 0, y: 0 },
  { id: "3", date: "2024-12-03", type: "Type C", x: 0, y: 0 },
];

const initialLinks: Link[] = [
  { source: "1", target: "2" },
  { source: "2", target: "3" },
  { source: "3", target: "1" },
];

const Diagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;

    // Calcola le posizioni per le date (asse X)
    const dateScale = d3
      .scalePoint()
      .domain(dates)
      .range([100, width - 100]);

    // Calcola le posizioni per i tipi (asse Y)
    const typeScale = d3
      .scalePoint()
      .domain(types)
      .range([100, height - 100]);

    // Posiziona i nodi iniziali
    const nodes = initialNodes.map((node) => ({
      ...node,
      x: dateScale(node.date)!,
      y: typeScale(node.type)!,
    }));

    // Configura il comportamento di trascinamento
    const drag = d3
      .drag<SVGCircleElement, Node>()
      .on("start", (event, d) => {
        d3.select(event.sourceEvent.target).attr("stroke", "black");
      })
      .on("drag", (event, d) => {
        // Limita il movimento dei nodi solo sull'asse Y
        d.y = Math.max(100, Math.min(height - 100, event.y));
        d3.select(event.sourceEvent.target).attr("cy", d.y).attr("cx", d.x);
        // Aggiorna le linee collegate
        svg
          .selectAll<SVGLineElement, Link>("line")
          .filter((l) => l.source === d.id || l.target === d.id)
          .attr("x1", (l) =>
            l.source === d.id ? d.x : nodes.find((n) => n.id === l.source)!.x,
          )
          .attr("y1", (l) =>
            l.source === d.id ? d.y : nodes.find((n) => n.id === l.source)!.y,
          )
          .attr("x2", (l) =>
            l.target === d.id ? d.x : nodes.find((n) => n.id === l.target)!.x,
          )
          .attr("y2", (l) =>
            l.target === d.id ? d.y : nodes.find((n) => n.id === l.target)!.y,
          );
      })
      .on("end", (event, d) => {
        d3.select(event.sourceEvent.target).attr("stroke", null);
      });

    // Aggiungi sfondo
    svg
      .append("g")
      .selectAll("text")
      .data(dates)
      .join("text")
      .attr("x", (d) => dateScale(d)!)
      .attr("y", 50)
      .attr("text-anchor", "middle")
      .text((d) => d);

    svg
      .append("g")
      .selectAll("text")
      .data(types)
      .join("text")
      .attr("x", 50)
      .attr("y", (d) => typeScale(d)!)
      .attr("text-anchor", "start")
      .text((d) => d);

    // Disegna i collegamenti (linee)
    svg
      .append("g")
      .selectAll("line")
      .data(initialLinks)
      .join("line")
      .attr("x1", (d) => nodes.find((n) => n.id === d.source)!.x)
      .attr("y1", (d) => nodes.find((n) => n.id === d.source)!.y)
      .attr("x2", (d) => nodes.find((n) => n.id === d.target)!.x)
      .attr("y2", (d) => nodes.find((n) => n.id === d.target)!.y)
      .attr("stroke", "gray")
      .attr("stroke-width", 2);

    // Disegna i nodi
    svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 10)
      .attr("fill", "steelblue")
      .call(drag as any);

    // Rendi il canvas reattivo
    svg.attr("width", width).attr("height", height);
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{ border: "1px solid black", width: "100%", height: "100%" }}
    />
  );
};

export default Diagram;
