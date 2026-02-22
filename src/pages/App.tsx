import { useState } from "react";
import { useVisualizerEngine } from "../hooks/useVisualizerEngine";
import { algorithms } from "../algorithms";
import { Controls } from "../components/Controls";
import { Visualizer } from "../components/Visualizer";
import { Sidebar } from "../components/Sidebar";

export function VisualizerInstance() {
  const engine = useVisualizerEngine();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-surface1 last:border-r-0">
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden relative">
          
          {/* Header Controls (Algorithm Select) */}
          <div className="flex flex-wrap items-center gap-4 bg-surface0 p-3 rounded-2xl border border-surface1 z-10">
            <select
              value={engine.algorithm?.id || ""}
              onChange={(e) => {
                const alg = algorithms.find((a) => a.id === e.target.value);
                if (alg) engine.setAlgorithm(alg);
              }}
              className="bg-crust border border-surface1 text-text rounded-lg px-4 py-2 outline-none focus:border-mauve transition-colors font-medium appearance-none cursor-pointer pr-10 min-w-[200px]"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a6adc8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
            >
              <option value="" disabled>Select Algorithm...</option>
              {algorithms.map((alg) => (
                <option key={alg.id} value={alg.id}>
                  {alg.name}
                </option>
              ))}
            </select>
            
            <div className="flex-1" />
            
            {/* Playback Status indicator */}
            <div className="px-3 py-1 rounded-full bg-crust border border-surface1 text-xs font-mono font-medium text-subtext0 flex items-center gap-2">
              <div className={
                "w-2 h-2 rounded-full " +
                (engine.playbackState === "running" ? "bg-green animate-pulse" :
                engine.playbackState === "paused" ? "bg-yellow" :
                engine.playbackState === "completed" ? "bg-mauve" : "bg-surface2")
              } />
              {engine.playbackState.toUpperCase()}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 min-h-[300px] overflow-hidden">
            <Visualizer array={engine.visualArray} />
          </div>

          {/* Bottom Controls */}
          <div className="z-10 mt-auto">
            <Controls
              playbackState={engine.playbackState}
              speed={engine.playbackSpeed}
              size={engine.arraySize}
              onSpeedChange={engine.setPlaybackSpeed}
              onSizeChange={engine.setArraySize}
              onStart={engine.start}
              onPause={engine.pause}
              onReset={engine.reset}
              onShuffle={engine.shuffle}
              disabled={!engine.algorithm}
            />
          </div>
        </div>

        {/* Technical / Education Sidebar */}
        <Sidebar algorithm={engine.algorithm} />
        
      </div>
    </div>
  );
}

export function App() {
  const [isSplitScreen, setIsSplitScreen] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] mt-14">
      {/* Utility Bar above instances for split screen toggle */}
      <div className="h-12 border-b border-surface1 flex items-center justify-end px-6 bg-base flex-shrink-0">
        <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-subtext0 hover:text-text transition-colors">
          <input
            type="checkbox"
            checked={isSplitScreen}
            onChange={(e) => setIsSplitScreen(e.target.checked)}
            className="w-4 h-4 rounded appearance-none border border-surface2 bg-crust checked:bg-mauve checked:border-mauve transition-colors relative after:content-[''] after:absolute after:hidden checked:after:block after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-crust after:left-1/2 after:top-[40%] after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-45"
          />
          Split Screen Compare
        </label>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-base">
        <VisualizerInstance />
        
        {isSplitScreen && (
          <VisualizerInstance />
        )}
      </div>
    </div>
  );
}
