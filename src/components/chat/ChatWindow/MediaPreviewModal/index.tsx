"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FiX, FiSend, FiFile } from 'react-icons/fi';
import styles from './styles.module.css';

interface MediaPreviewProps {
  file: File;
  onSend: (file: File, caption: string) => void;
  onCancel: () => void;
}

export default function MediaPreviewModal({ file, onSend, onCancel }: MediaPreviewProps) {
  const t = useTranslations('chat.preview');
  const [caption, setCaption] = useState("");
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  const previewUrl = URL.createObjectURL(file);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{t('title')}</h3>
          <button onClick={onCancel}><FiX size={24} /></button>
        </div>

        <div className={styles.previewArea}>
          {isImage ? (
            <div className={styles.imageWrapper}>
                <Image src={previewUrl} alt="Preview" fill className={styles.image} />
            </div>
          ) : isVideo ? (
            <video src={previewUrl} controls className={styles.video} />
          ) : (
            <div className={styles.filePlaceholder}>
              <FiFile size={48} />
              <span>{file.name}</span>
              <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <input 
            type="text" 
            placeholder={t('caption_placeholder')} 
            className={styles.captionInput}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            autoFocus
          />
          <button className={styles.sendBtn} onClick={() => onSend(file, caption)}>
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}