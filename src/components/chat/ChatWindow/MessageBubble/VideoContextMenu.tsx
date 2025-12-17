"use client";

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FiDownload, FiMonitor, FiZap } from 'react-icons/fi';
import styles from './styles.module.css';

interface VideoContextMenuProps {
  x: number;
  y: number;
  // اصلاح مهم: اضافه کردن | null برای سازگاری با useRef
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onClose: () => void;
  onDubbingRequest: () => void;
}

export default function VideoContextMenu({ x, y, videoRef, onClose, onDubbingRequest }: VideoContextMenuProps) {
  const t = useTranslations('chat.actions.video_menu');
  const menuRef = useRef<HTMLDivElement>(null);

  // بستن منو با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // اکشن‌ها
  const handleDownload = () => {
    if (videoRef.current?.src) {
      const a = document.createElement('a');
      a.href = videoRef.current.src;
      a.download = 'video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    onClose();
  };

  const handleSpeed = () => {
    if (videoRef.current) {
      const current = videoRef.current.playbackRate;
      // سیکل سرعت: 1 -> 1.5 -> 2 -> 1
      const next = current === 1 ? 1.5 : current === 1.5 ? 2 : 1;
      videoRef.current.playbackRate = next;
    }
    onClose();
  };

  const handlePiP = async () => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (videoRef.current) {
      await videoRef.current.requestPictureInPicture();
    }
    onClose();
  };

  // محاسبه موقعیت برای اینکه منو از صفحه بیرون نزند (ساده‌سازی شده، می‌توان پیچیده‌تر کرد)
  const style = {
    top: y,
    left: x,
  };

  return (
    <div className={styles.contextMenu} style={style} ref={menuRef}>
      <button onClick={handleDownload}>
        <FiDownload /> {t('download')}
      </button>
      
      <button onClick={handleSpeed}>
        <FiZap /> {t('speed')} 
        <span className={styles.badge}>
            {videoRef.current?.playbackRate || 1}x
        </span>
      </button>

      <button onClick={handlePiP}>
        <FiMonitor /> {t('pip')}
      </button>

      {/* دکمه دوبله که درخواست داشتید */}
      <button onClick={() => { onDubbingRequest(); onClose(); }}>
         {/* آیکون مناسب برای دوبله یا ترجمه */}
         <span>🎙️</span> {t('dubbing')}
      </button>
    </div>
  );
}