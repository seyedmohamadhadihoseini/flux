'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation'; // Link برای نویگیشن‌های عادی
import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
// 1. ایمپورت کردن مودال
import AuthModal from '@/components/AuthModal';


// ... ایمپورت‌های قبلی
import { useSession, signOut } from "next-auth/react"; // ایمپورت‌های جدید
import Image from 'next/image';

export default function Header() {
    const t = useTranslations('nav');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // دریافت اطلاعات کاربر
    const { data: session, status } = useSession();

    // ... useEffect اسکرول (مثل قبل)

    return (
        <>
            <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
                <div className={styles.container}>
                    <Link href="/" className={styles.logo}>Aura</Link>

                    <nav className={styles.nav}>
                        <Link href="/security" className={styles.navLink}>{t('security')}</Link>
                        <Link href="/features" className={styles.navLink}>{t('features')}</Link>
                        <Link href="/download" className={styles.navLink}>{t('download')}</Link>
                    </nav>

                    <div className={styles.actions}>
                        <ThemeSwitcher />
                        <LanguageSwitcher />

                        {/* شرطی کردن دکمه لاگین */}
                        {status === "loading" ? (
                            // یک لودینگ ساده یا فضای خالی
                            <div className="w-24 h-10" />
                        ) : session ? (
                            // --- حالت لاگین شده ---
                            <div className="flex items-center gap-3">
                                {/* نمایش عکس پروفایل اگر وجود داشت */}
                                {session.user?.image && (
                                    <div className="relative w-9 h-9">
                                        <Image
                                            src={session.user.image}
                                            alt="User"
                                            fill // عکس را فیکس می‌کند داخل کانتینر پدر
                                            className="rounded-full border border-gray-500 object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                )}
                                <button
                                    onClick={() => signOut()}
                                    className={styles.loginBtn} // یا یک استایل متفاوت برای خروج
                                    style={{ backgroundColor: 'var(--card-bg)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
                                >
                                    خروج
                                </button>
                            </div>
                        ) : (
                            // --- حالت لاگین نشده ---
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className={styles.loginBtn}
                            >
                                {t('login')}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
        </>
    );
}