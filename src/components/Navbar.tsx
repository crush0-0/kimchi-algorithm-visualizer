import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-preference");
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    } else {
      // Default to dark
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setTheme("light");
      localStorage.setItem("theme-preference", "light");
    } else {
      document.documentElement.classList.add("dark");
      setTheme("dark");
      localStorage.setItem("theme-preference", "dark");
    }
  };

  return (
    <nav className="h-14 border-b border-surface0/50 flex items-center justify-between px-6 bg-base">
      <div className="flex items-center gap-3">
        <img
          src="/vite.svg"
          alt="Kimchi Logo"
          className="h-8 w-8"
        />
        <h1 className="text-xl font-bold tracking-tight text-text">Kimchi</h1>
      </div>
      
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-surface0 transition-colors text-subtext0 hover:text-text"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  );
}
