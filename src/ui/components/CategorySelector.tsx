import type { AlgorithmCategory, Algorithm } from "../../types/algorithm";
import { ListFilter, Search, GitGraph, RefreshCw } from "lucide-react";

interface CategorySelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  algorithms: Algorithm<any, any>[];
  activeCategory: AlgorithmCategory | "all";
  onSelectCategory: (category: AlgorithmCategory | "all") => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeAlgorithm: Algorithm<any, any> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectAlgorithm: (alg: Algorithm<any, any>) => void;
}

export function CategorySelector({
  algorithms,
  activeCategory,
  onSelectCategory,
  activeAlgorithm,
  onSelectAlgorithm
}: CategorySelectorProps) {

  // Group algorithms
  const categories: { id: AlgorithmCategory | "all", label: string, icon: React.ReactNode }[] = [
      { id: "all", label: "All Algorithms", icon: <ListFilter size={16} /> },
      { id: "sorting", label: "Sorting", icon: <ListFilter size={16} /> },
      { id: "searching", label: "Searching", icon: <Search size={16} /> },
      { id: "graph", label: "Graph", icon: <GitGraph size={16} /> },
      { id: "recursion", label: "Recursion", icon: <RefreshCw size={16} /> }
  ];

  const filteredAlgorithms = algorithms.filter(
      a => activeCategory === "all" || a.category === activeCategory
  );

  return (
    <div className="flex flex-col gap-4 mb-6">
       {/* Category Tabs */}
       <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                  <button
                     key={cat.id}
                     onClick={() => onSelectCategory(cat.id)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                         isActive 
                         ? "bg-mauve text-crust shadow-md"
                         : "bg-surface0 text-subtext0 hover:bg-surface1 hover:text-text border border-surface1"
                     }`}
                  >
                      {cat.icon}
                      {cat.label}
                  </button>
              );
          })}
       </div>

       {/* Algorithm Pills */}
       <div className="flex gap-2 flex-wrap items-center">
            {filteredAlgorithms.map(alg => {
                const isActive = activeAlgorithm?.id === alg.id;
                return (
                    <button
                        key={alg.id}
                        onClick={() => onSelectAlgorithm(alg)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            isActive
                            ? "border-sapphire bg-sapphire/20 text-sapphire shadow-inner"
                            : "border-surface1 bg-crust text-subtext1 hover:border-surface2 hover:text-text"
                        }`}
                    >
                        {alg.name}
                    </button>
                )
            })}
       </div>
    </div>
  );
}
