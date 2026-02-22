import type { AlgorithmDefinition } from "../../types/algorithm";
import type { Step } from "../../types/steps";

export const quickSort: AlgorithmDefinition = {
  id: "quick-sort",
  name: "Quick Sort",
  complexity: {
    time: "O(n log n)",
    space: "O(log n)",
  },
  generateSteps: (array: number[]): Step[] => {
    const steps: Step[] = [];
    const arr = [...array];

    function partition(low: number, high: number): number {
      const pivot = arr[high]; // pivot selection
      let i = low - 1;

      for (let j = low; j < high; j++) {
        steps.push({ type: "compare", indices: [j, high] });
        if (arr[j] < pivot) {
          i++;
          steps.push({ type: "swap", indices: [i, j] });
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
      
      steps.push({ type: "swap", indices: [i + 1, high] });
      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      
      // The pivot is now in its correct sorted position
      steps.push({ type: "markSorted", index: i + 1 });
      
      return i + 1;
    }

    function sort(low: number, high: number) {
      if (low < high) {
        const pi = partition(low, high);
        sort(low, pi - 1);
        sort(pi + 1, high);
      } else if (low === high) {
         // Sub-array of size 1 is inherently sorted
         steps.push({ type: "markSorted", index: low });
      }
    }

    sort(0, arr.length - 1);

    return steps;
  },
  pseudocode: [
    "function quickSort(array, low, high)",
    "  if low < high",
    "    pi = partition(array, low, high)",
    "    quickSort(array, low, pi - 1)",
    "    quickSort(array, pi + 1, high)",
    "",
    "function partition(array, low, high)",
    "  pivot = array[high]",
    "  i = low - 1",
    "  for j = low to high - 1",
    "    if array[j] < pivot",
    "      i = i + 1",
    "      swap array[i] with array[j]",
    "  swap array[i + 1] with array[high]",
    "  return i + 1"
  ],
  cppImplementation: `int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
  tsImplementation: `function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
  explanation: [
    "Quick Sort is a highly efficient, general-purpose sorting algorithm.",
    "It relies on memory-efficient divide-and-conquer principles. It picks an element as a 'pivot' and partitions the given array around the picked pivot.",
    "Smaller elements go to the left of the pivot, larger elements go to the right.",
    "Unlike Merge Sort, Quick Sort does not require O(n) auxiliary memory. It is often faster in practice than other O(n log n) algorithms."
  ],
  resources: [
    { label: "Wikipedia: Quicksort", url: "https://en.wikipedia.org/wiki/Quicksort" },
    { label: "Algorithms (Sedgewick): Quicksort", url: "https://algs4.cs.princeton.edu/23quicksort/" }
  ]
};
