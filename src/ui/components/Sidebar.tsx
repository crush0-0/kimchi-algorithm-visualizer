import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { Algorithm } from "../../types/algorithm";
import { FileText, Info } from "lucide-react";

interface SidebarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  algorithm: Algorithm<any, any> | null;
}

type TabType = "pseudocode" | "explanation";

export function Sidebar({ algorithm }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("pseudocode");

  if (!algorithm) {
    return (
      <div className="h-full w-full lg:w-96 bg-surface0 border-l border-surface1 flex items-center justify-center p-6 text-center text-subtext0">
        <div>
          <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select an algorithm to see how it works</p>
        </div>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "pseudocode", label: "Pseudocode", icon: <FileText size={16} /> },
    { id: "explanation", label: "Explanation", icon: <Info size={16} /> },
  ];

  return (
    <div className="h-full flex flex-col w-full lg:w-96 bg-surface0 border-l border-surface1 z-10 lg:z-auto border-t lg:border-t-0">
      
      {/* Title & Meta Info */}
      <div className="p-4 border-b border-surface1">
        <h2 className="text-xl font-bold text-text mb-1">{algorithm.name}</h2>
        <p className="text-sm text-subtext1 mb-3 line-clamp-2">{algorithm.description}</p>
        <div className="flex gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-crust px-2 py-1 rounded text-teal">
            <span className="text-subtext0">Time:</span> {algorithm.complexity.time}
          </div>
          <div className="flex items-center gap-1.5 bg-crust px-2 py-1 rounded text-mauve">
            <span className="text-subtext0">Space:</span> {algorithm.complexity.space}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface1 overflow-x-auto overflow-y-hidden custom-scrollbar shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={
              "flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap " +
              (activeTab === tab.id
                ? "border-mauve text-mauve bg-surface1/50"
                : "border-transparent text-subtext0 hover:text-text hover:bg-surface1/30")
            }
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "pseudocode" && (
          <pre className="text-sm font-mono text-text leading-relaxed whitespace-pre-wrap">
            {algorithm.pseudocode.join('\\n')}
          </pre>
        )}
        
        {activeTab === "explanation" && (
          <div className="prose prose-invert max-w-none">
            <div className="text-subtext1 leading-relaxed whitespace-pre-wrap text-sm mb-6">
              {algorithm.explanation.join('\\n')}
            </div>
            
            {(algorithm.resources?.length ?? 0) > 0 && (
              <>
                <h3 className="text-text font-bold text-sm uppercase tracking-wider mb-3">
                  Resources
                </h3>
                <ul className="space-y-2">
                  {algorithm.resources.map((res: {url: string; label: string}, i: number) => (
                    <li key={i}>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sapphire hover:text-mauve transition-colors text-sm flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sapphire group-hover:bg-mauve transition-colors" />
                        {res.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
