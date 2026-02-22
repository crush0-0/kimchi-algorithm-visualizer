import type { AlgorithmDefinition } from "../../types/algorithm";
import type { Step } from "../../types/steps";

export const selectionSort: AlgorithmDefinition = {
  id: "selection-sort",
  name: "Selection Sort",
  complexity: {
    time: "O(n²)",
    space: "O(1)",
  },
  generateSteps: (array: number[]): Step[] => {
    const steps: Step[] = [];
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        steps.push({ type: "compare", indices: [minIdx, j] });
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i) {
        steps.push({ type: "swap", indices: [i, minIdx] });
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
      }
      steps.push({ type: "markSorted", index: i });
    }

    return steps;
  },
  pseudocode: [
    "for i from 0 to array.length",
    "  minIndex = i",
    "  for j from i + 1 to array.length",
    "    if array[j] < array[minIndex]",
    "      minIndex = j",
    "  if minIndex != i",
    "    swap(array[i], array[minIndex])",
  ],
  cppImplementation: `void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        if (min_idx != i) {
            std::swap(arr[i], arr[min_idx]);
        }
    }
}`,
  tsImplementation: `function selectionSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (result[j] < result[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      const temp = result[i];
      result[i] = result[minIdx];
      result[minIdx] = temp;
    }
  }
  return result;
}`,
  explanation: [
    "Selection sort divides the input list into two parts: a sorted sublist and an unsorted sublist.",
    "It repeatedly finds the minimum element from the unsorted sublist and moves it to the end of the sorted sublist.",
    "It maintains a running pointer iteratively selecting the smallest remaining item.",
    "It performs fewer swaps than Bubble Sort but always takes O(n²) time regardless of initial array ordering."
  ],
  resources: [
    { label: "Wikipedia: Selection Sort", url: "https://en.wikipedia.org/wiki/Selection_sort" },
    { label: "HackerEarth: Selection Sort", url: "https://www.hackerearth.com/practice/algorithms/sorting/selection-sort/tutorial/" }
  ],
};
