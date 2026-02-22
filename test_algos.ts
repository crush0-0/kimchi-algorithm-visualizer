import { algorithms } from './src/algorithms';

for (const alg of algorithms) {
  const arr = [5, 3, 8, 1, 2];
  const steps = alg.generateSteps(arr);
  console.log(`${alg.name}: ${steps.length} steps generated.`);
}
