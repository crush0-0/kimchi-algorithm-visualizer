import type { Algorithm } from "../../types/algorithm";
import type { GraphStep } from "../../types/steps";
import { getRomaniaAdjacencyList, romaniaGraph } from "./data/romania";

export const breadthFirstSearch: Algorithm<typeof romaniaGraph, GraphStep> = {
  id: "bfs",
  name: "Breadth First Search",
  category: "graph",
  description: "An algorithm for exploring a graph. It starts at a source node and explores all of its neighbors at the present depth prior to moving on to the nodes at the next depth level.",
  complexity: {
    time: "O(V + E)",
    space: "O(V)",
  },
  generateSteps: (): GraphStep[] => {
    const steps: GraphStep[] = [];
    const adjList = getRomaniaAdjacencyList();
    const startNodeId = "Arad";
    const targetNodeId = "Bucharest";
    
    const visited = new Set<string>();
    const parents: Record<string, string> = {};
    const queue: string[] = [startNodeId];
    
    visited.add(startNodeId);
    steps.push({ type: "visit_node", nodeId: startNodeId });
    steps.push({ type: "mark_visited", nodeId: startNodeId });

    let found = false;

    while (queue.length > 0) {
        const current = queue.shift()!;
        
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
                steps.push({ type: "visit_node", nodeId: neighbor.to });
                steps.push({ type: "mark_visited", nodeId: neighbor.to });
                
                queue.push(neighbor.to);
            }
        }
    }

    // Reconstruct path
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
    "function BFS(start, target):",
    "  queue.enqueue(start)",
    "  mark start as visited",
    "  while queue is not empty:",
    "    node = queue.dequeue()",
    "    if node == target:",
    "      return True",
    "    for neighbor in adjList[node]:",
    "      if neighbor is not visited:",
    "        mark neighbor as visited",
    "        parent[neighbor] = node",
    "        queue.enqueue(neighbor)",
    "  return False"
  ],
  cppImplementation: `bool BFS(std::string start, std::string target, 
         std::map<std::string, std::vector<std::string>>& adjList, 
         std::map<std::string, std::string>& parent) {
             
    std::set<std::string> visited;
    std::queue<std::string> q;
    
    q.push(start);
    visited.insert(start);
    
    while (!q.empty()) {
        std::string curr = q.front();
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
  tsImplementation: `function BFS(start: string, target: string, adjList: Record<string, string[]>, 
             parent: Record<string, string>): boolean {
    const visited = new Set<string>();
    const queue: string[] = [start];
    visited.add(start);
    
    while (queue.length > 0) {
        const curr = queue.shift()!;
        if (curr === target) return true;
        
        for (const neighbor of adjList[curr]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                parent[neighbor] = curr;
                queue.push(neighbor);
            }
        }
    }
    return false;
}`,
  explanation: [
    "Breadth-First Search (BFS) explores the graph level by level.",
    "It uses a Queue (FIFO) data structure to keep track of nodes to visit next.",
    "Unlike DFS forming deep branches, BFS creates an expanding frontier.",
    "Crucially, on an unweighted graph, BFS guarantees finding the shortest path (minimum number of edges) to a target."
  ],
  resources: [
      { label: "Wikipedia: Breadth-first search", url: "https://en.wikipedia.org/wiki/Breadth-first_search" }
  ]
};
