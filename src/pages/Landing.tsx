import { ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center font-sans text-text transition-colors duration-300 relative overflow-hidden">
      
      {/* Theme Toggle Navbar (Minimal) */}
      <nav className="absolute top-0 w-full p-6 flex justify-end">
         <button 
           onClick={toggleTheme}
           className="p-2 rounded-full hover:bg-surface0 transition-colors text-subtext0 hover:text-text cursor-pointer"
           aria-label="Toggle Theme"
         >
           {theme === "dark" ? "🌙" : "☀️"}
         </button>
      </nav>

      {/* Main Hero Content */}
      <div className="max-w-md w-full px-6 flex flex-col items-center text-center z-10">
        
        {/* App Logo / Icon */}
        <div className="w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-mauve to-pink flex items-center justify-center shadow-lg shadow-mauve/20 transform hover:scale-105 transition-transform">
          <Sparkles className="text-crust w-10 h-10" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-text">
          Kimchi
        </h1>
        <p className="text-xl font-medium text-subtext1 mb-6">
          A cozy way to understand algorithms.
        </p>
        
        {/* Description */}
        <p className="text-base text-subtext0 mb-10 leading-relaxed max-w-sm">
          Dive into interactive visual learning. Explore sorting, searching, graph traversals, and recursion in a calm, distraction-free environment.
        </p>

        {/* Start Button */}
        <button 
          onClick={() => {
             window.history.pushState({}, '', '/app');
             const navEvent = new PopStateEvent('popstate');
             window.dispatchEvent(navEvent);
          }}
          className="group relative flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-mauve text-crust rounded-xl font-bold text-lg shadow-md hover:shadow-lg hover:bg-pink transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
          <span>Start Visualizing</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </div>
  );
}
