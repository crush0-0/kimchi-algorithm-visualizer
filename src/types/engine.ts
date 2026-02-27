export interface EnginePlayOptions {
  speed: number; // 1 to 100
}

export interface BaseEngine<TStep> {
  load: (steps: TStep[]) => void;
  play: (options?: EnginePlayOptions) => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  isPlaying: boolean;
  isFinished: boolean;
  progress: number; // 0 to 1
}
