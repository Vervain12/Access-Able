"use client";

import { useLayoutEffect, useState } from "react";

export default function ThemeHydrationWrapper({ children }) {
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return <>{children}</>;
}
