"use client";

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FiX, FiTrash2, FiCheck, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './styles.module.css';

interface ProfileViewerProps {
    initialImages: string[];
    onClose: () => void;
    onUpdate: (newImages: string[]) => void;
    readOnly?: boolean;
}

export default function ProfileViewer({ initialImages, onClose, onUpdate, readOnly = false }: ProfileViewerProps) {
    const t = useTranslations('chat.profile');
    const [images, setImages] = useState<string[]>(initialImages);
    const [currentIndex, setCurrentIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // حذف عکس
    const handleDelete = () => {
        if (images.length <= 1) return; // حداقل یک عکس باید بماند
        if (!confirm(t('confirm_delete'))) return;

        const newImages = images.filter((_, idx) => idx !== currentIndex);
        setImages(newImages);
        setCurrentIndex(prev => (prev >= newImages.length ? newImages.length - 1 : prev));
        onUpdate(newImages);
    };

    // تنظیم به عنوان عکس اصلی (انتقال به ایندکس 0)
    const handleSetMain = () => {
        if (currentIndex === 0) return;
        const selectedImage = images[currentIndex];
        const otherImages = images.filter((_, idx) => idx !== currentIndex);
        const newImages = [selectedImage, ...otherImages];
        setImages(newImages);
        setCurrentIndex(0);
        onUpdate(newImages);
    };

    // افزودن عکس جدید (شبیه‌سازی)
    const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file); // نمایش موقت
            const newImages = [imageUrl, ...images];
            setImages(newImages);
            setCurrentIndex(0);
            onUpdate(newImages);
        }
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>

                {/* هدر مودال */}
                <div className={styles.header}>
                    <span className={styles.counter}>{currentIndex + 1} / {images.length}</span>
                    <button onClick={onClose} className={styles.closeBtn}><FiX size={24} /></button>
                </div>

                {/* نمایشگر اصلی */}
                <div className={styles.viewer}>
                    {images.length > 1 && (
                        <button onClick={prevImage} className={`${styles.navBtn} ${styles.prev}`}>
                            <FiChevronRight size={30} /> {/* در RTL چپ و راست برعکس است، آیکون را چک کنید */}
                        </button>
                    )}

                    <div className={styles.imageWrapper}>
                        <Image
                            src={images[currentIndex]}
                            alt="Profile"
                            fill
                            className={styles.mainImage}
                        />
                    </div>

                    {images.length > 1 && (
                        <button onClick={nextImage} className={`${styles.navBtn} ${styles.next}`}>
                            <FiChevronLeft size={30} />
                        </button>
                    )}
                </div>

                {!readOnly && (
                    <div className={styles.toolbar}>
                        <button
                            onClick={handleSetMain}
                            className={styles.toolBtn}
                            disabled={currentIndex === 0}
                            title={t('set_main')}
                        >
                            <FiCheck size={20} />
                            <span className={styles.toolLabel}>{t('set_main')}</span>
                        </button>

                        <button onClick={() => fileInputRef.current?.click()} className={styles.toolBtn} title={t('add_new')}>
                            <FiPlus size={20} />
                            <span className={styles.toolLabel}>{t('add_new')}</span>
                        </button>
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleAddPhoto}
                        />

                        <button
                            onClick={handleDelete}
                            className={`${styles.toolBtn} ${styles.deleteBtn}`}
                            disabled={images.length <= 1}
                            title={t('delete')}
                        >
                            <FiTrash2 size={20} />
                            <span className={styles.toolLabel}>{t('delete')}</span>
                        </button>
                    </div>
                )}
                {/* تامب‌نیل‌ها (لیست کوچک پایین) */}
                <div className={styles.thumbnails}>
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`${styles.thumb} ${idx === currentIndex ? styles.activeThumb : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                        >
                            <Image src={img} alt="" width={40} height={40} className={styles.thumbImg} />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}