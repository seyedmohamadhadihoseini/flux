"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  FiChevronRight, FiMoon, FiSun, FiMonitor, FiCheck, FiType 
} from 'react-icons/fi';
import styles from '../styles.module.css'; // استایل مشترک هدر
import pageStyles from './AppearancePage.module.css'; // استایل اختصاصی این صفحه

interface PageProps {
  onBack: () => void;
}

const ACCENT_COLORS = [
  { id: 'purple', hex: '#7c3aed' }, // رنگ فعلی
  { id: 'blue', hex: '#2563eb' },
  { id: 'green', hex: '#16a34a' },
  { id: 'orange', hex: '#ea580c' },
  { id: 'pink', hex: '#db2777' },
];

const FONT_SIZES = [
  { id: 'small', label: 'A', scale: 0.85 },
  { id: 'normal', label: 'A', scale: 1 },
  { id: 'large', label: 'A', scale: 1.15 },
];

export default function AppearancePage({ onBack }: PageProps) {
  const t = useTranslations('chat.settings.appearance');
  
  // این استیت‌ها باید در واقعیت از Context یا LocalStorage خوانده شوند
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [activeColor, setActiveColor] = useState('purple');
  const [fontSize, setFontSize] = useState('normal');

  return (
    <div className={styles.container}>
      {/* هدر مشترک */}
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backBtn}>
          <FiChevronRight className={styles.backIcon} />
        </button>
        <span className={styles.title}>{t('title')}</span>
      </div>

      <div className={pageStyles.scrollContent}>
        
        {/* ۱. بخش پیش‌نمایش زنده (Live Preview) */}
        <div className={pageStyles.previewSection} data-theme={theme}>
          <div 
             className={pageStyles.mockBubble}
             style={{ 
               backgroundColor: ACCENT_COLORS.find(c => c.id === activeColor)?.hex,
               fontSize: `${FONT_SIZES.find(f => f.id === fontSize)?.scale}rem`
             }}
          >
            <span className={pageStyles.mockText}>
              {t('preview_msg')} 👋
            </span>
            <span className={pageStyles.mockTime}>10:30</span>
          </div>
        </div>

        {/* ۲. انتخاب تم */}
        <div className={pageStyles.section}>
          <h4 className={pageStyles.sectionTitle}>{t('theme_mode')}</h4>
          <div className={pageStyles.themeGrid}>
            <button 
              className={`${pageStyles.themeCard} ${theme === 'light' ? pageStyles.activeCard : ''}`}
              onClick={() => setTheme('light')}
            >
              <FiSun size={20} />
              <span>{t('light')}</span>
            </button>
            <button 
              className={`${pageStyles.themeCard} ${theme === 'dark' ? pageStyles.activeCard : ''}`}
              onClick={() => setTheme('dark')}
            >
              <FiMoon size={20} />
              <span>{t('dark')}</span>
            </button>
            <button 
              className={`${pageStyles.themeCard} ${theme === 'system' ? pageStyles.activeCard : ''}`}
              onClick={() => setTheme('system')}
            >
              <FiMonitor size={20} />
              <span>{t('system')}</span>
            </button>
          </div>
        </div>

        {/* ۳. انتخاب رنگ اصلی (Accent Color) */}
        <div className={pageStyles.section}>
          <h4 className={pageStyles.sectionTitle}>{t('accent_color')}</h4>
          <div className={pageStyles.colorsRow}>
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.id}
                className={`${pageStyles.colorBtn} ${activeColor === color.id ? pageStyles.activeColorBtn : ''}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setActiveColor(color.id)}
              >
                {activeColor === color.id && <FiCheck color="#fff" />}
              </button>
            ))}
          </div>
        </div>

        {/* ۴. اندازه متن */}
        <div className={pageStyles.section}>
          <h4 className={pageStyles.sectionTitle}>{t('font_size')}</h4>
          <div className={pageStyles.fontSizeWrapper}>
            <FiType size={14} className={pageStyles.fontIconSmall} />
            <div className={pageStyles.fontTrack}>
              {FONT_SIZES.map((size) => (
                <button
                  key={size.id}
                  className={`${pageStyles.fontDot} ${fontSize === size.id ? pageStyles.activeFontDot : ''}`}
                  onClick={() => setFontSize(size.id)}
                />
              ))}
              <div className={pageStyles.fontLine} />
            </div>
            <FiType size={22} className={pageStyles.fontIconLarge} />
          </div>
        </div>

        {/* ۵. پس‌زمینه چت (Wallpaper) */}
        <div className={pageStyles.section}>
          <h4 className={pageStyles.sectionTitle}>{t('chat_wallpaper')}</h4>
          <div className={pageStyles.wallpaperGrid}>
             {/* این‌ها فقط نمونه رنگ هستند، بعداً می‌توان عکس گذاشت */}
             <div className={pageStyles.wallpaperItem} style={{background: '#0f172a'}} />
             <div className={pageStyles.wallpaperItem} style={{background: '#334155'}} />
             <div className={pageStyles.wallpaperItem} style={{background: 'linear-gradient(45deg, #4f46e5, #9333ea)'}} />
             <button className={pageStyles.addWallpaperBtn}>+</button>
          </div>
        </div>

      </div>
    </div>
  );
}