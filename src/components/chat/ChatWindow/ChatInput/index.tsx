"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import TextareaAutosize from 'react-textarea-autosize'; // کتابخانه
import { FiPaperclip, FiSend, FiMic, FiX, FiPlay, FiPause } from 'react-icons/fi';
import styles from './styles.module.css';

interface ChatInputProps {
  onSend: (text: string, voiceBlob?: Blob) => void;
  onFileSelect: (file: File) => void;
  onMicClick: () => void;
  draftVoice: { blob: Blob; url: string } | null;
  onCancelVoice: () => void;
}

export default function ChatInput({
  onSend,
  onFileSelect,
  onMicClick,
  draftVoice,
  onCancelVoice
}: ChatInputProps) {
  // ترجمه‌ها را هرطور که راحتید هندل کنید (جدا یا ترکیبی)
  const tInput = useTranslations('chat.input');
  const tRecorder = useTranslations('chat.recorder');

  const [text, setText] = useState('');
  const [isPlayingDraft, setIsPlayingDraft] = useState(false);
  
  const draftAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); 

  // فوکوس خودکار
  useEffect(() => {
    if (!draftVoice) {
       // تاخیر بسیار کوتاه برای اطمینان از رندر
       setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [draftVoice]);

  const handleSendClick = () => {
    if (!text.trim() && !draftVoice) return;

    onSend(text, draftVoice?.blob);

    setText('');
    onCancelVoice();
    
    // بازگرداندن فوکوس
    requestAnimationFrame(() => {
        textareaRef.current?.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // اینتر خالی = ارسال
    // شیفت + اینتر = خط جدید (پیش‌فرض خود textarea)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSendClick();
    }
  };

  const toggleDraftPlay = () => {
    if (!draftVoice) return;
    if (!draftAudioRef.current) {
      draftAudioRef.current = new Audio(draftVoice.url);
      draftAudioRef.current.onended = () => setIsPlayingDraft(false);
    }
    if (isPlayingDraft) {
      draftAudioRef.current.pause();
      setIsPlayingDraft(false);
    } else {
      draftAudioRef.current.play();
      setIsPlayingDraft(true);
    }
  };

  const showSendButton = text.trim().length > 0 || draftVoice !== null;

  return (
    <div className={styles.inputWrapper}>

      {/* نمایش ویس درفت شده */}
      {draftVoice && (
        <div className={styles.draftVoiceContainer}>
            <div className={styles.draftInfo}>
                <button onClick={toggleDraftPlay} className={styles.draftPlayBtn}>
                    {isPlayingDraft ? <FiPause /> : <FiPlay className="ml-1" />}
                </button>
                
                <div className={styles.waveformStatic}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={styles.bar} 
                          style={{
                            height: `${Math.random() * 14 + 4}px`,
                            animation: isPlayingDraft ? `wave 0.5s infinite ease-in-out ${i * 0.05}s` : 'none'
                          }}
                        />
                    ))}
                </div>
                
                <span className={styles.draftLabel}>{tRecorder('voice_message')}</span>
            </div>
            
            <button onClick={onCancelVoice} className={styles.deleteDraftBtn}>
                <FiX />
            </button>
        </div>
      )}

      <div className={styles.inputContainer}>
        <button
          className={styles.attachBtn}
          onClick={() => fileInputRef.current?.click()}
        >
          <FiPaperclip size={20} />
        </button>

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        />

        {/* ورودی متن پیشرفته */}
        <TextareaAutosize
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tInput('placeholder')}
          className={styles.textInput}
          minRows={1}
          maxRows={6}
          // dir="auto" را حذف کردم طبق دستور شما
        />

        {showSendButton ? (
          <button className={styles.sendBtn} onClick={handleSendClick}>
            <FiSend size={18} className={styles.sendIcon} />
          </button>
        ) : (
          <button className={styles.micBtn} onClick={onMicClick}>
            <FiMic size={20} />
          </button>
        )}
      </div>
    </div>
  );
}