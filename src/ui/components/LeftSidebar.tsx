import { ChevronDown, ListFilter, Search, GitGraph, RefreshCw, LayoutGrid } from "lucide-react";
import type { AlgorithmCategory, Algorithm } from "../../types/algorithm";
import { useState } from "react";

interface LeftSidebarProps {
  algorithms: Algorithm<any, any>[];
  activeCategory: AlgorithmCategory | "all";
  onSelectCategory: (category: AlgorithmCategory | "all") => void;
  activeAlgorithm: Algorithm<any, any> | null;
  onSelectAlgorithm: (alg: Algorithm<any, any>) => void;
}

export function LeftSidebar({
  algorithms,
  activeCategory,
  onSelectCategory,
  activeAlgorithm,
  onSelectAlgorithm
}: LeftSidebarProps) {
  
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    [activeCategory === "all" ? algorithms[0]?.category : activeCategory]: true
  });
  const [isHovered, setIsHovered] = useState(false);

  const categories: { id: AlgorithmCategory; label: string; icon: React.ReactNode }[] = [
    { id: "sorting", label: "Sorting", icon: <ListFilter size={18} /> },
    { id: "searching", label: "Searching", icon: <Search size={18} /> },
    { id: "graph", label: "Graph", icon: <GitGraph size={18} /> },
    { id: "recursion", label: "Recursion", icon: <RefreshCw size={18} /> }
  ];

  const toggleCategory = (categoryId: AlgorithmCategory) => {
    setExpandedCategories(prev => ({
      [categoryId]: !prev[categoryId]
    }));
    onSelectCategory(categoryId);
  };

  return (
    <div 
      className={`h-full flex flex-col bg-surface0 border-r border-surface1 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-300 ease-in-out ${
         isHovered ? "w-64 shadow-2xl" : "w-16 shadow-none"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <div className={`p-4 border-b border-surface1 mt-2 flex items-center ${isHovered ? "justify-start" : "justify-center"}`}>
         {isHovered ? (
             <h2 className="text-sm font-bold text-subtext0 uppercase tracking-wider mb-2 whitespace-nowrap">Categories</h2>
         ) : (
             <LayoutGrid className="text-subtext0 mb-2" size={20} />
         )}
      </div>

      <div className="flex-1 py-4 flex flex-col gap-2">
        {categories.map(cat => {
            const isExpanded = expandedCategories[cat.id];
            const catAlgorithms = algorithms.filter(a => a.category === cat.id);
            
            return (
                <div key={cat.id} className="flex flex-col">
                    {/* Category Header */}
                    <button
                        onClick={() => {
                            if (!isHovered) setIsHovered(true); // Auto-expand if clicked while collapsed
                            toggleCategory(cat.id);
                        }}
                        className={`flex items-center justify-between py-3 mx-2 rounded-xl text-sm font-semibold transition-all ${
                            isExpanded || activeCategory === cat.id
                            ? "bg-surface1 text-text shadow-sm"
                            : "text-subtext0 hover:bg-surface1/50 hover:text-text cursor-pointer"
                        } ${isHovered ? "px-4" : "px-0 justify-center"}`}
                        title={cat.label}
                    >
                        <div className={`flex items-center ${isHovered ? "gap-3" : "justify-center w-full"}`}>
                            <div className={isExpanded && isHovered ? "text-mauve" : "text-subtext0"}>{cat.icon}</div>
                            {isHovered && <span className="whitespace-nowrap">{cat.label}</span>}
                        </div>
                        {isHovered && (
                            <ChevronDown 
                                size={16} 
                                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} 
                            />
                        )}
                    </button>

                    {/* Algorithms List */}
                    {isExpanded && isHovered && (
                        <div className="flex flex-col mt-1 mb-2 px-2">
                            {catAlgorithms.map(alg => {
                                const isActive = activeAlgorithm?.id === alg.id;
                                return (
                                    <button
                                        key={alg.id}
                                        onClick={() => onSelectAlgorithm(alg)}
                                        className={`ml-10 px-4 py-2 text-sm text-left rounded-lg transition-colors whitespace-nowrap ${
                                            isActive
                                            ? "bg-mauve/10 text-mauve font-medium border-l-2 border-mauve shadow-sm"
                                            : "text-subtext1 hover:bg-surface1/40 hover:text-text border-l-2 border-transparent"
                                        }`}
                                    >
                                        {alg.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        })}
      </div>

    </div>
  );
}
