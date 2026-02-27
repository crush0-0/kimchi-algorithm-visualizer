import type { Algorithm } from "../../types/algorithm";
import type { GraphStep } from "../../types/steps";
import { getRomaniaAdjacencyList, romaniaHeuristics, romaniaGraph } from "./data/romania";

export const aStarSearch: Algorithm<typeof romaniaGraph, GraphStep> = {
  id: "a-star",
  name: "A* Search",
  category: "graph",
  description: "A graph traversal and path search algorithm known for its performance and accuracy. It uses heuristic analysis to guide the search towards the target efficiently.",
  complexity: {
    time: "O(E)",
    space: "O(V)",
  },
  generateSteps: (): GraphStep[] => {
    const steps: GraphStep[] = [];
    const adjList = getRomaniaAdjacencyList();
    const startNodeId = "Arad";
    const targetNodeId = "Bucharest";
    
    // priority queue mock: an array sorted by fScore
    let openSet: string[] = [startNodeId];
    
    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path
    const cameFrom: Record<string, string> = {};
    
    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    const gScore: Record<string, number> = {};
    for (const node of romaniaGraph.nodes) {
        gScore[node.id] = Infinity;
    }
    gScore[startNodeId] = 0;
    
    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how short a path from start to finish can be if it goes through n.
    const fScore: Record<string, number> = {};
    for (const node of romaniaGraph.nodes) {
        fScore[node.id] = Infinity;
    }
    fScore[startNodeId] = romaniaHeuristics[startNodeId] || 0;

    let found = false;

    steps.push({ type: "visit_node", nodeId: startNodeId });
    steps.push({ type: "mark_visited", nodeId: startNodeId });

    while (openSet.length > 0) {
        // Find node in openSet with lowest fScore
        openSet.sort((a, b) => fScore[a] - fScore[b]);
        const current = openSet.shift()!;
        
        if (current !== startNodeId) {
             steps.push({ type: "visit_node", nodeId: current });
             steps.push({ type: "mark_visited", nodeId: current });
        }
        
        if (current === targetNodeId) {
            found = true;
            break;
        }

        for (const neighbor of adjList[current]) {
            steps.push({ type: "explore_edge", fromId: current, toId: neighbor.to });
            
            // tentative_gScore is the distance from start to the neighbor through current
            const tentative_gScore = gScore[current] + neighbor.weight;
            
            if (tentative_gScore < gScore[neighbor.to]) {
                // This path to neighbor is better than any previous one. Record it!
                cameFrom[neighbor.to] = current;
                gScore[neighbor.to] = tentative_gScore;
                fScore[neighbor.to] = tentative_gScore + (romaniaHeuristics[neighbor.to] || 0);
                
                steps.push({ type: "set_parent", nodeId: neighbor.to, parentId: current });
                steps.push({ type: "update_distance", nodeId: neighbor.to, distance: tentative_gScore });
                
                if (!openSet.includes(neighbor.to)) {
                    openSet.push(neighbor.to);
                }
            }
        }
    }

    if (found) {
        const path: string[] = [targetNodeId];
        let current = targetNodeId;
        while (Object.keys(cameFrom).includes(current)) {
            current = cameFrom[current];
            path.unshift(current);
        }
        steps.push({ type: "highlight_path", nodeIds: path });
    }

    return steps;
  },
  pseudocode: [
    "function A_Star(start, goal)",
    "  openSet = {start}",
    "  gScore = map with default value of Infinity",
    "  gScore[start] = 0",
    "  fScore = map with default value of Infinity",
    "  fScore[start] = h(start)",
    "",
    "  while openSet is not empty",
    "    current = node in openSet with lowest fScore",
    "    if current == goal",
    "      return reconstruct_path(cameFrom, current)",
    "",
    "    openSet.Remove(current)",
    "    for each neighbor of current",
    "      tentative_gScore = gScore[current] + d(current, neighbor)",
    "      if tentative_gScore < gScore[neighbor]",
    "        cameFrom[neighbor] = current",
    "        gScore[neighbor] = tentative_gScore",
    "        fScore[neighbor] = gScore[neighbor] + h(neighbor)",
    "        if neighbor not in openSet",
    "          openSet.add(neighbor)",
    "  return failure"
  ],
  cppImplementation: `// A* requires a priority_queue and heuristic map.
// This is a simplified outline.
double heuristic(std::string node, std::string goal) {
    // Return pre-calculated straight-line distance
    return romaniaHeuristics[node]; 
}

std::vector<std::string> aStar(std::string start, std::string goal, Graph& g) {
    // Requires custom comparator for priority queue
    // Track gScore, cameFrom, and visited state
    // ...
}`,
  tsImplementation: `// Simulated A* TypeScript Implementation
// Uses arrays and sorting for simplicity over a true MinHeap
function aStarSearch(start: string, goal: string, graph: GraphData): string[] {
    const openSet = [start];
    const cameFrom: Record<string, string> = {};
    const gScore: Record<string, number> = { [start]: 0 };
    const fScore: Record<string, number> = { [start]: heuristics[start] };
    
    while(openSet.length > 0) {
        openSet.sort((a,b) => (fScore[a] || Infinity) - (fScore[b] || Infinity));
        const current = openSet.shift()!;
        
        if (current === goal) return reconstructPath(cameFrom, current);
        
        for (const neighbor of graph.getNeighbors(current)) {
            const tentativeG = gScore[current] + neighbor.weight;
            if (tentativeG < (gScore[neighbor.id] || Infinity)) {
                cameFrom[neighbor.id] = current;
                gScore[neighbor.id] = tentativeG;
                fScore[neighbor.id] = tentativeG + heuristics[neighbor.id];
                if (!openSet.includes(neighbor.id)) openSet.push(neighbor.id);
            }
        }
    }
    return [];
}`,
  explanation: [
    "A* (A-Star) search is a widely used routing and pathfinding algorithm.",
    "It combines features of uniform-cost search and pure heuristic search to effectively compute optimal paths.",
    "The algorithm maintains a priority queue of nodes to explore, evaluating them based on the function f(n) = g(n) + h(n).",
    "g(n) is the exact cost from the start node to node n. h(n) is the estimated cost (heuristic) from n to the goal.",
    "Here, our heuristic is the straight-line distance to Bucharest."
  ],
  resources: [
      { label: "Wikipedia: A* search algorithm", url: "https://en.wikipedia.org/wiki/A*_search_algorithm" },
      { label: "Red Blob Games: A* Pathfinding", url: "https://www.redblobgames.com/pathfinding/a-star/introduction.html" }
  ]
};
