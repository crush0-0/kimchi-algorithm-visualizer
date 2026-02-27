import type { Algorithm } from "../../types/algorithm";
import type { ArrayStep } from "../../types/steps";

export const binarySearch: Algorithm<number[], ArrayStep> = {
  id: "binary-search",
  name: "Binary Search",
  category: "searching",
  description: "A fast search algorithm that relies on the array being sorted. It repeatedly divides the search interval in half. Note: The engine ensures the array is sorted before running this.",
  complexity: {
    time: "O(log n)",
    space: "O(1)",
  },
  generateSteps: (array: number[]): ArrayStep[] => {
    const steps: ArrayStep[] = [];
    const arr = [...array].sort((a,b) => a - b); // Force sort just to be safe, though engine should handle this
    
    // Pick a target that exists
    const target = arr[Math.floor(arr.length * 0.8)] || arr[0];

    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        // Show bounds being actively looked at
        steps.push({ type: "highlight", indices: [left, right] });
        
        const mid = Math.floor((left + right) / 2);
        steps.push({ type: "compare", indices: [mid, mid] }); // Highlight mid uniquely
        
        if (arr[mid] === target) {
            steps.push({ type: "mark_sorted", index: mid }); // Found indicator
            break;
        } else if (arr[mid] < target) {
            // Mark the rejected left half
            for (let i = left; i <= mid; i++) {
                steps.push({ type: "mark_visited", index: i });
            }
            left = mid + 1;
        } else {
            // Mark the rejected right half
            for (let i = mid; i <= right; i++) {
                steps.push({ type: "mark_visited", index: i });
            }
            right = mid - 1;
        }
    }

    return steps;
  },
  pseudocode: [
    "function binarySearch(array, target)",
    "  left = 0",
    "  right = length(array) - 1",
    "  while left <= right",
    "    mid = floor((left + right) / 2)",
    "    if array[mid] == target",
    "      return mid",
    "    if array[mid] < target",
    "      left = mid + 1",
    "    else",
    "      right = mid - 1",
    "  return not found"
  ],
  cppImplementation: `int binarySearch(std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  tsImplementation: `function binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  explanation: [
    "Binary search is a highly efficient algorithm for finding an item from a sorted list of items.",
    "It works by repeatedly dividing in half the portion of the list that could contain the item, until you've narrowed down the possible locations to just one.",
    "Crucially, it requires the input array to already be sorted.",
    "Note: The visualizer platform automatically sorts the array before generating steps for Binary Search to ensure standard behavior."
  ],
  resources: [
      { label: "Wikipedia: Binary search algorithm", url: "https://en.wikipedia.org/wiki/Binary_search_algorithm" }
  ]
};
