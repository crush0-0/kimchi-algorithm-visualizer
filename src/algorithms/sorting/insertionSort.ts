import type { Algorithm } from "../../types/algorithm";
import type { ArrayStep } from "../../types/steps";

export const insertionSort: Algorithm<number[], ArrayStep> = {
  id: "insertion-sort",
  name: "Insertion Sort",
  category: "sorting",
  description: "A simple sorting algorithm that builds the final sorted array (or list) one item at a time by comparisons.",
  complexity: {
    time: "O(n²)",
    space: "O(1)",
  },
  generateSteps: (array: number[]): ArrayStep[] => {
    const steps: ArrayStep[] = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({ type: "mark_sorted", index: 0 }); // First element is trivially sorted

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= 0) {
        steps.push({ type: "compare", indices: [j, i] });
        if (arr[j] > key) {
          // Visual shift right
          steps.push({ type: "overwrite", index: j + 1, value: arr[j] });
          arr[j + 1] = arr[j];
          j--;
        } else {
          break;
        }
      }
      
      // Drop the key into its final slot
      steps.push({ type: "overwrite", index: j + 1, value: key });
      arr[j + 1] = key;
      
      // Mark the newly placed element
      steps.push({ type: "mark_sorted", index: j + 1 });
    }

    return steps;
  },
  pseudocode: [
    "for i from 1 to array.length",
    "  key = array[i]",
    "  j = i - 1",
    "  while j >= 0 and array[j] > key",
    "    array[j + 1] = array[j]",
    "    j = j - 1",
    "  array[j + 1] = key",
  ],
  cppImplementation: `void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
  tsImplementation: `function insertionSort(arr: number[]): number[] {
  const result = [...arr];
  for (let i = 1; i < result.length; i++) {
    const key = result[i];
    let j = i - 1;
    while (j >= 0 && result[j] > key) {
      result[j + 1] = result[j];
      j--;
    }
    result[j + 1] = key;
  }
  return result;
}`,
  explanation: [
    "Insertion sort builds the final sorted array one item at a time.",
    "It iterates through an input array and removes one element per iteration, finds the place it belongs in the sorted list, and inserts it there.",
    "It repeats until no input elements remain.",
    "It is much more efficient on small data sets or mostly-sorted sequences than other O(n²) algorithms."
  ],
  resources: [
    { label: "Wikipedia: Insertion Sort", url: "https://en.wikipedia.org/wiki/Insertion_sort" },
    { label: "InterviewBit: Insertion Sort", url: "https://www.interviewbit.com/tutorial/insertion-sort-algorithm/" }
  ],
};
