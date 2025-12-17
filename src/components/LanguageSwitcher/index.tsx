// src/components/LanguageSwitcher/index.tsx
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";

const languages = [
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/us.svg', dir: 'ltr' },
  { code: 'fa', name: 'فارسی', flag: 'https://flagcdn.com/ir.svg', dir: 'rtl' },
  { code: 'ar', name: 'العربية', flag: 'https://flagcdn.com/sa.svg', dir: 'rtl' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  // --- تغییر جهت داکیومنت ---
  useEffect(() => {
    document.documentElement.dir = currentLang.dir;
    document.documentElement.lang = currentLang.code;
  }, [currentLang]);

  // بستن منو با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (code: string) => {
    // اگر مسیر فعلی شامل لوکیل نیست (صفحه اصلی)، یا جایگزینی ساده
    const newPath = pathname.replace(`/${locale}`, `/${code}`);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      
      {/* دکمه اصلی */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.triggerButton} ${isOpen ? styles.triggerButtonOpen : ''}`}
        aria-expanded={isOpen}
        aria-label="Change Language"
      >
        <img 
          src={currentLang.flag} 
          alt={currentLang.name} 
          className={styles.flagIcon}
        />
        <span className={styles.label}>{currentLang.name}</span>
        
        {/* فلش */}
        <svg 
          className={`${styles.chevron} ${isOpen ? styles.chevronRotate : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* لیست بازشو */}
      {isOpen && (
        <div 
          className={`${styles.dropdown} ${
            currentLang.dir === 'rtl' ? styles.alignLeft : styles.alignRight
          }`}
        >
          {languages.map((lang) => {
            const isActive = locale === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleChange(lang.code)}
                className={`${styles.itemButton} ${isActive ? styles.activeItem : ''}`}
              >
                <img 
                  src={lang.flag} 
                  alt={lang.name} 
                  className={styles.itemFlag}
                />
                <span className={styles.itemName}>{lang.name}</span>
                
                {/* تیک فعال بودن */}
                {isActive && (
                   <span className={styles.checkMark}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}