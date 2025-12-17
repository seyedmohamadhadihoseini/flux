"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 1. ایمپورت پورتال
import { useTranslations } from 'next-intl';
import { FiX, FiUser, FiPhone } from 'react-icons/fi';
import styles from './styles.module.css';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; phone: string }) => void;
  initialData?: { name: string; phone?: string } | null;
}

export default function AddContactModal({ isOpen, onClose, onSave, initialData }: AddContactModalProps) {
  const t = useTranslations('chat.contacts');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // 2. استیت برای اطمینان از اینکه کامپوننت در کلاینت مانت شده
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      setPhone(initialData.phone || '');
    } else if (isOpen) {
      setName('');
      setPhone('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name, phone });
    }
  };

  // اگر بسته است یا هنوز در کلاینت لود نشده، چیزی برنگردان
  if (!isOpen || !mounted) return null;

  // 3. استفاده از createPortal برای رندر کردن مودال مستقیم داخل body
  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{initialData ? t('edit_contact') : t('new_contact')}</h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.inputGroup}>
            <label>{t('name_label')}</label>
            <div className={styles.inputWrapper}>
              <FiUser className={styles.inputIcon} />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className={styles.modalInput}
                autoFocus
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>{t('phone_label')}</label>
            <div className={styles.inputWrapper}>
              <FiPhone className={styles.inputIcon} />
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className={styles.modalInput}
                dir="ltr"
              />
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              {t('cancel')}
            </button>
            <button type="submit" className={styles.saveBtn}>
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body // مقصد رندر: تگ بادی اصلی صفحه
  );
}