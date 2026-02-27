import { useState, useRef, useCallback, useEffect } from "react";
import type { GraphStep } from "../types/steps";
import type { BaseEngine, EnginePlayOptions } from "../types/engine";
import type { GraphData } from "../types/graph";

export type PlaybackState = "idle" | "running" | "paused" | "completed";

export interface VisualGraphState {
  visitedNodes: Set<string>;
  currentNode: string | null;
  activeEdges: Set<string>; // ID format "from_to"
  distances: Record<string, number>;
  parents: Record<string, string>;
  finalPath: Set<string>; // Nodes in the final highlighted path
}

export interface GraphEngineHook extends BaseEngine<GraphStep> {
  graphState: VisualGraphState;
  playbackState: PlaybackState;
  graphData: GraphData | null;
  setGraphData: (data: GraphData) => void;
}

export function useGraphEngine(initialGraph?: GraphData): GraphEngineHook {
  const [graphData, setGraphData] = useState<GraphData | null>(initialGraph || null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [progress, setProgress] = useState(0);

  const [graphState, setGraphState] = useState<VisualGraphState>({
    visitedNodes: new Set(),
    currentNode: null,
    activeEdges: new Set(),
    distances: {},
    parents: {},
    finalPath: new Set()
  });

  const stepsRef = useRef<GraphStep[]>([]);
  const currentStepIndexRef = useRef(0);
  const requestRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);
  const speedRef = useRef<number>(50);

  const initiateGraph = useCallback((resetData: boolean = true) => {
    setGraphState({
      visitedNodes: new Set(),
      currentNode: null,
      activeEdges: new Set(),
      distances: {},
      parents: {},
      finalPath: new Set()
    });
    setPlaybackState("idle");
    setProgress(0);
    currentStepIndexRef.current = 0;
    
    if (resetData) stepsRef.current = [];
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  }, []);

  const load = useCallback((steps: GraphStep[]) => {
    stepsRef.current = steps;
    initiateGraph(false);
  }, [initiateGraph]);

  const processStep = useCallback((step: GraphStep) => {
    setGraphState(prev => {
      // Create new references
      const next = {
          ...prev, 
          visitedNodes: new Set(prev.visitedNodes),
          activeEdges: new Set(prev.activeEdges),
          distances: { ...prev.distances },
          parents: { ...prev.parents },
          finalPath: new Set(prev.finalPath)
      };

      // Clear volatile states unless overriden
      next.activeEdges.clear();

      switch (step.type) {
        case "visit_node":
          next.currentNode = step.nodeId;
          break;
        case "mark_visited":
          next.visitedNodes.add(step.nodeId);
          break;
        case "explore_edge":
          next.activeEdges.add(`${step.fromId}_${step.toId}`);
          break;
        case "update_distance":
          next.distances[step.nodeId] = step.distance;
          break;
        case "set_parent":
          next.parents[step.nodeId] = step.parentId;
          break;
        case "highlight_path":
          step.nodeIds.forEach(id => next.finalPath.add(id));
          next.currentNode = null;
          break;
      }
      return next;
    });
  }, []);

  const animate = useCallback((time: number) => {
    if (playbackState !== "running") return;

    // Convert speed to ms (50 is baseline)
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
           initiateGraph(false);
        }
    }
    setPlaybackState("running");
  }, [playbackState, initiateGraph]);

  const pause = useCallback(() => setPlaybackState("paused"), []);
  
  const reset = useCallback(() => initiateGraph(true), [initiateGraph]);

  const setSpeed = useCallback((s: number) => { speedRef.current = s; }, []);

  return {
    graphState,
    playbackState,
    graphData,
    setGraphData,
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
