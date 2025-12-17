"use client";

import { useTranslations } from 'next-intl';
import { FiMicOff, FiRefreshCw, FiX } from 'react-icons/fi';
import styles from './styles.module.css';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export default function PermissionModal({ isOpen, onClose, onRetry }: PermissionModalProps) {
  // استفاده از کلیدهایی که با اسکریپت بالا ساختیم
  const t = useTranslations('chat.permissions');

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeBtn}>
          <FiX />
        </button>
        
        <div className={styles.iconWrapper}>
          <FiMicOff className={styles.icon} />
        </div>
        
        <h3 className={styles.title}>{t('title')}</h3>
        
        <p className={styles.description}>
           {t('description')}
        </p>
        
        <div className={styles.actions}>
          <button onClick={onRetry} className={styles.primaryBtn}>
            <FiRefreshCw className={styles.btnIcon} />
            {t('retry_btn')}
          </button>
          
          <button onClick={onClose} className={styles.secondaryBtn}>
            {t('cancel_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}