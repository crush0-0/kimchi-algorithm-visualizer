import type { Algorithm } from "../../types/algorithm";
import type { GraphStep } from "../../types/steps";
import { getRomaniaAdjacencyList, romaniaGraph } from "./data/romania";

export const travelingSalesman: Algorithm<typeof romaniaGraph, GraphStep> = {
  id: "tsp",
  name: "Traveling Salesman (Brute Force)",
  category: "graph",
  description: "Given a list of cities and the distances between each pair, find the shortest possible route that visits each city exactly once and returns to the origin city.",
  complexity: {
    time: "O(n!)",
    space: "O(n)",
  },
  generateSteps: (): GraphStep[] => {
    // For a visual demo, trying to brute force 20 cities is O(20!) which is fatal.
    // We will artificially restrict the graph to a small sub-graph (e.g., 5 cities).
    const steps: GraphStep[] = [];
    const adjList = getRomaniaAdjacencyList();
    
    // Subset of 5 cities that form a valid cycle for demonstration
    const subsetIds = ["Sibiu", "RimnicuVilcea", "Pitesti", "Bucharest", "Fagaras"];
    const startNode = "Sibiu";
    
    // Create an induced subgraph adjacency matrix for O(1) distance lookups
    const matrix: Record<string, Record<string, number>> = {};
    for (const u of subsetIds) {
        matrix[u] = {};
        for (const v of subsetIds) {
            if (u === v) matrix[u][v] = 0;
            else {
                const edge = adjList[u].find(e => e.to === v);
                // If no direct edge, assign high cost to discourage (or mark invalid via Infinity)
                matrix[u][v] = edge ? edge.weight : 9999; 
            }
        }
    }

    let minCost = Infinity;
    let bestPath: string[] = [];
    
    const currentPath: string[] = [startNode];
    const visited = new Set<string>([startNode]);

    function permute(currentCost: number) {
        // Yield visual step that we are exploring a node
        const currentLoc = currentPath[currentPath.length - 1];
        
        // Mark all visited in green/grey via setting parents linearly just for visual effect
        if (currentPath.length > 1) {
             const prev = currentPath[currentPath.length - 2];
             steps.push({ type: "explore_edge", fromId: prev, toId: currentLoc });
        }
        steps.push({ type: "visit_node", nodeId: currentLoc });
        
        // Base case: hit all cities
        if (currentPath.length === subsetIds.length) {
            // Need to return to start
            const returnCost = matrix[currentLoc][startNode];
            if (returnCost !== 9999) {
                const total = currentCost + returnCost;
                
                steps.push({ type: "explore_edge", fromId: currentLoc, toId: startNode });
                steps.push({ type: "update_distance", nodeId: startNode, distance: total });
                
                if (total < minCost) {
                    minCost = total;
                    bestPath = [...currentPath, startNode];
                }
            }
            return;
        }

        // Recursive permutation
        for (const city of subsetIds) {
            if (!visited.has(city) && matrix[currentLoc][city] !== 9999) {
                visited.add(city);
                currentPath.push(city);
                permute(currentCost + matrix[currentLoc][city]);
                currentPath.pop();
                visited.delete(city);
            }
        }
    }

    permute(0);
    
    // Final absolute optimal highlight
    if (bestPath.length > 0) {
        for (let i = 1; i < bestPath.length; i++) {
            steps.push({ type: "set_parent", nodeId: bestPath[i], parentId: bestPath[i - 1] });
        }
        steps.push({ type: "highlight_path", nodeIds: bestPath });
    }

    return steps;
  },
  pseudocode: [
    "function TSP(graph, start):",
    "  min_path = null",
    "  min_cost = Infinity",
    "",
    "  for permutation in all_permutations(cities):",
    "    if valid_path(permutation):",
    "      cost = calculate_cost(permutation)",
    "      cost += edge_cost(last_node, start)",
    "      if cost < min_cost:",
    "        min_cost = cost",
    "        min_path = permutation",
    "  return min_path, min_cost"
  ],
  cppImplementation: `// Exact algorithm (Brute Force)
int minCost = INT_MAX;
vector<int> bestPath;

void tsp(vector<int>& path, int cost, vector<bool>& visited, const vector<vector<int>>& graph) {
    if (path.size() == graph.size()) {
        int totalCost = cost + graph[path.back()][path[0]];
        if (totalCost < minCost) {
            minCost = totalCost;
            bestPath = path;
        }
        return;
    }
    
    int curr = path.back();
    for (int next = 0; next < graph.size(); next++) {
        if (!visited[next] && graph[curr][next] != 0) {
            visited[next] = true;
            path.push_back(next);
            tsp(path, cost + graph[curr][next], visited, graph);
            path.pop_back();
            visited[next] = false;
        }
    }
}`,
  tsImplementation: `function TSP(cities: string[], distances: Record<string, Record<string, number>>, start: string) {
    let minCost = Infinity;
    let bestPath: string[] = [];
    
    function recurse(path: string[], cost: number, visited: Set<string>) {
        if (path.length === cities.length) {
            const finalCost = cost + distances[path[path.length - 1]][start];
            if (finalCost < minCost) {
                minCost = finalCost;
                bestPath = [...path, start];
            }
            return;
        }
        
        const curr = path[path.length - 1];
        for (const city of cities) {
            if (!visited.has(city)) {
                visited.add(city);
                path.push(city);
                recurse(path, cost + distances[curr][city], visited);
                path.pop();
                visited.delete(city);
            }
        }
    }
    
    recurse([start], 0, new Set([start]));
    return { path: bestPath, cost: minCost };
}`,
  explanation: [
    "The Traveling Salesman Problem (TSP) asks the following question: 'Given a list of cities and the distances between each pair of cities, what is the shortest possible route that visits each city exactly once and returns to the origin city?",
    "It is an NP-hard problem in combinatorial optimization.",
    "The brute force approach generates all possible permutations of cities. Testing all paths yields an O(n!) factorial time complexity.",
    "For this visualization to run without crashing the browser, we restrict the graph to a 5-city subgraph (Sibiu, Rimnicu Vilcea, Pitesti, Bucharest, Fagaras)."
  ],
  resources: [
      { label: "Wikipedia: Travelling salesman problem", url: "https://en.wikipedia.org/wiki/Travelling_salesman_problem" }
  ]
};
