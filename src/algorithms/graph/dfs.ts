import type { Algorithm } from "../../types/algorithm";
import type { GraphStep } from "../../types/steps";
import { getRomaniaAdjacencyList, romaniaGraph } from "./data/romania";

export const depthFirstSearch: Algorithm<typeof romaniaGraph, GraphStep> = {
  id: "dfs",
  name: "Depth First Search",
  category: "graph",
  description: "An algorithm for traversing or searching tree or graph data structures. It starts at a source node and explores as far as possible along each branch before backtracking.",
  complexity: {
    time: "O(V + E)",
    space: "O(V)",
  },
  generateSteps: (): GraphStep[] => {
    // For visualization purposes, standardizing on the Romania dataset for now
    // as passing dynamic interactive graph data from the frontend is complex.
    const steps: GraphStep[] = [];
    const adjList = getRomaniaAdjacencyList();
    const startNodeId = "Arad";
    const targetNodeId = "Bucharest";
    
    const visited = new Set<string>();
    const parents: Record<string, string> = {};

    function dfs(nodeId: string): boolean {
      steps.push({ type: "visit_node", nodeId });
      visited.add(nodeId);
      steps.push({ type: "mark_visited", nodeId });

      if (nodeId === targetNodeId) {
        return true;
      }

      for (const neighbor of adjList[nodeId]) {
        if (!visited.has(neighbor.to)) {
          steps.push({ type: "explore_edge", fromId: nodeId, toId: neighbor.to });
          parents[neighbor.to] = nodeId;
          steps.push({ type: "set_parent", nodeId: neighbor.to, parentId: nodeId });
          
          if (dfs(neighbor.to)) {
            return true;
          }
        }
      }
      return false;
    }

    dfs(startNodeId);

    // Reconstruct path
    const path: string[] = [];
    let current = targetNodeId;
    if (visited.has(targetNodeId)) {
        while (current) {
            path.unshift(current);
            current = parents[current];
        }
        steps.push({ type: "highlight_path", nodeIds: path });
    }

    return steps;
  },
  pseudocode: [
    "function DFS(node, target):",
    "  if node == target return True",
    "  mark node as visited",
    "  for each neighbor in adjList[node]:",
    "    if neighbor is not visited:",
    "      parent[neighbor] = node",
    "      if DFS(neighbor, target) == True:",
    "        return True",
    "  return False"
  ],
  cppImplementation: `bool DFS(std::string node, std::string target, 
         std::map<std::string, std::vector<std::string>>& adjList, 
         std::set<std::string>& visited, 
         std::map<std::string, std::string>& parent) {
             
    visited.insert(node);
    if (node == target) return true;
    
    for (const auto& neighbor : adjList[node]) {
        if (visited.find(neighbor) == visited.end()) {
            parent[neighbor] = node;
            if (DFS(neighbor, target, adjList, visited, parent)) {
                return true;
            }
        }
    }
    return false;
}`,
  tsImplementation: `function DFS(node: string, target: string, adjList: Record<string, string[]>, 
             visited: Set<string>, parent: Record<string, string>): boolean {
    visited.add(node);
    if (node === target) return true;
    
    for (const neighbor of adjList[node]) {
        if (!visited.has(neighbor)) {
            parent[neighbor] = node;
            if (DFS(neighbor, target, adjList, visited, parent)) {
                return true;
            }
        }
    }
    return false;
}`,
  explanation: [
    "Depth-First Search (DFS) explores edges out of the most recently discovered vertex that still has unexplored edges leaving it.",
    "Once all of its edges have been explored, the search backtracks to explore edges leaving the vertex from which it was discovered.",
    "DFS on a graph can get stuck in an infinite loop if we don't keep track of visited nodes.",
    "It is NOT guaranteed to find the shortest path."
  ],
  resources: [
      { label: "Wikipedia: Depth-first search", url: "https://en.wikipedia.org/wiki/Depth-first_search" }
  ]
};
