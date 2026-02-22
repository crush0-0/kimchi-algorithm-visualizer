import { useState } from "react";
import { Landing } from "./pages/Landing";
import { App } from "./pages/App";
import { Navbar } from "./components/Navbar";

export function Root() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen bg-base flex flex-col font-sans">
      {started && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
      )}
      
      {!started ? (
        <Landing onStart={() => setStarted(true)} />
      ) : (
        <App />
      )}
    </div>
  );
}
