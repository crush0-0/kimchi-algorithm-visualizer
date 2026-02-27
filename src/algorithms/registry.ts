import type { Algorithm } from "../types/algorithm";

// Type-cast registry array items as 'any' to bundle disjoint step types, 
// since the frontend UI component will only need `Algorithm<any, any>` for broad metadata rendering, 
// and the specific Engine hook handles casting the execution.
import { bubbleSort } from "./sorting/bubbleSort";
import { selectionSort } from "./sorting/selectionSort";
import { insertionSort } from "./sorting/insertionSort";
import { mergeSort } from "./sorting/mergeSort";
import { quickSort } from "./sorting/quickSort";

import { linearSearch } from "./searching/linearSearch";
import { binarySearch } from "./searching/binarySearch";

import { towerOfHanoi } from "./recursion/towerOfHanoi";

import { depthFirstSearch } from "./graph/dfs";
import { breadthFirstSearch } from "./graph/bfs";
import { bestFirstSearch } from "./graph/greedyBfs";
import { aStarSearch } from "./graph/aStar";
import { travelingSalesman } from "./graph/tsp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const algorithms: Algorithm<any, any>[] = [
  // Sorting
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  
  // Searching
  linearSearch,
  binarySearch,
  
  // Recursion
  towerOfHanoi,
  
  // Graph
  depthFirstSearch,
  breadthFirstSearch,
  bestFirstSearch,
  aStarSearch,
  travelingSalesman
];
