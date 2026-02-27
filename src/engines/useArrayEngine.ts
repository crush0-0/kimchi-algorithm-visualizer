import { useState, useRef, useCallback, useEffect } from "react";
import type { ArrayStep } from "../types/steps";
import type { BaseEngine, EnginePlayOptions } from "../types/engine";

export type PlaybackState = "idle" | "running" | "paused" | "completed";

export interface VisualElement {
  value: number;
  state: "default" | "compare" | "swap" | "sorted" | "highlight" | "visited";
}

export interface ArrayEngineHook extends BaseEngine<ArrayStep> {
  visualArray: VisualElement[];
  playbackState: PlaybackState;
  generateNewArray: (size: number) => void;
}

export function useArrayEngine(initialArraySize: number = 30): ArrayEngineHook {
  const [visualArray, setVisualArray] = useState<VisualElement[]>([]);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [progress, setProgress] = useState(0);

  const stepsRef = useRef<ArrayStep[]>([]);
  const currentStepIndexRef = useRef(0);
  const requestRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);
  const speedRef = useRef<number>(50); // Default speed
  
  // Maintain a discrete logical array purely for accurate tracking decoupled from UI delays
  const logicalArrayRef = useRef<number[]>([]);

  const initiateArray = useCallback((size: number) => {
    // Generate 1..size array and shuffle inside
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    logicalArrayRef.current = arr;
    setVisualArray(arr.map(v => ({ value: v, state: "default" })));
    setPlaybackState("idle");
    setProgress(0);
    currentStepIndexRef.current = 0;
    stepsRef.current = [];

    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  }, []);

  // Initialize once
  useEffect(() => {
    initiateArray(initialArraySize);
  }, [initialArraySize, initiateArray]);

  const load = useCallback((steps: ArrayStep[]) => {
    stepsRef.current = steps;
    currentStepIndexRef.current = 0;
    setProgress(0);
    // If we load new steps onto an array that was previously "completed/sorted", we typically 
    // want to keep the underlying structure but reset purely visual states (like colors).
    setVisualArray(prev => prev.map(el => ({ ...el, state: "default" })));
    setPlaybackState("idle");
  }, []);

  const processStep = useCallback((step: ArrayStep) => {
    setVisualArray(prev => {
      // Deep copy maps to avoid strict mode mutations
      const next = prev.map(el => ({
        ...el,
        state: (el.state === "sorted" ? "sorted" : el.state === "visited" ? "visited" : "default") as VisualElement["state"]
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
        case "highlight":
          step.indices.forEach((idx: number) => {
             if (next[idx]) next[idx].state = "highlight";
          });
          break;
        case "mark_sorted":
          if (next[step.index]) next[step.index].state = "sorted";
          break;
        case "mark_visited":
          if (next[step.index]) next[step.index].state = "visited";
          break;
      }
      return next;
    });
  }, []);

  const animate = useCallback((time: number) => {
    if (playbackState !== "running") return;

    // Convert abstract 1-100 speed into millisecond delay
    const targetDelay = 1000 / Math.max(1, speedRef.current);

    if (time - lastUpdateRef.current >= targetDelay) {
      if (currentStepIndexRef.current < stepsRef.current.length) {
        processStep(stepsRef.current[currentStepIndexRef.current]);
        currentStepIndexRef.current++;
        setProgress(currentStepIndexRef.current / stepsRef.current.length);
        lastUpdateRef.current = time;
      } else {
        setPlaybackState("completed");
        setProgress(1);
        return; // Don't loop
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [playbackState, processStep]);

  useEffect(() => {
    if (playbackState === "running") {
      lastUpdateRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [playbackState, animate]);

  const play = useCallback((options?: EnginePlayOptions) => {
    if (options?.speed) speedRef.current = options.speed;
    if (playbackState === "idle" || playbackState === "completed") {
        if (playbackState === "completed") { // soft reset visually
           setVisualArray(prev => prev.map(el => ({ ...el, state: "default" })));
           currentStepIndexRef.current = 0;
           setProgress(0);
        }
    }
    setPlaybackState("running");
  }, [playbackState]);

  const pause = useCallback(() => setPlaybackState("paused"), []);
  
  const reset = useCallback(() => initiateArray(initialArraySize), [initiateArray, initialArraySize]);

  const setSpeed = useCallback((s: number) => { speedRef.current = s; }, []);
  
  const generateNewArray = useCallback((size: number) => {
      initiateArray(size);
  }, [initiateArray]);

  return {
    visualArray,
    playbackState,
    load,
    play,
    pause,
    reset,
    setSpeed,
    generateNewArray,
    isPlaying: playbackState === "running",
    isFinished: playbackState === "completed",
    progress
  };
}
