'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export default function Header() {
  const t = useTranslations('nav');
  const [isScrolled, setIsScrolled] = useState(false);

  // افکت برای تغییر استایل هدر هنگام اسکرول
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* لوگو */}
        <Link href="/" className={styles.logo}>
          .Aura
        </Link>

        {/* منوی اصلی - وسط چین */}
        <nav className={styles.nav}>
          <Link href="/security" className={styles.navLink}>{t('security')}</Link>
          <Link href="/features" className={styles.navLink}>{t('features')}</Link>
          <Link href="/download" className={styles.navLink}>{t('download')}</Link>
        </nav>

        {/* بخش اکشن‌ها - دکمه ورود و تغییر زبان */}
        <div className={styles.actions}>
          <LanguageSwitcher />
          
          <Link href="/login" className={styles.loginBtn}>
            {t('login')}
          </Link>
        </div>
      </div>
    </header>
  );
}