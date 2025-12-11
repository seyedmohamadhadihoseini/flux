"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

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

  // --- فیکس کردن جهت (Direction) ---
  useEffect(() => {
    // این خط باعث می‌شود کل ساختار صفحه جهت‌ش عوض شود
    document.documentElement.dir = currentLang.dir;
    document.documentElement.lang = currentLang.code;
  }, [currentLang]);
  // --------------------------------

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
    const newPath = pathname.replace(`/${locale}`, `/${code}`);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={containerRef}>
      
      {/* دکمه اصلی (جمع و جور و سایز فیکس) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200
          ${isOpen 
            ? "bg-white/10 border-white/20 text-white" 
            : "bg-transparent border-transparent text-gray-300 hover:bg-white/5 hover:text-white"}
        `}
      >
        {/* سایز آیکون را اینجا قفل کردم که گنده نشود */}
        <img 
          src={currentLang.flag} 
          alt={currentLang.name} 
          style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }}
        />
        <span className="text-sm font-medium">{currentLang.name}</span>
        
        {/* فلش خیلی کوچک */}
        <svg 
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* لیست بازشو */}
      {isOpen && (
        <div 
          className={`
            absolute top-full mt-2 w-40 p-1
            bg-[#111] border border-[#333] 
            rounded-lg shadow-xl
            flex flex-col
            ${currentLang.dir === 'rtl' ? 'left-0' : 'right-0'}
          `}
        >
          {languages.map((lang) => {
            const isActive = locale === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleChange(lang.code)}
                className={`
                  flex items-center gap-3 px-3 py-2 w-full rounded-md transition-all text-xs
                  ${isActive 
                    ? "bg-[#222] text-white font-bold" 
                    : "text-gray-400 hover:bg-[#222] hover:text-gray-200"}
                `}
              >
                <img 
                  src={lang.flag} 
                  alt={lang.name} 
                  style={{ width: '18px', height: '13px', objectFit: 'cover', borderRadius: '2px' }}
                />
                <span className="flex-grow text-start">{lang.name}</span>
                
                {/* تیک فعال بودن */}
                {isActive && (
                   <span className="text-emerald-500">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}