import type { Algorithm } from "../../types/algorithm";
import type { GraphStep } from "../../types/steps";
import { getRomaniaAdjacencyList, romaniaHeuristics, romaniaGraph } from "./data/romania";

export const bestFirstSearch: Algorithm<typeof romaniaGraph, GraphStep> = {
  id: "greedy-bfs",
  name: "Greedy Best-First Search",
  category: "graph",
  description: "A heuristic search algorithm that explores a graph by expanding the most promising node chosen according to a specified rule. It purely uses the heuristic h(n).",
  complexity: {
    time: "O(b^m)", // worst case time complexity where m is max depth
    space: "O(b^m)",
  },
  generateSteps: (): GraphStep[] => {
    const steps: GraphStep[] = [];
    const adjList = getRomaniaAdjacencyList();
    const startNodeId = "Arad";
    const targetNodeId = "Bucharest";
    
    // priority queue mock: sorted array by heuristic value h(n)
    let openSet: string[] = [startNodeId];
    const visited = new Set<string>();
    const parents: Record<string, string> = {};

    visited.add(startNodeId);
    steps.push({ type: "visit_node", nodeId: startNodeId });
    steps.push({ type: "mark_visited", nodeId: startNodeId });

    let found = false;

    while (openSet.length > 0) {
        // Sort by heuristic only!
        openSet.sort((a, b) => (romaniaHeuristics[a] || 0) - (romaniaHeuristics[b] || 0));
        const current = openSet.shift()!;
        
        if (current !== startNodeId) {
             steps.push({ type: "visit_node", nodeId: current });
        }
        
        if (current === targetNodeId) {
            found = true;
            break;
        }

        for (const neighbor of adjList[current]) {
            steps.push({ type: "explore_edge", fromId: current, toId: neighbor.to });
            
            if (!visited.has(neighbor.to)) {
                visited.add(neighbor.to);
                parents[neighbor.to] = current;
                
                steps.push({ type: "set_parent", nodeId: neighbor.to, parentId: current });
                steps.push({ type: "mark_visited", nodeId: neighbor.to });
                
                openSet.push(neighbor.to);
            }
        }
    }

    if (found) {
        const path: string[] = [];
        let curr = targetNodeId;
        while (curr) {
            path.unshift(curr);
            curr = parents[curr];
        }
        steps.push({ type: "highlight_path", nodeIds: path });
    }

    return steps;
  },
  pseudocode: [
    "function Greedy_BFS(start, target):",
    "  openSet = [start]",
    "  mark start as visited",
    "  while openSet is not empty:",
    "    current = node in openSet with lowest h(n)",
    "    remove current from openSet",
    "    if current == target:",
    "      return True",
    "    for each neighbor of current:",
    "      if neighbor is not visited:",
    "        mark neighbor as visited",
    "        parent[neighbor] = current",
    "        openSet.add(neighbor)",
    "  return False"
  ],
  cppImplementation: `// Uses a Priority Queue sorted ONLY by heuristic
bool greedyBFS(std::string start, std::string target, 
         std::map<std::string, std::vector<std::string>>& adjList, 
         std::map<std::string, std::string>& parent) {
             
    std::set<std::string> visited;
    
    // Custom comparator for priority queue based on heuristics
    auto comp = [](std::string a, std::string b) { 
        return heuristics[a] > heuristics[b]; 
    };
    std::priority_queue<std::string, std::vector<std::string>, decltype(comp)> q(comp);
    
    q.push(start);
    visited.insert(start);
    
    while (!q.empty()) {
        std::string curr = q.top();
        q.pop();
        
        if (curr == target) return true;
        
        for (const auto& neighbor : adjList[curr]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                parent[neighbor] = curr;
                q.push(neighbor);
            }
        }
    }
    return false;
}`,
  tsImplementation: `// TypeScript implementation using array sorting for priority queue
function greedyBFS(start: string, target: string, adjList: Record<string, string[]>, 
             parent: Record<string, string>): boolean {
    const visited = new Set<string>();
    const openSet: string[] = [start];
    visited.add(start);
    
    while (openSet.length > 0) {
        // Sort specifically by heuristic value descending (pop from end is O(1), but we shift)
        openSet.sort((a, b) => heuristics[a] - heuristics[b]);
        const curr = openSet.shift()!;
        
        if (curr === target) return true;
        
        for (const neighbor of adjList[curr]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                parent[neighbor] = curr;
                openSet.push(neighbor);
            }
        }
    }
    return false;
}`,
  explanation: [
    "Greedy Best-First Search uses an evaluation function f(n) = h(n) where h is the heuristic.",
    "It differs from A* because it entirely ignores the path cost accumulated so far (g(n)).",
    "It 'greedily' assumes that moving to the node that seems closest to the target according to the heuristic is the best choice.",
    "Because of this, it is not optimal and not guaranteed to find the shortest path, but it is often much faster than generic searches."
  ],
  resources: [
      { label: "Wikipedia: Best-first search", url: "https://en.wikipedia.org/wiki/Best-first_search" }
  ]
};
