import type { Algorithm } from "../../types/algorithm";
import type { HanoiStep } from "../../types/steps";

export const towerOfHanoi: Algorithm<number, HanoiStep> = {
  id: "tower-of-hanoi",
  name: "Tower of Hanoi",
  category: "recursion",
  description: "A mathematical puzzle where the objective is to move a stack of disks from one rod to another, obeying specific sizing rules.",
  complexity: {
    time: "O(2^n)",
    space: "O(n)",
  },
  generateSteps: (numDisks: number): HanoiStep[] => {
    const steps: HanoiStep[] = [];

    function solve(n: number, fromRod: 0 | 1 | 2, toRod: 0 | 1 | 2, auxRod: 0 | 1 | 2) {
      if (n === 1) {
        steps.push({ type: "move_disk", disk: n, fromRod, toRod });
        return;
      }
      
      steps.push({ type: "push_stack_frame", description: `solve(${n-1}, ${fromRod}, ${auxRod}, ${toRod})` });
      solve(n - 1, fromRod, auxRod, toRod);
      steps.push({ type: "pop_stack_frame" });
      
      steps.push({ type: "move_disk", disk: n, fromRod, toRod });
      
      steps.push({ type: "push_stack_frame", description: `solve(${n-1}, ${auxRod}, ${toRod}, ${fromRod})` });
      solve(n - 1, auxRod, toRod, fromRod);
      steps.push({ type: "pop_stack_frame" });
    }

    // Initialize with 3 disks if standard isn't provided, max 8 for safety
    // Initialize with 3 disks if standard isn't provided, max 12 for safety
    const n = Math.max(1, Math.min(numDisks || 3, 12));
    steps.push({ type: "push_stack_frame", description: `solve(${n}, 0, 2, 1)` });
    solve(n, 0, 2, 1);
    steps.push({ type: "pop_stack_frame" });

    return steps;
  },
  pseudocode: [
    "function solve(n, source, target, auxiliary)",
    "  if n == 1",
    "    Move disk 1 from source to target",
    "    return",
    "  solve(n - 1, source, auxiliary, target)",
    "  Move disk n from source to target",
    "  solve(n - 1, auxiliary, target, source)"
  ],
  cppImplementation: `void towerOfHanoi(int n, char from_rod, char to_rod, char aux_rod) {
    if (n == 1) {
        std::cout << "Move disk 1 from rod " << from_rod << " to rod " << to_rod << std::endl;
        return;
    }
    towerOfHanoi(n - 1, from_rod, aux_rod, to_rod);
    std::cout << "Move disk " << n << " from rod " << from_rod << " to rod " << to_rod << std::endl;
    towerOfHanoi(n - 1, aux_rod, to_rod, from_rod);
}`,
  tsImplementation: `function towerOfHanoi(n: number, from: string, to: string, aux: string): void {
  if (n === 1) {
    console.log(\`Move disk 1 from \${from} to \${to}\`);
    return;
  }
  towerOfHanoi(n - 1, from, aux, to);
  console.log(\`Move disk \${n} from \${from} to \${to}\`);
  towerOfHanoi(n - 1, aux, to, from);
}`,
  explanation: [
    "The Tower of Hanoi is a classic recursive problem.",
    "The rules are: you can only move one disk at a time, you can only move the top disk from a stack, and no disk may be placed on top of a smaller disk.",
    "The recursive insight is: to move N disks to the target, you first move N-1 disks to the auxiliary rod, then move the Nth disk to the target, and finally move the N-1 disks from the auxiliary rod to the target."
  ],
  resources: [
      { label: "Wikipedia: Tower of Hanoi", url: "https://en.wikipedia.org/wiki/Tower_of_Hanoi" },
      { label: "Math is Fun: Tower of Hanoi", url: "https://www.mathsisfun.com/games/towerofhanoi.html" }
  ]
};
