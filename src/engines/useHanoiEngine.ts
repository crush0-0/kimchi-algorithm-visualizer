import { useState, useRef, useCallback, useEffect } from "react";
import type { HanoiStep } from "../types/steps";
import type { BaseEngine, EnginePlayOptions } from "../types/engine";

export type PlaybackState = "idle" | "running" | "paused" | "completed";

// A rod contains an array of disk sizes (e.g. [3, 2, 1] means 3 is at bottom)
export interface VisualHanoiState {
  rods: [number[], number[], number[]];
  activeDisk: number | null; // For possible lift animations
  callStack: string[];
}

export interface HanoiEngineHook extends BaseEngine<HanoiStep> {
  hanoiState: VisualHanoiState;
  playbackState: PlaybackState;
  numDisks: number;
  setNumDisks: (n: number) => void;
}

export function useHanoiEngine(initialDisks: number = 3): HanoiEngineHook {
  const [numDisks, setNumDisksState] = useState(initialDisks);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [progress, setProgress] = useState(0);

  const [hanoiState, setHanoiState] = useState<VisualHanoiState>({
    rods: [Array.from({ length: initialDisks }, (_, i) => initialDisks - i), [], []],
    activeDisk: null,
    callStack: []
  });

  const stepsRef = useRef<HanoiStep[]>([]);
  const currentStepIndexRef = useRef(0);
  const requestRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);
  const speedRef = useRef<number>(50);

  const initiateHanoi = useCallback((disks: number, resetData: boolean = true) => {
    setHanoiState({
      rods: [Array.from({ length: disks }, (_, i) => disks - i), [], []],
      activeDisk: null,
      callStack: []
    });
    setPlaybackState("idle");
    setProgress(0);
    currentStepIndexRef.current = 0;
    
    if (resetData) stepsRef.current = [];
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  }, []);

  // Sync state if disks UI prop changes
  useEffect(() => {
    initiateHanoi(numDisks);
  }, [numDisks, initiateHanoi]);

  const load = useCallback((steps: HanoiStep[]) => {
    stepsRef.current = steps;
    initiateHanoi(numDisks, false);
  }, [initiateHanoi, numDisks]);

  const processStep = useCallback((step: HanoiStep) => {
    setHanoiState(prev => {
      // Deep clone rods
      const nextRods: [number[], number[], number[]] = [
        [...prev.rods[0]],
        [...prev.rods[1]],
        [...prev.rods[2]]
      ];
      const nextStack = [...prev.callStack];

      switch (step.type) {
        case "move_disk":
          const diskToMove = nextRods[step.fromRod].pop();
          if (diskToMove !== undefined && diskToMove === step.disk) {
               nextRods[step.toRod].push(diskToMove);
          }
          break;
        case "push_stack_frame":
          nextStack.unshift(step.description);
          break;
        case "pop_stack_frame":
          nextStack.shift();
          break;
      }
      return {
          rods: nextRods,
          callStack: nextStack,
          activeDisk: null
      };
    });
  }, []);

  const animate = useCallback((time: number) => {
    if (playbackState !== "running") return;

    // Convert speed to ms 
    const targetDelay = 1000 / Math.max(1, (speedRef.current / 2));

    if (time - lastUpdateRef.current >= targetDelay) {
      if (currentStepIndexRef.current < stepsRef.current.length) {
        processStep(stepsRef.current[currentStepIndexRef.current]);
        currentStepIndexRef.current++;
        setProgress(currentStepIndexRef.current / stepsRef.current.length);
        lastUpdateRef.current = time;
      } else {
        setPlaybackState("completed");
        setProgress(1);
        return;
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
        if (playbackState === "completed") {
           initiateHanoi(numDisks, false);
        }
    }
    setPlaybackState("running");
  }, [playbackState, initiateHanoi, numDisks]);

  const pause = useCallback(() => setPlaybackState("paused"), []);
  
  const reset = useCallback(() => initiateHanoi(numDisks, true), [initiateHanoi, numDisks]);
  
  const setNumDisks = useCallback((n: number) => {
     setNumDisksState(n);
  }, []);

  const setSpeed = useCallback((s: number) => { speedRef.current = s; }, []);

  return {
    hanoiState,
    playbackState,
    numDisks,
    setNumDisks,
    load,
    play,
    pause,
    reset,
    setSpeed,
    isPlaying: playbackState === "running",
    isFinished: playbackState === "completed",
    progress
  };
}
