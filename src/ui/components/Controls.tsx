import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";
import type { PlaybackState } from "../../engines/useArrayEngine"; // Or generic Engine playback type

interface ControlsProps {
  playbackState: PlaybackState;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  disabled: boolean;
  
  // Specific array/hanoi props (optional based on category)
  size?: number;
  maxSize?: number;
  onSizeChange?: (size: number) => void;
  onShuffle?: () => void;
}

export function Controls({
  playbackState,
  speed,
  onSpeedChange,
  onStart,
  onPause,
  onReset,
  disabled,
  size,
  maxSize = 100,
  onSizeChange,
  onShuffle
}: ControlsProps) {
  const isRunning = playbackState === "running";

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-surface0 rounded-2xl border border-surface1">
      {/* Playback Controls */}
      <div className="flex items-center gap-2 border-r border-surface1 pr-4">
        <button
          onClick={isRunning ? onPause : onStart}
          disabled={disabled && !isRunning}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-mauve text-base hover:bg-mauve/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isRunning ? "Pause" : "Play"}
        >
          {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        
        <button
          onClick={onReset}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface1 text-text hover:bg-surface2 transition-colors disabled:opacity-50"
          aria-label="Reset State"
        >
          <RotateCcw size={18} />
        </button>
        
        {onShuffle && (
          <button
            onClick={onShuffle}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface1 text-text hover:bg-surface2 transition-colors disabled:opacity-50"
            aria-label="Shuffle"
          >
            <Shuffle size={18} />
          </button>
        )}
      </div>

      {/* Sliders */}
      <div className="flex flex-1 items-center gap-6 pl-2 min-w-[200px]">
        {/* Speed Slider */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-subtext0">
            <span>Speed</span>
            <span className="font-mono">{speed}</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-crust rounded-lg appearance-none cursor-pointer accent-mauve"
          />
        </div>

        {/* Size Slider (if applicable to engine) */}
        {size !== undefined && onSizeChange !== undefined && (
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-medium text-subtext0">
              <span>Items</span>
              <span className="font-mono">{size}</span>
            </div>
            <input
              type="range"
              min="3"   // min 3 for hanoi specifically, generally safe for array too
              max={maxSize}
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-crust rounded-lg appearance-none cursor-pointer accent-sapphire"
              disabled={isRunning}
            />
          </div>
        )}
      </div>
    </div>
  );
}
