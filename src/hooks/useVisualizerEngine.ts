import { useState, useRef, useCallback, useEffect } from "react";
import type { AlgorithmDefinition } from "../types/algorithm";
import type { Step } from "../types/steps";

export type PlaybackState = "idle" | "running" | "paused" | "completed";

export interface VisualElement {
  value: number;
  state: "default" | "compare" | "swap" | "sorted";
}

interface EngineHookOptions {
  initialSize?: number;
  initialSpeed?: number;
}

export function useVisualizerEngine({
  initialSize = 30,
  initialSpeed = 10,
}: EngineHookOptions = {}) {
  const [arraySize, setArraySize] = useState(initialSize);
  const [playbackSpeed, setPlaybackSpeed] = useState(initialSpeed);
  
  const [algorithm, setAlgorithm] = useState<AlgorithmDefinition | null>(null);
  const [visualArray, setVisualArray] = useState<VisualElement[]>([]);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");

  const stepsRef = useRef<Step[]>([]);
  const currentStepIndexRef = useRef(0);
  const requestRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);
  
  // Logical array for correct sorting independent of visual state delays
  const logicalArrayRef = useRef<number[]>([]);

  const generateNewArray = useCallback((size: number = arraySize) => {
    // Generate array of numbers from 1 to size
    const newArray = Array.from({ length: size }, (_, i) => i + 1);

    // Shuffle the array (Fisher-Yates)
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    logicalArrayRef.current = newArray;
    setVisualArray(newArray.map(value => ({ value, state: "default" })));

    setPlaybackState("idle");
    currentStepIndexRef.current = 0;
    stepsRef.current = [];
    
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, [arraySize]);

  useEffect(() => {
    generateNewArray();
  }, [generateNewArray]); // Initial generation

  const processStep = useCallback((step: Step) => {
    setVisualArray(prev => {
      // DEEP COPY the objects to avoid React StrictMode double-invocation mutation bugs!
      const next = prev.map(el => ({
        ...el,
        state: (el.state === "sorted" ? "sorted" : "default") as VisualElement["state"]
      }));

      switch (step.type) {
        case "compare":
          next[step.indices[0]].state = "compare";
          next[step.indices[1]].state = "compare";
          break;
        case "swap":
          next[step.indices[0]].state = "swap";
          next[step.indices[1]].state = "swap";
          
          const temp = next[step.indices[0]].value;
          next[step.indices[0]].value = next[step.indices[1]].value;
          next[step.indices[1]].value = temp;
          break;
        case "overwrite":
          next[step.index].state = "swap";
          next[step.index].value = step.value;
          break;
        case "markSorted":
          if ('index' in step && next[step.index]) {
            next[step.index].state = "sorted";
          }
          break;
      }
      
      return next;
    });
  }, []);

  const animate = useCallback((time: number) => {
    if (playbackState !== "running") return;

    // Convert speed (1-100) to delay ms
    // 100 speed -> 10ms delay, 1 speed -> ~1000ms delay
    const targetDelay = 1000 / Math.max(1, playbackSpeed);

    if (time - lastUpdateRef.current >= targetDelay) {
      if (currentStepIndexRef.current < stepsRef.current.length) {
        processStep(stepsRef.current[currentStepIndexRef.current]);
        currentStepIndexRef.current++;
        lastUpdateRef.current = time;
      } else {
        setPlaybackState("completed");
        return;
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [playbackState, playbackSpeed, processStep]);

  useEffect(() => {
    if (playbackState === "running") {
      lastUpdateRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [playbackState, animate]);

  const start = () => {
    if (!algorithm) return;

    if (playbackState === "idle" || playbackState === "completed") {
      if (playbackState === "completed") {
        // Soft reset visual states if restarting from completed array
        setVisualArray(prev => prev.map(el => ({ ...el, state: "default" })));
        logicalArrayRef.current = visualArray.map(el => el.value);
      }
      stepsRef.current = algorithm.generateSteps([...logicalArrayRef.current]);
      currentStepIndexRef.current = 0;
    }
    setPlaybackState("running");
  };

  const pause = () => setPlaybackState("paused");
  
  const reset = () => {
    generateNewArray();
  };

  const shuffle = () => {
    generateNewArray();
  };

  const handleSetAlgorithm = useCallback((alg: AlgorithmDefinition | null) => {
    setAlgorithm(alg);
    setPlaybackState("idle");
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    generateNewArray();
  }, [generateNewArray]);

  return {
    visualArray,
    playbackState,
    algorithm,
    arraySize,
    playbackSpeed,
    setAlgorithm: handleSetAlgorithm,
    setArraySize,
    setPlaybackSpeed,
    start,
    pause,
    reset,
    shuffle
  };
}
