export type AlgorithmCategory = 
  | "sorting"
  | "searching"
  | "recursion"
  | "graph";

export interface Algorithm<TInput, TStep> {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  pseudocode: string[];
  cppImplementation: string;
  tsImplementation: string;
  explanation: string[];
  complexity: {
    time: string;
    space: string;
  };
  generateSteps: (input: TInput) => TStep[];
  resources: { label: string; url: string }[];
}
