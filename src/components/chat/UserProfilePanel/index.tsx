"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FiX, FiBell, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProfileViewer from '../ProfileViewer'; // استفاده مجدد از ویوور عکس
import styles from './styles.module.css';

interface UserProfilePanelProps {
  user: { name: string; avatar: string; id: string; status: string; photos?: string[] };
  onClose: () => void;
}

export default function UserProfilePanel({ user, onClose }: UserProfilePanelProps) {
  const t = useTranslations('chat.profile_info');
  const [activeTab, setActiveTab] = useState<'media' | 'files' | 'groups'>('media');
  const [showGallery, setShowGallery] = useState(false);

  // عکس‌های پروفایل مخاطب (اگر دیتای واقعی نداریم، عکس فعلی را چند بار تکرار می‌کنیم برای تست)
  const userPhotos = user.photos || [user.avatar, user.avatar, user.avatar];

  // دیتای فیک مدیا
  const mockMedia = Array(9).fill("https://picsum.photos/200"); 

  return (
    <>
      <div className={styles.panel}>
        {/* هدر: در دسکتاپ تایتل و ضربدر، در موبایل دکمه بازگشت */}
        <div className={styles.header}>
          <div className={styles.desktopHeader}>
            <span className={styles.title}>{t('title')}</span>
            <button onClick={onClose} className={styles.closeBtn}><FiX size={24} /></button>
          </div>
          
          <div className={styles.mobileHeader}>
            <button onClick={onClose} className={styles.backBtn}>
              <FiArrowRight size={24} />
            </button>
            <span className={styles.title}>{t('title')}</span>
          </div>
        </div>

        <div className={styles.scrollContent}>
          {/* پروفایل اصلی */}
          <div className={styles.profileHeader}>
            <div 
              className={styles.avatarLarge} 
              onClick={() => setShowGallery(true)} // کلیک برای باز شدن گالری
            >
              <Image src={user.avatar} alt={user.name} fill className={styles.avatarImg} />
              
              {/* نشانگر چند عکسی بودن (مثل تلگرام) */}
              {userPhotos.length > 1 && (
                <div className={styles.photoCount}>
                  {userPhotos.length}
                </div>
              )}
            </div>
            
            <h2 className={styles.name}>{user.name}</h2>
            <span className={styles.status}>{user.status}</span>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <label>{t('username')}</label>
              <span>@{user.id}</span>
            </div>
            <div className={styles.infoItem}>
              <label>{t('bio')}</label>
              <span>Life is what happens when you're busy making other plans.</span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                  <label>{t('notifications')}</label>
                  <span>On</span>
              </div>
              <FiBell className={styles.iconMuted} />
            </div>
          </div>

          <div className={styles.divider} />

          {/* تب‌ها */}
          <div className={styles.tabs}>
            {['media', 'files', 'groups'].map((tab) => (
              <button 
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab as any)}
              >
                {t(`media_tabs.${tab}` as any)}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'media' && (
              <div className={styles.mediaGrid}>
                {mockMedia.map((src, i) => (
                  <div key={i} className={styles.mediaItem}>
                    <Image src={src} alt="media" fill className={styles.mediaImg} />
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'files' && <div className={styles.emptyState}>No files.</div>}
            {activeTab === 'groups' && <div className={styles.emptyState}>No groups.</div>}
          </div>
        </div>
      </div>

      {/* گالری تمام صفحه عکس‌های پروفایل */}
      {showGallery && (
        <ProfileViewer 
          initialImages={userPhotos} 
          onClose={() => setShowGallery(false)}
          readOnly={true} // پراپ جدید: فقط نمایش (بدون دکمه حذف/افزودن)
          onUpdate={() => {}} // خالی چون مخاطب را ویرایش نمی‌کنیم
        />
      )}
    </>
  );
}