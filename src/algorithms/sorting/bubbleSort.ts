import type { AlgorithmDefinition } from "../../types/algorithm";
import type { Step } from "../../types/steps";

export const bubbleSort: AlgorithmDefinition = {
  id: "bubble-sort",
  name: "Bubble Sort",
  complexity: {
    time: "O(n²)",
    space: "O(1)",
  },
  generateSteps: (array: number[]): Step[] => {
    const steps: Step[] = [];
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ type: "compare", indices: [j, j + 1] });
        if (arr[j] > arr[j + 1]) {
          steps.push({ type: "swap", indices: [j, j + 1] });
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;
        }
      }
      steps.push({ type: "markSorted", index: n - i - 1 });
      if (!swapped) {
        // Mark remaining elements as sorted if the array is already sorted
        for (let k = 0; k < n - i - 1; k++) {
          steps.push({ type: "markSorted", index: k });
        }
        break;
      }
    }
    
    // Explicitly mark [0] as sorted if it finished naturally
    if (n > 0 && steps.findIndex(s => s.type === "markSorted" && s.index === 0) === -1) {
      steps.push({ type: "markSorted", index: 0 });
    }

    return steps;
  },
  pseudocode: [
    "for i from 0 to array.length",
    "  swapped = false",
    "  for j from 0 to array.length - i - 1",
    "    if array[j] > array[j + 1]",
    "      swap(array[j], array[j + 1])",
    "      swapped = true",
    "  if not swapped",
    "    break",
  ],
  cppImplementation: `void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    bool swapped;
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  tsImplementation: `function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        const temp = result[j];
        result[j] = result[j + 1];
        result[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return result;
}`,
  explanation: [
    "Bubble Sort works by repeatedly stepping through the list to be sorted.",
    "It compares each pair of adjacent items and swaps them if they are in the wrong order.",
    "The pass through the list is repeated until no swaps are needed.",
    "The largest elements 'bubble' to the top (end of the array) first.",
    "It is simple but highly inefficient for large datasets.",
  ],
  resources: [
    { label: "Wikipedia: Bubble Sort", url: "https://en.wikipedia.org/wiki/Bubble_sort" },
    { label: "GeeksforGeeks: Bubble Sort", url: "https://www.geeksforgeeks.org/bubble-sort/" }
  ],
};
