import type { Algorithm } from "../../types/algorithm";
import type { ArrayStep } from "../../types/steps";

export const linearSearch: Algorithm<number[], ArrayStep> = {
  id: "linear-search",
  name: "Linear Search",
  category: "searching",
  description: "A method for finding an element within a list by sequentially checking each element until a match is found or the whole list has been searched.",
  complexity: {
    time: "O(n)",
    space: "O(1)",
  },
  generateSteps: (array: number[]): ArrayStep[] => {
    // In a searching algorithm, the visualizer expects a 'target' to find.
    // For pure step generation without external input per run, we will pick a random target
    // or specifically pick an existing element. Here we'll just search for the last element
    // to show worst-case, or a mid element. Let's pick a random existing value.
    const steps: ArrayStep[] = [];
    const arr = [...array];
    
    // We enforce a target to exist for demonstration purposes
    const target = arr[Math.floor(arr.length * 0.75)] || arr[0]; 

    for (let i = 0; i < arr.length; i++) {
        // Highlight current index being checked
        steps.push({ type: "compare", indices: [i, i] });
        
        if (arr[i] === target) {
            steps.push({ type: "mark_sorted", index: i }); // Found element
            break;
        } else {
            steps.push({ type: "mark_visited", index: i }); // Mark as visited
        }
    }

    return steps;
  },
  pseudocode: [
    "for each item in the array",
    "  if item == target",
    "    return its index",
    "return not found"
  ],
  cppImplementation: `int linearSearch(std::vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
  tsImplementation: `function linearSearch(arr: number[], target: number): number {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}`,
  explanation: [
    "Linear search is the simplest search algorithm.",
    "It sequentially checks each element of the list until a match is found or the whole list has been searched.",
    "It operates in O(n) time, making it practical for small or unsorted lists where binary search cannot be applied.",
    "For this visualization, we randomly select a target that exists in the array."
  ],
  resources: [
      { label: "Wikipedia: Linear search", url: "https://en.wikipedia.org/wiki/Linear_search" }
  ]
};
