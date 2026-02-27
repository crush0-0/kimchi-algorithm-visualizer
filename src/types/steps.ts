export type ArrayStep =
  | { type: "compare"; indices: [number, number] }
  | { type: "swap"; indices: [number, number] }
  | { type: "overwrite"; index: number; value: number }
  | { type: "highlight"; indices: number[] }
  | { type: "mark_sorted"; index: number }
  | { type: "mark_visited"; index: number };

export type GraphStep =
  | { type: "visit_node"; nodeId: string }
  | { type: "explore_edge"; fromId: string; toId: string }
  | { type: "mark_visited"; nodeId: string }
  | { type: "update_distance"; nodeId: string; distance: number }
  | { type: "set_parent"; nodeId: string; parentId: string }
  | { type: "highlight_path"; nodeIds: string[] };

export type HanoiStep =
  | { type: "move_disk"; disk: number; fromRod: 0 | 1 | 2; toRod: 0 | 1 | 2 }
  | { type: "push_stack_frame"; description: string }
  | { type: "pop_stack_frame" };

// A generic Step union if needed for loose typing, though strict TStep is preferred in Algorithms
export type Step = ArrayStep | GraphStep | HanoiStep;
