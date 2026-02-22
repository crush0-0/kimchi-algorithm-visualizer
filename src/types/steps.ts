// Defines the basic operations an algorithm can perform during its run.
// This allows the visualizer engine to deterministically play back
// actions without knowing the specifics of the algorithm itself.

export type Step =
  | { type: "compare"; indices: [number, number] }
  | { type: "swap"; indices: [number, number] }
  | { type: "overwrite"; index: number; value: number }
  | { type: "markSorted"; index: number };
