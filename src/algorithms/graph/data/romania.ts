import type { GraphData, AdjacencyList } from "../../../types/graph";

export const romaniaNodes = [
  { id: "Arad", label: "Arad", position: { x: 100, y: 150 } },
  { id: "Zerind", label: "Zerind", position: { x: 150, y: 50 } },
  { id: "Oradea", label: "Oradea", position: { x: 250, y: 30 } },
  { id: "Timisoara", label: "Timisoara", position: { x: 120, y: 300 } },
  { id: "Lugoj", label: "Lugoj", position: { x: 280, y: 350 } },
  { id: "Mehadia", label: "Mehadia", position: { x: 300, y: 430 } },
  { id: "Drobeta", label: "Drobeta", position: { x: 280, y: 530 } },
  { id: "Craiova", label: "Craiova", position: { x: 450, y: 550 } },
  { id: "Sibiu", label: "Sibiu", position: { x: 350, y: 180 } },
  { id: "RimnicuVilcea", label: "Rimnicu Vilcea", position: { x: 420, y: 300 } },
  { id: "Fagaras", label: "Fagaras", position: { x: 550, y: 190 } },
  { id: "Pitesti", label: "Pitesti", position: { x: 580, y: 380 } },
  { id: "Bucharest", label: "Bucharest", position: { x: 750, y: 450 } },
  { id: "Giurgiu", label: "Giurgiu", position: { x: 700, y: 580 } },
  { id: "Urziceni", label: "Urziceni", position: { x: 880, y: 400 } },
  { id: "Hirsova", label: "Hirsova", position: { x: 980, y: 380 } },
  { id: "Eforie", label: "Eforie", position: { x: 1020, y: 500 } },
  { id: "Vaslui", label: "Vaslui", position: { x: 920, y: 200 } },
  { id: "Iasi", label: "Iasi", position: { x: 850, y: 100 } },
  { id: "Neamt", label: "Neamt", position: { x: 700, y: 50 } }
];

export const romaniaEdges = [
  { from: "Arad", to: "Zerind", weight: 75 },
  { from: "Arad", to: "Sibiu", weight: 140 },
  { from: "Arad", to: "Timisoara", weight: 118 },
  { from: "Zerind", to: "Oradea", weight: 71 },
  { from: "Oradea", to: "Sibiu", weight: 151 },
  { from: "Timisoara", to: "Lugoj", weight: 111 },
  { from: "Lugoj", to: "Mehadia", weight: 70 },
  { from: "Mehadia", to: "Drobeta", weight: 75 },
  { from: "Drobeta", to: "Craiova", weight: 120 },
  { from: "Craiova", to: "RimnicuVilcea", weight: 146 },
  { from: "Craiova", to: "Pitesti", weight: 138 },
  { from: "RimnicuVilcea", to: "Sibiu", weight: 80 },
  { from: "RimnicuVilcea", to: "Pitesti", weight: 97 },
  { from: "Sibiu", to: "Fagaras", weight: 99 },
  { from: "Fagaras", to: "Bucharest", weight: 211 },
  { from: "Pitesti", to: "Bucharest", weight: 101 },
  { from: "Bucharest", to: "Giurgiu", weight: 90 },
  { from: "Bucharest", to: "Urziceni", weight: 85 },
  { from: "Urziceni", to: "Vaslui", weight: 142 },
  { from: "Urziceni", to: "Hirsova", weight: 98 },
  { from: "Hirsova", to: "Eforie", weight: 86 },
  { from: "Vaslui", to: "Iasi", weight: 92 },
  { from: "Iasi", to: "Neamt", weight: 87 }
];

// Helper to get bidrectional adjacency list
export function getRomaniaAdjacencyList(): AdjacencyList {
    const list: AdjacencyList = {};
    romaniaNodes.forEach(n => list[n.id] = []);
    
    romaniaEdges.forEach(e => {
        list[e.from].push({ to: e.to, weight: e.weight || 1 });
        list[e.to].push({ to: e.from, weight: e.weight || 1 }); // undirected
    });
    
    // Sort destinations alphabetically purely for deterministic algorithm step generation
    Object.keys(list).forEach(key => {
        list[key].sort((a, b) => a.to.localeCompare(b.to));
    });

    return list;
}

// Straight Line Distances to Bucharest (Heuristics for A*)
export const romaniaHeuristics: Record<string, number> = {
    Arad: 366,
    Bucharest: 0,
    Craiova: 160,
    Drobeta: 242,
    Eforie: 161,
    Fagaras: 176,
    Giurgiu: 77,
    Hirsova: 151,
    Iasi: 226,
    Lugoj: 244,
    Mehadia: 241,
    Neamt: 234,
    Oradea: 380,
    Pitesti: 100,
    RimnicuVilcea: 193,
    Sibiu: 253,
    Timisoara: 329,
    Urziceni: 80,
    Vaslui: 199,
    Zerind: 374
};

export const romaniaGraph: GraphData = {
    nodes: romaniaNodes,
    edges: romaniaEdges
};
