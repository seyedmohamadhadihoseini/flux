"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './styles.module.css';

// --- کامپوننت ۱: امنیت ---
function SecuritySection() {
  const t = useTranslations('home.security');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.securityWrapper}>
          <div className={styles.securityVisual}>
            <svg className={styles.shieldIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          
          <div className={styles.securityText}>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.subtitle} style={{textAlign: 'inherit', margin: '0 0 20px 0'}}>
              {t('subtitle')}
            </p>
            <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                 <span style={{color: 'var(--primary)'}}>✓</span> {t('list.no_tracking')}
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                 <span style={{color: 'var(--primary)'}}>✓</span> {t('list.two_factor')}
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                 <span style={{color: 'var(--primary)'}}>✓</span> {t('list.decentralized')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- کامپوننت ۲: نظرات کاربران ---
function TestimonialsSection() {
  const t = useTranslations('home.testimonials');

  const reviews = [
    { name: t('reviews.r1.name'), role: t('reviews.r1.role'), text: t('reviews.r1.text') },
    { name: t('reviews.r2.name'), role: t('reviews.r2.role'), text: t('reviews.r2.text') },
    { name: t('reviews.r3.name'), role: t('reviews.r3.role'), text: t('reviews.r3.text') },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.subtitle}>{t('subtitle')}</p>
        
        <div className={styles.grid}>
          {reviews.map((review, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>{review.name[0]}</div>
                <div>
                  <h4 style={{fontWeight: 'bold', color: 'var(--foreground)'}}>{review.name}</h4>
                  <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{review.role}</span>
                </div>
              </div>
              <p className={styles.quote}>"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- کامپوننت ۳: سوالات متداول ---
function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const t = useTranslations('home.faq');

  const faqs = [
    { q: t('items.q1.q'), a: t('items.q1.a') },
    { q: t('items.q2.q'), a: t('items.q2.a') },
    { q: t('items.q3.q'), a: t('items.q3.a') },
    { q: t('items.q4.q'), a: t('items.q4.a') },
  ];

  const toggle = (i: number) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('title')}</h2>
        <div className={styles.accordion}>
          {faqs.map((item, i) => (
            <div key={i} className={styles.faqItem}>
              <button 
                className={styles.faqButton} 
                onClick={() => toggle(i)}
              >
                {item.q}
                <span style={{transform: activeIndex === i ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s'}}>
                  ▼
                </span>
              </button>
              <div className={`${styles.faqAnswer} ${activeIndex === i ? styles.open : ''}`}>
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- کامپوننت ۴: دانلود (CTA) ---
function DownloadSection() {
  const t = useTranslations('home.download');

  return (
    <section className={`${styles.section} ${styles.ctaSection}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.subtitle}>
          {t('subtitle')}
        </p>
        
        <div className={styles.buttonsWrapper}>
          <a href="#" className={styles.downloadBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 9.49l1.83-3.17c.18-.32.07-.72-.25-.91-.32-.19-.72-.08-.91.24l-1.85 3.2C14.9 8.27 13.5 8 12 8c-1.5 0-2.9.27-4.42.85L5.73 5.65c-.19-.32-.59-.43-.91-.24-.32.19-.43.59-.24.91l1.83 3.17C3.66 11.08 2 14.15 2 17.65h20c0-3.5-1.66-6.57-4.4-8.16zM8 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
            {t('btn_android')}
          </a>
          <a href="#" className={styles.downloadBtn}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.74-3.03 1.75-.67.91-1.24 2.19-1.08 3.11 1.17.09 2.33-.59 3.04-1.75"/></svg>
            {t('btn_ios')}
          </a>
          <a href="#" className={`${styles.downloadBtn} ${styles.outline}`}>
            {t('btn_web')}
          </a>
        </div>
      </div>
    </section>
  );
}

// --- اکسپورت نهایی ---
export default function LandingSections() {
  return (
    <>
      <SecuritySection />
      <TestimonialsSection />
      <FAQSection />
      <DownloadSection />
    </>
  );
}