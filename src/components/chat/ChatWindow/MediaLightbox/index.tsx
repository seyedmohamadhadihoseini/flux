"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FiX, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';
import styles from './styles.module.css';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
}

interface MediaLightboxProps {
  mediaList: MediaItem[];
  initialId: string;
  onClose: () => void;
}

export default function MediaLightbox({ mediaList, initialId, onClose }: MediaLightboxProps) {
  const t = useTranslations('chat.lightbox');
  // پیدا کردن ایندکس عکس کلیک شده
  const startIndex = mediaList.findIndex(m => m.id === initialId);
  const [currentIndex, setCurrentIndex] = useState(startIndex !== -1 ? startIndex : 0);

  const currentMedia = mediaList[currentIndex];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  // کنترل با کیبورد
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!currentMedia) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.header} onClick={e => e.stopPropagation()}>
        <span className={styles.counter}>
          {currentIndex + 1} {t('of')} {mediaList.length}
        </span>
        <div className={styles.actions}>
          <a href={currentMedia.url} download className={styles.iconBtn}>
            <FiDownload size={24} />
          </a>
          <button onClick={onClose} className={styles.iconBtn}>
            <FiX size={24} />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {mediaList.length > 1 && (
          <button className={`${styles.navBtn} ${styles.prev}`} onClick={handlePrev}>
            <FiChevronRight size={30} />
          </button>
        )}

        <div className={styles.mediaWrapper} onClick={e => e.stopPropagation()}>
          {currentMedia.type === 'image' ? (
            <Image 
              src={currentMedia.url} 
              alt="Full size" 
              fill 
              className={styles.image} 
              sizes="100vw"
            />
          ) : (
            <video src={currentMedia.url} controls autoPlay className={styles.video} />
          )}
          {currentMedia.caption && (
            <div className={styles.caption}>{currentMedia.caption}</div>
          )}
        </div>

        {mediaList.length > 1 && (
          <button className={`${styles.navBtn} ${styles.next}`} onClick={handleNext}>
            <FiChevronLeft size={30} />
          </button>
        )}
      </div>
    </div>
  );
}