"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  FiCopy,
  FiCornerUpLeft,
  FiEdit2,
  FiFile,
  FiDownload,
  FiShare,
  FiTrash2
} from 'react-icons/fi';
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5';

// ایمپورت کامپوننت‌های وابسته
import WaveformPlayer from './WaveformPlayer';
import VideoContextMenu from './VideoContextMenu';
import styles from './styles.module.css';

interface Message {
  id: string;
  text?: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  time: string;
  isOwn: boolean;
  type: 'text' | 'image' | 'video' | 'voice' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  status?: 'sent' | 'delivered' | 'seen';
}

interface MessageBubbleProps {
  message: Message;
  isGroup: boolean;
  onAction: (action: string, msg: Message) => void;
  onMediaClick?: () => void;
}

export default function MessageBubble({ message, isGroup, onAction, onMediaClick }: MessageBubbleProps) {
  const t = useTranslations('chat.actions'); // اطمینان از مسیر صحیح ترجمه
  const [showMenu, setShowMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // رفرنس‌ها
  const menuRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- منطق بسته شدن منو با کلیک بیرون ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // اگر منو باز است و کلیک روی المانی غیر از خود منو انجام شده
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      // اضافه کردن لیسنر با کمی تاخیر تا کلیک باز کردن منو باعث بسته شدنش نشود
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // هندلر دوبله (مثال)
  const handleDubbing = () => {
    console.log('Dubbing requested for video:', message.id);
    setContextMenu(null);
  };

  // هندلر راست کلیک روی ویدیو
  const handleVideoContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const renderStatus = () => {
    if (!message.isOwn) return null;
    if (message.status === 'seen') return <IoCheckmarkDone className={styles.doubleCheck} />;
    if (message.status === 'delivered') return <IoCheckmarkDone />;
    return <IoCheckmark />;
  };

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className={styles.text}>{message.text}</p>;

      case 'image':
        return (
          <div className={styles.mediaContainer} onClick={onMediaClick}>
            <Image
              src={message.fileUrl || ''}
              alt="image"
              width={300}
              height={200}
              className={styles.image}
            />
            {message.text && <p className={styles.caption}>{message.text}</p>}
          </div>
        );

      case 'video':
        return (
          <div className={styles.mediaContainer} onContextMenu={handleVideoContextMenu}>
            <video
              ref={videoRef}
              src={message.fileUrl}
              className={styles.video}
              controls
            />
            {message.text && <p className={styles.caption}>{message.text}</p>}

            {/* کانتکست منوی ویدیو */}
            {contextMenu && (
              <VideoContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                videoRef={videoRef} // حالا فایل VideoContextMenu شما باید نال‌پذیر بودن را هندل کرده باشد
                onClose={() => setContextMenu(null)}
                onDubbingRequest={handleDubbing}
              />
            )}
          </div>
        );

      case 'voice':
        return (
          <div className={styles.voiceContainer}>
            <WaveformPlayer
              id={message.id}
              url={message.fileUrl || ''}
              isOwn={message.isOwn}
            />
            {/* اگر کپشن دارد */}
            {message.text && <p className={styles.voiceCaption}>{message.text}</p>}
          </div>
        );

      case 'file':
        return (
          <div className={styles.fileContainer}>
            <div className={styles.fileIcon}><FiFile /></div>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{message.fileName || 'Unknown File'}</span>
              <span className={styles.fileSize}>{message.fileSize || ''}</span>
            </div>
            <a href={message.fileUrl} download className={styles.downloadBtn}>
              <FiDownload />
            </a>
            {message.text && <p className={styles.caption}>{message.text}</p>}
          </div>
        );

      default:
        return <p className={styles.text}>{t('unsupported_message')}</p>;
    }
  };

  return (
    <div
      className={`${styles.messageRow} ${message.isOwn ? styles.sentRow : styles.receivedRow}`}
    >
      {isGroup && !message.isOwn && (
        <div className={styles.groupAvatar}>
          <Image
            src={message.senderAvatar || '/default-avatar.png'}
            alt={message.senderName || 'User'}
            width={32}
            height={32}
            className={styles.avatarImg}
          />
        </div>
      )}

      <div
        className={`${styles.bubble} ${message.isOwn ? styles.sentBubble : styles.receivedBubble} ${styles[message.type + 'Bubble'] || ''}`}
        onClick={(e) => {
          // جلوگیری از تریگر شدن کلیک والد اگر لازم باشد
          if (!showMenu) {
            // تاگل کردن منو
            e.stopPropagation();
            setShowMenu(true);
          }
        }}
      >
        {isGroup && !message.isOwn && (
          <span className={styles.senderName}>{message.senderName}</span>
        )}

        {renderContent()}

        <div className={`${styles.metaInfo} ${['image', 'video'].includes(message.type) && !message.text ? styles.mediaMeta : ''}`}>
          <span className={styles.time}>{message.time}</span>
          {renderStatus()}
        </div>

        {/* منوی عملیات پیام */}
        {showMenu && (
          <div
            className={styles.messageMenu}
            ref={menuRef} // اتصال رفرنس برای تشخیص کلیک بیرون
            onClick={(e) => e.stopPropagation()} // کلیک داخل منو نباید آن را ببندد
          >
            <button onClick={() => { onAction('reply', message); setShowMenu(false); }}>
              <FiCornerUpLeft /> {t('reply')}
            </button>

            {message.type === 'text' && (
              <button onClick={() => { onAction('copy', message); setShowMenu(false); }}>
                <FiCopy /> {t('copy')}
              </button>
            )}

            <button onClick={() => { onAction('forward', message); setShowMenu(false); }}>
              <FiShare /> {t('forward')}
            </button>

            {message.isOwn && (
              <>
                <div className={styles.menuDivider} />
                {message.type === 'text' && (
                  <button onClick={() => { onAction('edit', message); setShowMenu(false); }}>
                    <FiEdit2 /> {t('edit')}
                  </button>
                )}
                <button
                  onClick={() => { onAction('delete', message); setShowMenu(false); }}
                  className={styles.deleteOption}
                >
                  <FiTrash2 /> {t('delete')}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}