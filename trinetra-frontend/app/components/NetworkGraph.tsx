"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export default function NetworkGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/network`)
      .then((res) => res.json())
      .then((data) => setGraphData(data));

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || 400,
        });
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "400px", borderRadius: "0.5rem", overflow: "hidden", border: "1px solid #374151", background: "#0f172a" }}>
      {graphData.nodes.length > 0 && (
        <ForceGraph2D
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeLabel={(node: any) => `${node.name} (${node.status}) - Risk: ${node.val * 10}`}
          nodeColor={(node: any) => node.status === 'Wanted' ? '#ef4444' : node.status === 'Arrested' ? '#10b981' : '#f59e0b'}
          linkColor={() => '#4b5563'}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.5}
        />
      )}
    </div>
  );
}
