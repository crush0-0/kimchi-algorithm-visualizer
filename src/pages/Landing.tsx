import { Sparkles } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Soft floating icon */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-mauve/10 border border-mauve/20 flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-mauve" />
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-text">
          Kimchi
        </h1>
        
        <p className="text-xl md:text-2xl text-subtext0 font-medium">
          A cozy way to understand algorithms.
        </p>

        <p className="text-subtext1 max-w-lg mx-auto leading-relaxed">
          Interactive, friendly, and visually clear. Learn sorting algorithms without feeling overwhelmed.
        </p>

        <div className="pt-8">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-base bg-mauve text-crust rounded-2xl hover:bg-mauve/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-mauve/20"
          >
            Start Visualizing
            <span className="block group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
