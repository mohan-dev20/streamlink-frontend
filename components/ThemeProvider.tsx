"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext({
  theme: "dark",
  changeTheme: (theme: "light" | "dark") => {},
  enableAutoTheme: () => {},
  isAuto: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("dark");
  const [isAuto, setIsAuto] = useState(true);
  useEffect(() => {
    const hour = new Date().getHours();
    const state = localStorage.getItem("state") || "";
    const southStates = [
      "Karnataka",
      "Tamil Nadu",
      "Kerala",
      "Andhra Pradesh",
      "Telangana",
    ];

    const savedTheme = localStorage.getItem("theme");
    const auto = localStorage.getItem("autoTheme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (auto === "false") {
      setIsAuto(false);
      return;
    }
    if (hour >= 10 && hour < 12 && southStates.includes(state)) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, []);
  const changeTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    localStorage.setItem("autoTheme", "false");
    setIsAuto(false);
  };
  const enableAutoTheme = () => {
    localStorage.setItem("autoTheme", "true");

    setIsAuto(true);

    window.location.reload();
  };
  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
        enableAutoTheme,
        isAuto,
      }}
    >
      <div className={`${theme} min-h-screen`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);
