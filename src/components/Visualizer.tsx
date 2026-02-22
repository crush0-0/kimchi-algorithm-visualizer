import type { VisualElement } from "../hooks/useVisualizerEngine";

interface VisualizerProps {
  array: VisualElement[];
}

export function Visualizer({ array }: VisualizerProps) {
  // Determine color based on element state mapping to Catppuccin palette
  const getColorClasses = (state: VisualElement["state"]) => {
    switch (state) {
      case "compare":
        return "bg-yellow border-yellow/50";
      case "swap":
        return "bg-red border-red/50";
      case "sorted":
        return "bg-green border-green/50";
      default:
        return "bg-mauve/70 border-mauve/20 group-hover:bg-mauve/90";
    }
  };

  return (
    <div className="w-full h-full flex items-end justify-center gap-[2px] p-4 bg-crust rounded-2xl border border-surface0 overflow-hidden">
      {array.map((element, idx) => {
        const heightPercent = element.value;
        
        return (
          <div
            key={idx}
            className={`w-full relative rounded-sm transition-all duration-75 ease-in-out border ${getColorClasses(element.state)}`}
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
