import type { VisualHanoiState } from "../engines/useHanoiEngine";

interface HanoiVisualizerProps {
  state: VisualHanoiState;
  totalDisks: number;
}

export function HanoiVisualizer({ state, totalDisks }: HanoiVisualizerProps) {
  
  // Calculate width percentage based on disk value relative to total
  const getDiskWidth = (diskValue: number) => {
     // Min width 20%, Max width 90%
     const min = 20;
     const max = 90;
     const percentage = (diskValue / Math.max(1, totalDisks)) * (max - min) + min;
     return `${percentage}%`;
  };

  // Assign distinct Catppuccin colors based on disk size modulo
  const getDiskColor = (diskValue: number) => {
     const colors = [
         "bg-red", "bg-peach", "bg-yellow", "bg-green", 
         "bg-teal", "bg-sapphire", "bg-lavender", "bg-mauve"
     ];
     return colors[(diskValue - 1) % colors.length];
  };

  return (
    <div className="w-full h-full flex items-end justify-center p-8 pb-12 bg-crust rounded-2xl border border-surface0 overflow-hidden relative">
      
      {/* 3 Rods Container */}
      <div className="w-full h-full max-w-4xl mx-auto flex items-end justify-around relative">
         
         {/* Base Platform */}
         <div className="absolute bottom-0 left-0 right-0 h-4 bg-surface2 rounded-full shadow-lg z-10" />

         {state.rods.map((rodDisks: number[], rodIdx: number) => (
             <div key={`rod-${rodIdx}`} className="relative w-1/4 h-[80%] flex flex-col justify-end items-center pb-4 z-20">
                 
                 {/* The Rod itself */}
                 <div className="absolute bottom-0 w-3 h-full bg-surface1 rounded-t-full -z-10 shadow-inner" />
                 
                 {/* Disks stacked bottom up */}
                 <div className="flex flex-col-reverse items-center justify-start w-full gap-1">
                     {rodDisks.map((disk: number) => (
                         <div
                            key={`disk-${disk}`}
                            className={`h-6 md:h-8 rounded-full shadow-md border border-crust/20 flex items-center justify-center transition-all duration-300 ease-in-out ${getDiskColor(disk)}`}
                            style={{ width: getDiskWidth(disk) }}
                         >
                            <span className="text-crust font-bold text-xs pointer-events-none drop-shadow-sm">
                                {disk}
                            </span>
                         </div>
                     ))}
                 </div>
                 
                 {/* Rod Label */}
                 <div className="absolute -bottom-6 text-subtext0 font-mono text-xs font-bold pointer-events-none uppercase tracking-widest">
                    {["Source", "Auxiliary", "Target"][rodIdx]}
                 </div>
             </div>
         ))}

      </div>

      {/* Render Optional Call Stack as floating HUD element if active */}
      {state.callStack.length > 0 && (
         <div className="absolute top-4 right-4 bg-mantle/90 border border-surface1 p-3 rounded-xl shadow-xl backdrop-blur-md max-w-[250px] pointer-events-none z-50">
             <div className="text-xs font-bold text-subtext0 uppercase tracking-wider mb-2 border-b border-surface0 pb-1">
                 Call Stack
             </div>
             <div className="flex flex-col gap-1 max-h-[150px] overflow-hidden">
                 {state.callStack.slice(0, 5).map((frame: string, idx: number) => (
                     <div 
                        key={idx} 
                        className={`text-xs font-mono px-2 py-1 rounded ${idx === 0 ? "bg-mauve/20 text-mauve font-bold" : "text-subtext1 opacity-50"}`}
                     >
                         {frame}
                     </div>
                 ))}
                 {state.callStack.length > 5 && (
                     <div className="text-xs text-subtext0 text-center italic mt-1 pr-2">
                         ... {state.callStack.length - 5} more frames
                     </div>
                 )}
             </div>
         </div>
      )}

    </div>
  );
}
