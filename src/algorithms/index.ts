import type { Algorithm } from "../types/algorithm";
import { bubbleSort } from "./sorting/bubbleSort";
import { selectionSort } from "./sorting/selectionSort";
import { insertionSort } from "./sorting/insertionSort";
import { mergeSort } from "./sorting/mergeSort";
import { quickSort } from "./sorting/quickSort";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const algorithms: Algorithm<any, any>[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort
];
