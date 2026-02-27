import type { ReactNode } from "react";

interface MainLayoutProps {
  header: ReactNode;
  leftSidebar: ReactNode;
  controls: ReactNode;
  visualizer: ReactNode;
  sidebar: ReactNode;
}

export function MainLayout({ header, leftSidebar, controls, visualizer, sidebar }: MainLayoutProps) {
  return (
    <div className="h-screen max-h-screen bg-mantle text-text flex flex-col font-sans overflow-hidden">
      {/* Header Area */}
      <header className="px-6 py-4 lg:py-6 border-b border-surface0 bg-crust shrink-0">
         <div className="max-w-7xl mx-auto w-full">
            {header}
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
          
          {/* Left Navigation Spacer */}
          <div className="hidden lg:block w-16 shrink-0 h-full z-10" />

          {/* Left Navigation Sidebar Overlay */}
          <aside className="hidden lg:flex flex-col shrink-0 h-full z-30 absolute left-0 top-0 bottom-0">
             {leftSidebar}
          </aside>
          
          {/* Main Center Work Area */}
          <section className="flex-1 flex flex-col min-w-0 bg-base p-4 lg:p-6 overflow-hidden">
              
              {/* Visualizer Canvas */}
              <div className="flex-1 min-h-0 w-full max-w-5xl mx-auto bg-crust/30 rounded-2xl relative shadow-md overflow-hidden flex flex-col">
                 <div className="flex-1 relative w-full h-full">
                    {visualizer}
                 </div>
              </div>

              {/* Controls Overlay */}
              <div className="w-full flex justify-center mt-4 shrink-0">
                  <div className="max-w-5xl w-full">
                     {controls}
                  </div>
              </div>
          </section>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-96 shrink-0 h-[50vh] lg:h-full border-t lg:border-t-0 border-l-0 lg:border-l border-surface1 bg-crust shadow-2xl z-20 overflow-y-auto custom-scrollbar">
             {sidebar}
          </aside>
          
      </main>
    </div>
  );
}
