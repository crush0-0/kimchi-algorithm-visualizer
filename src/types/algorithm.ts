import type { Step } from "./steps";

export interface AlgorithmDefinition {
  id: string;
  name: string;
  pseudocode: string[];
  cppImplementation: string;
  tsImplementation: string;
  explanation: string[];
  complexity: {
    time: string;
    space: string;
  };
  generateSteps: (array: number[]) => Step[];
  resources: { label: string; url: string }[];
}
