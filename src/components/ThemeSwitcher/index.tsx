// src/components/ThemeSwitcher/index.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi"; // نصب react-icons
import styles from "./styles.module.css";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // جلوگیری از خطای Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={styles.placeholder} />; // یک فضای خالی هم‌اندازه دکمه
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={styles.switcherButton}
      aria-label="Toggle Theme"
    >
      <div className={`${styles.iconContainer} ${theme === 'dark' ? styles.dark : ''}`}>
        <FiSun className={styles.sunIcon} />
        <FiMoon className={styles.moonIcon} />
      </div>
    </button>
  );
};

export default ThemeSwitcher;