import { useState, useEffect } from "react";
import App from "./pages/App";
import { Landing } from "./pages/Landing";
import { ThemeProvider } from "./contexts/ThemeContext";

export function Root() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  return (
    <ThemeProvider>
      {currentPath === "/app" ? <App /> : <Landing />}
    </ThemeProvider>
  );
}
