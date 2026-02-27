import type { VisualElement } from "../engines/useArrayEngine";

interface ArrayVisualizerProps {
  array: VisualElement[];
  mode?: "bar" | "card";
}

export function ArrayVisualizer({ array, mode = "bar" }: ArrayVisualizerProps) {
  const getColorClasses = (state: VisualElement["state"]) => {
    switch (state) {
      case "compare":
        return "bg-yellow border-yellow/50";
      case "swap":
        return "bg-red border-red/50";
      case "sorted":
        return "bg-green border-green/50";
      case "visited":
        return "bg-surface2 border-surface2/50 opacity-50";
      case "highlight":
        return "bg-teal border-teal/50";
      default:
        return "bg-mauve/70 border-mauve/20 group-hover:bg-mauve/90";
    }
  };

  if (mode === "card") {
    // Card Layout specifically requested for Search Algorithms
    // We determine the overall state for a quick status indicator
    const isCompleted = array.some(el => el.state === "sorted");
    const isSearching = array.some(el => el.state === "compare" || el.state === "highlight");
    let statusText = "Ready";
    if (isCompleted) statusText = "Found!";
    else if (isSearching) statusText = "Searching...";
    else if (array.length > 0 && array.every(el => el.state === "visited" || el.state === "default")) statusText = "Not Found";

    return (
      <div className="w-full h-full flex flex-col p-6 bg-crust rounded-2xl border border-surface0 relative">
        {/* Status Indicator */}
        <div className="mb-8 flex justify-center w-full">
            <div className={`px-6 py-2 rounded-full font-bold shadow-md tracking-widest uppercase text-sm transition-colors ${
                isCompleted ? "bg-green text-crust" : 
                isSearching ? "bg-yellow text-crust animate-pulse" : 
                "bg-surface1 text-subtext0"
            }`}>
                {statusText}
            </div>
        </div>

        {/* Card Array */}
        <div className="flex-1 w-full flex flex-nowrap items-center justify-start gap-4 overflow-x-auto overflow-y-hidden custom-scrollbar p-6">
            {array.map((element, idx) => {
               const color = getColorClasses(element.state);
               const isTargetOrFound = element.state === "sorted" || element.state === "highlight" || element.state === "compare";
               
               return (
                   <div key={idx} className="flex flex-col items-center gap-2 m-1 shrink-0">
                       {/* Value Card */}
                       <div className={`
                          w-12 h-16 md:w-16 md:h-20 lg:w-20 lg:h-24 
                          flex items-center justify-center
                          rounded-xl shadow-lg border-2 transition-all duration-300 transform
                          ${color}
                          ${isTargetOrFound ? 'scale-110 shadow-xl opacity-100 z-10' : 'opacity-90'}
                          ${element.state === "visited" ? 'scale-95 opacity-40 shadow-none' : ''}
                       `}>
                           <span className={`font-bold text-lg md:text-xl lg:text-2xl drop-shadow-md cursor-default pointer-events-none ${
                               (element.state === "default" || element.state === "visited") ? 'text-text' : 'text-crust'
                           }`}>
                               {element.value}
                           </span>
                       </div>
                       
                       {/* Index Label */}
                       <div className="text-xs font-mono font-bold text-subtext0">
                          {idx}
                       </div>
                   </div>
               )
            })}
        </div>
      </div>
    );
  }

  // Default Bar Layout for Sorting
  return (
    <div className="w-full h-full flex items-end justify-center gap-[2px] p-4 bg-crust rounded-2xl border border-surface0 overflow-hidden relative">
      {array.map((element, idx) => {
        // Values are typically 1 to 100 representing percentage heights directly
        const heightPercent = element.value;
        const color = getColorClasses(element.state);
        
        return (
          <div
            key={idx}
            className={`w-full relative rounded-sm transition-all duration-75 ease-in-out border group ${color}`}
            style={{ height: `${heightPercent}%` }}
          >
            {/* Tooltip on hover for accessibility/inspection */}
             <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface1 text-text text-xs py-1 px-2 rounded pointer-events-none transition-opacity z-10 whitespace-nowrap shadow-lg">
                {element.value}
             </div>
          </div>
        );
      })}
    </div>
  );
}
