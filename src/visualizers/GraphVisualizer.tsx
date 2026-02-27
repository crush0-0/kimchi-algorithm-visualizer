import type { VisualGraphState } from "../engines/useGraphEngine";
import type { GraphData, GraphNode, GraphEdge } from "../types/graph";
import { useEffect, useRef } from "react";

interface GraphVisualizerProps {
  graphData: GraphData | null;
  state: VisualGraphState;
}

export function GraphVisualizer({ graphData, state }: GraphVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Update SVG viewport dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (!graphData) {
    return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-crust rounded-2xl border border-surface0 text-subtext0">
            No graph data loaded.
        </div>
    );
  }

  // Calculate bounding box of graph data to auto-scale viewport
  const padding = 50;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  graphData.nodes.forEach((node: GraphNode) => {
      if (node.position) {
          minX = Math.min(minX, node.position.x);
          minY = Math.min(minY, node.position.y);
          maxX = Math.max(maxX, node.position.x);
          maxY = Math.max(maxY, node.position.y);
      }
  });

  const rawWidth = maxX - minX;
  const rawHeight = maxY - minY;
  
  const viewBox = `${minX - padding} ${minY - padding} ${rawWidth + padding * 2} ${rawHeight + padding * 2}`;

  return (
    <div ref={containerRef} className="w-full h-full bg-crust rounded-2xl border border-surface0 overflow-hidden relative select-none">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={viewBox} 
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full drop-shadow-md"
      >
        {/* Draw Edges first so they are behind nodes */}
        {graphData.edges.map((edge: GraphEdge, idx: number) => {
           const fromNode = graphData.nodes.find((n: GraphNode) => n.id === edge.from);
           const toNode = graphData.nodes.find((n: GraphNode) => n.id === edge.to);
           
           if (!fromNode?.position || !toNode?.position) return null;

           const edgeIdForwards = `${edge.from}_${edge.to}`;
           const edgeIdBackwards = `${edge.to}_${edge.from}`;
           
           const isActive = state.activeEdges.has(edgeIdForwards) || state.activeEdges.has(edgeIdBackwards);
           const isPath = state.finalPath.has(edge.from) && state.finalPath.has(edge.to) && 
                          (state.parents[edge.to] === edge.from || state.parents[edge.from] === edge.to);

           let stroke = "#313244"; // surface0
           let strokeWidth = 2;
           
           if (isActive) {
               stroke = "#f9e2af"; // yellow
               strokeWidth = 4;
           } else if (isPath) {
               stroke = "#a6e3a1"; // green
               strokeWidth = 4;
           }

           // Calculate midpoint for weight label
           const midX = (fromNode.position.x + toNode.position.x) / 2;
           const midY = (fromNode.position.y + toNode.position.y) / 2;

           return (
             <g key={`edge-${idx}`}>
                <line 
                  x1={fromNode.position.x} 
                  y1={fromNode.position.y} 
                  x2={toNode.position.x} 
                  y2={toNode.position.y} 
                  stroke={stroke} 
                  strokeWidth={strokeWidth}
                  className={`transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                />
                
                {edge.weight && (
                    <text 
                        x={midX} 
                        y={midY - 8} 
                        fill="#a6adc8" 
                        fontSize="12" 
                        textAnchor="middle"
                        className="bg-crust font-mono"
                    >
                        {edge.weight}
                    </text>
                )}
             </g>
           );
        })}

        {/* Draw Nodes */}
        {graphData.nodes.map((node: GraphNode) => {
          if (!node.position) return null;
          
          const isCurrent = state.currentNode === node.id;
          const isVisited = state.visitedNodes.has(node.id);
          const isPath = state.finalPath.has(node.id);
          
          let fill = "#181825"; // mantle
          let stroke = "#45475a"; // surface1
          
          if (isCurrent) {
              fill = "#f38ba8"; // red
              stroke = "#f38ba8";
          } else if (isPath) {
              fill = "#a6e3a1"; // green
              stroke = "#a6e3a1";
          } else if (isVisited) {
              fill = "#89b4fa"; // sapphire
              stroke = "#89b4fa";
          }

          const distanceText = state.distances[node.id] !== undefined ? (`${state.distances[node.id]}`) : '';

          return (
             <g key={`node-${node.id}`} className="transition-all duration-300 ease-in-out">
                <circle 
                   cx={node.position.x} 
                   cy={node.position.y} 
                   r="16" 
                   fill={fill} 
                   stroke={stroke}
                   strokeWidth="3"
                   className="shadow-sm"
                />
                <text 
                   x={node.position.x} 
                   y={node.position.y + 32} 
                   fill="#cdd6f4" 
                   fontSize="14" 
                   fontWeight="bold"
                   textAnchor="middle"
                   className="drop-shadow-md tracking-wide pointer-events-none"
                >
                   {node.label}
                </text>
                {distanceText && (
                   <text 
                      x={node.position.x + 20} 
                      y={node.position.y - 20} 
                      fill="#f9e2af" 
                      fontSize="12" 
                      fontWeight="bold"
                      className="drop-shadow-md font-mono pointer-events-none"
                   >
                      {distanceText === "Infinity" ? '∞' : distanceText}
                   </text>
                )}
             </g>
          );
        })}
      </svg>
    </div>
  );
}
