export interface Point {
  x: number;
  y: number;
}

export interface GraphNode {
  id: string;
  label: string;
  position?: Point; // Optional for plotting on a visual map
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface AdjacencyList {
  [nodeId: string]: { to: string; weight: number }[];
}
