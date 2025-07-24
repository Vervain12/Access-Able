import { useEffect, useState } from "react";
import { Switch } from "@mui/material";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-row p-5 border-b-2 border-gray-300 justify-between ml-4.5 mr-5 dark:bg-[var(--card)]">
      <div>
        <h1 className="text-lg">Dark Mode</h1>
        <p className="text-sm text-gray-700 dark:text-gray-400">
          Toggle between light and dark themes
        </p>
      </div>

      <div className="flex items-center">
        <Switch 
        onChange={toggleTheme}
        checked={darkMode} />
      </div>
    </div>
  );
}
