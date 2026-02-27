import type { Algorithm } from "../../types/algorithm";
import type { ArrayStep } from "../../types/steps";

export const mergeSort: Algorithm<number[], ArrayStep> = {
  id: "merge-sort",
  name: "Merge Sort",
  category: "sorting",
  description: "An efficient, stable, divide-and-conquer sorting algorithm that works by conceptually dividing the unsorted list into n sublists, then repeatedly merging sublists.",
  complexity: {
    time: "O(n log n)",
    space: "O(n)",
  },
  generateSteps: (array: number[]): ArrayStep[] => {
    const steps: ArrayStep[] = [];
    const arr = [...array];

    function merge(start: number, mid: number, end: number) {
      const left = arr.slice(start, mid + 1);
      const right = arr.slice(mid + 1, end + 1);

      let i = 0, j = 0, k = start;

      while (i < left.length && j < right.length) {
        steps.push({ type: "compare", indices: [start + i, mid + 1 + j] });
        if (left[i] <= right[j]) {
          steps.push({ type: "overwrite", index: k, value: left[i] });
          arr[k] = left[i];
          i++;
        } else {
          steps.push({ type: "overwrite", index: k, value: right[j] });
          arr[k] = right[j];
          j++;
        }
        k++;
      }

      while (i < left.length) {
        steps.push({ type: "overwrite", index: k, value: left[i] });
        arr[k] = left[i];
        i++;
        k++;
      }

      while (j < right.length) {
        steps.push({ type: "overwrite", index: k, value: right[j] });
        arr[k] = right[j];
        j++;
        k++;
      }
    }

    function sort(start: number, end: number) {
      if (start >= end) return;
      const mid = Math.floor((start + end) / 2);
      sort(start, mid);
      sort(mid + 1, end);
      merge(start, mid, end);

      if (start === 0 && end === array.length - 1) {
         for (let i = 0; i < array.length; i++) {
           steps.push({type: 'mark_sorted', index: i});
         }
      }
    }

    sort(0, arr.length - 1);
    return steps;
  },
  pseudocode: [
    "function mergeSort(array)",
    "  if length of array <= 1",
    "    return array",
    "  mid = length of array / 2",
    "  left = mergeSort(array[0 to mid])",
    "  right = mergeSort(array[mid to end])",
    "  return merge(left, right)",
    "",
    "function merge(left, right)",
    "  result = empty array",
    "  while left and right are not empty",
    "    if left[0] <= right[0]",
    "      append left[0] to result",
    "    else",
    "      append right[0] to result",
    "  append remaining of left and right to result",
    "  return result"
  ],
  cppImplementation: `void merge(std::vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    std::vector<int> L(n1), R(n2);
    
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) { arr[k] = L[i]; i++; k++; }
    while (j < n2) { arr[k] = R[j]; j++; k++; }
}

void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}`,
  tsImplementation: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  const result: number[] = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
  explanation: [
    "Merge Sort is an efficient, stable sorting algorithm that makes use of the divide and conquer strategy.",
    "Conceptually, it works by dividing the unsorted list into n sublists, each containing one element (a list of one element is considered sorted).",
    "Then, it repeatedly merges sublists to produce new sorted sublists until there is only one sorted list remaining.",
    "Unlike Quick Sort or Heap Sort, Merge Sort guarantees O(n log n) running time, but requires O(n) auxiliary space."
  ],
  resources: [
    { label: "Wikipedia: Merge Sort", url: "https://en.wikipedia.org/wiki/Merge_sort" },
    { label: "Topcoder: Merge Sort", url: "https://www.topcoder.com/thrive/articles/Merge%20Sort" }
  ]
};
