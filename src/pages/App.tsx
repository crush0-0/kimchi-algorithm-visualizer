import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import type { AlgorithmCategory, Algorithm } from "../types/algorithm";
import { algorithms } from "../algorithms/registry";
import { romaniaGraph } from "../algorithms/graph/data/romania";

import { MainLayout } from "../ui/layout/MainLayout";
import { Sidebar } from "../ui/components/Sidebar";
import { Controls } from "../ui/components/Controls";
import { LeftSidebar } from "../ui/components/LeftSidebar";

// Engines
import { useArrayEngine } from "../engines/useArrayEngine";
import { useGraphEngine } from "../engines/useGraphEngine";
import { useHanoiEngine } from "../engines/useHanoiEngine";

// Visualizers
import { ArrayVisualizer } from "../visualizers/ArrayVisualizer";
import { GraphVisualizer } from "../visualizers/GraphVisualizer";
import { HanoiVisualizer } from "../visualizers/HanoiVisualizer";

function AppContent() {
  const [activeCategory, setActiveCategory] = useState<AlgorithmCategory | "all">("sorting");
  
  // Default to first sorting algorithm
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeAlg, setActiveAlg] = useState<Algorithm<any, any> | null>(
      algorithms.find(a => a.category === "sorting") || null
  );

  // -- Engine Hooks --
  // We initialize all engines but only drive the active one.
  const arrayEngine = useArrayEngine(30);
  const graphEngine = useGraphEngine();
  const hanoiEngine = useHanoiEngine(3);
  const { theme, toggleTheme } = useTheme();

  // Handle Algorithm Switch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectAlgorithm = (alg: Algorithm<any, any>) => {
      // Pause all engines
      arrayEngine.pause();
      graphEngine.pause();
      hanoiEngine.pause();
      
      setActiveAlg(alg);

      // Pre-load dummy data or default state based on category to reset views instantly
      if (alg.category === "sorting" || alg.category === "searching") {
          arrayEngine.reset();
      } else if (alg.category === "graph") {
          graphEngine.reset();
      } else if (alg.category === "recursion") {
          hanoiEngine.reset();
      }
  };

  // Master Play Wrapper mapping to correct active engine
  const handlePlay = () => {
     if (!activeAlg) return;
     
     if (activeAlg.category === "sorting" || activeAlg.category === "searching") {
         if (arrayEngine.isFinished || arrayEngine.visualArray.every(v => v.state === "default" && v.value === 0)) {
              // Generate steps fresh if needed. Usually arrayEngine.load does this.
              const arr = arrayEngine.visualArray.map(v => v.value);
              const steps = activeAlg.generateSteps(arr);
              arrayEngine.load(steps);
         }
         arrayEngine.play({ speed: globalSpeed });
     } else if (activeAlg.category === "graph") {
         if (graphEngine.isFinished || !graphEngine.isPlaying) {
             const steps = activeAlg.generateSteps(romaniaGraph); // Graph algorithms use static dataset internally for now
             graphEngine.load(steps);
         }
         graphEngine.play({ speed: globalSpeed });
     } else if (activeAlg.category === "recursion") {
         if (hanoiEngine.isFinished || !hanoiEngine.isPlaying) {
             const steps = activeAlg.generateSteps(hanoiEngine.numDisks);
             hanoiEngine.load(steps);
         }
         hanoiEngine.play({ speed: globalSpeed });
     }
  };

  const handlePause = () => {
      arrayEngine.pause();
      graphEngine.pause();
      hanoiEngine.pause();
  };

  const handleReset = () => {
      if (!activeAlg) return;
      if (activeAlg.category === "sorting" || activeAlg.category === "searching") {
          arrayEngine.reset();
      } else if (activeAlg.category === "graph") {
          graphEngine.reset();
      } else if (activeAlg.category === "recursion") {
          hanoiEngine.reset();
      }
  };

  // Master Controls Prop Mapping
  let activeState: "idle" | "running" | "paused" | "completed" = "idle";
  let activeSpeed = 50;
  let activeSetSpeed = (_s: number) => {};
  let optionalSize: number | undefined;
  let optionalSetSize: ((s: number) => void) | undefined;
  let optionalMaxSize: number | undefined;
  let optionalShuffle: (() => void) | undefined;

  if (activeAlg?.category === "sorting" || activeAlg?.category === "searching") {
      activeState = arrayEngine.playbackState;
      optionalSize = arrayEngine.visualArray.length;
      optionalMaxSize = activeAlg?.category === "searching" ? 20 : 100;
      optionalSetSize = (_size) => {
         arrayEngine.pause();
         arrayEngine.generateNewArray(_size);
      };
      optionalShuffle = () => arrayEngine.reset();
      
      // Speed wrapper for Array Engine doesn't expose speed state directly right now
      // A proper refactor would put speed state in standard React state, but we'll manage via play options for now.
  } else if (activeAlg?.category === "graph") {
      activeState = graphEngine.playbackState;
  } else if (activeAlg?.category === "recursion") {
      activeState = hanoiEngine.playbackState;
      optionalSize = hanoiEngine.numDisks;
      optionalSetSize = hanoiEngine.setNumDisks;
      optionalMaxSize = 12;
  }

  // Local speed state to feed into `opts.speed` on play wrapper
  const [globalSpeed, setGlobalSpeed] = useState(50);
  activeSpeed = globalSpeed;
  activeSetSpeed = (v) => {
      setGlobalSpeed(v);
      arrayEngine.setSpeed(v);
      graphEngine.setSpeed(v);
      hanoiEngine.setSpeed(v);
  };


  // Master Render switch mapping to correct component
  const renderVisualizer = () => {
      if (!activeAlg) return null;
      switch (activeAlg.category) {
          case "sorting":
              return <ArrayVisualizer array={arrayEngine.visualArray} mode="bar" />;
          case "searching":
              return <ArrayVisualizer array={arrayEngine.visualArray} mode="card" />;
          case "graph":
              return <GraphVisualizer graphData={romaniaGraph} state={graphEngine.graphState} />;
          case "recursion":
              return <HanoiVisualizer state={hanoiEngine.hanoiState} totalDisks={hanoiEngine.numDisks} />;
          default:
              return null;
      }
  };


  return (
    <MainLayout
       header={
           <div>
               <div className="flex justify-between items-center mb-4">
                 <h1 className="text-3xl font-extrabold text-text tracking-tight">
                     Kimchi <span className="text-mauve font-normal">Algorithm Platform</span>
                 </h1>
                 <button 
                   onClick={toggleTheme}
                   className="p-2 rounded-full hover:bg-surface0 transition-colors text-subtext0 hover:text-text cursor-pointer"
                   aria-label="Toggle Theme"
                 >
                   {theme === "dark" ? "🌙" : "☀️"}
                 </button>
               </div>
           </div>
       }
       leftSidebar={
           <LeftSidebar 
              algorithms={algorithms}
              activeCategory={activeCategory}
              activeAlgorithm={activeAlg}
              onSelectCategory={setActiveCategory}
              onSelectAlgorithm={handleSelectAlgorithm}
           />
       }
       controls={
           <Controls 
              playbackState={activeState}
              speed={activeSpeed}
              onSpeedChange={activeSetSpeed}
              onStart={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              disabled={!activeAlg}
              size={optionalSize}
              maxSize={optionalMaxSize}
              onSizeChange={optionalSetSize}
              onShuffle={optionalShuffle}
           />
       }
       visualizer={renderVisualizer()}
       sidebar={<Sidebar algorithm={activeAlg} />}
    />
  );
}

// Wrapper to provide Context
export default function App() {
  return (
    <AppContent />
  );
}
