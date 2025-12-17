"use client";

import { useTranslations } from 'next-intl';
import { FiChevronRight, FiCheck } from 'react-icons/fi';
import styles from '../styles.module.css'; // استفاده از استایل مشترک

interface PageProps {
  onBack: () => void;
}

export default function LanguagePage({ onBack }: PageProps) {
  const t = useTranslations('chat.settings');
  const currentLang = 'fa'; // این باید از هوک useLocale یا کوکی خوانده شود

  const languages = [
    { code: 'fa', label: 'فارسی', native: 'Persian' },
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ar', label: 'العربية', native: 'Arabic' },
  ];

  return (
    <div className={styles.container}>
      {/* هدر با دکمه بازگشت */}
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backBtn}>
          <FiChevronRight className={styles.backIcon} />
        </button>
        <span className={styles.title}>{t('language')}</span>
      </div>

      <div className={styles.menuList}>
        {languages.map((lang) => (
          <button 
            key={lang.code} 
            className={`${styles.optionItem} ${currentLang === lang.code ? styles.activeOption : ''}`}
            onClick={() => console.log(`Switch to ${lang.code}`)}
          >
            <div style={{display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start'}}>
                <span>{lang.label}</span>
                <span style={{fontSize: '0.75rem', opacity: 0.7}}>{lang.native}</span>
            </div>
            {currentLang === lang.code && <FiCheck size={18} />}
          </button>
        ))}
      </div>
    </div>
  );
}