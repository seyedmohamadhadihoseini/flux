"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { 
  FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff, 
  FiMaximize2, FiMinimize2, FiPhone, FiMonitor 
} from 'react-icons/fi';
import styles from './styles.module.css';

export type CallType = 'voice' | 'video';
export type CallStatus = 'outgoing' | 'incoming' | 'connected' | 'ended';

interface CallOverlayProps {
  user: { name: string; avatar: string };
  type: CallType;
  status: CallStatus;
  onEnd: () => void;
  onAnswer?: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  
  // پراپ‌های جدید برای مدیا
  localStream?: MediaStream | null;
  screenStream?: MediaStream | null;
  onScreenShare?: () => void;
}

export default function CallOverlay({ 
  user, type, status, onEnd, onAnswer, isMinimized, onToggleMinimize,
  localStream, screenStream, onScreenShare
}: CallOverlayProps) {
  const t = useTranslations('chat.call');
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(type === 'video');
  const [duration, setDuration] = useState(0);

  // رفرنس برای تگ‌های ویدیو
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  // اتصال استریم به تگ ویدیو (هر وقت استریم تغییر کرد)
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // تایمر تماس
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'connected') {
      interval = setInterval(() => setDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  // --- رندر حالت کوچک شده (Mini Player) ---
  if (isMinimized) {
    return (
      <div className={styles.miniContainer}>
        <div className={styles.miniInfo} onClick={onToggleMinimize}>
           {/* اگر استریم دوربین داریم، نمایش بده */}
           {localStream && type === 'video' ? (
             <div className={styles.miniVideoPreview}>
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className={styles.coverImg} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
             </div>
           ) : (
             <Image src={user.avatar} alt={user.name} width={40} height={40} className={styles.miniAvatar} />
           )}
           
           <div className={styles.miniText}>
              <span className={styles.miniName}>{user.name}</span>
              <span className={styles.miniStatus}>
                {status === 'connected' ? formatTime(duration) : t(type === 'voice' ? 'outgoing_voice' : 'outgoing_video')}
              </span>
           </div>
        </div>
        
        <div className={styles.miniControls}>
           <button onClick={onEnd} className={styles.miniEndBtn}><FiPhoneOff /></button>
           <button onClick={onToggleMinimize} className={styles.maximizeBtn}><FiMaximize2 /></button>
        </div>
      </div>
    );
  }

  // --- رندر حالت تمام صفحه ---
  return (
    <div className={styles.overlay}>
      {/* پس‌زمینه */}
      <div className={styles.backdrop}>
        <Image src={user.avatar} alt="Background" fill className={styles.bgImage} />
        <div className={styles.bgOverlay} />
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
            <button onClick={onToggleMinimize} className={styles.minimizeBtn}>
                <FiMinimize2 />
            </button>
        </div>

        <div className={styles.mainContent}>
            
            {/* نمایش ویدیوها */}
            {type === 'video' || screenStream ? (
                <div className={styles.videoWrapper}>
                    
                    {/* اگر اشتراک صفحه فعال است، آن را بزرگ نشان بده */}
                    {screenStream ? (
                      <div className={styles.remoteVideo}>
                         <video ref={screenVideoRef} autoPlay playsInline className={styles.fullVideo} />
                      </div>
                    ) : (
                      // در غیر این صورت، ویدیوی طرف مقابل (که فعلا نداریم و جاش پلیس‌هولدر میذاریم)
                      <div className={styles.remoteVideo}>
                         <div className={styles.placeholderVideo}>Waiting for remote video...</div>
                      </div>
                    )}

                    {/* ویدیوی خودمان (Local Stream) - شناور گوشه تصویر */}
                    {localStream && isVideoEnabled && (
                        <div className={styles.localVideo}>
                             <video 
                               ref={localVideoRef} 
                               autoPlay 
                               muted 
                               playsInline 
                               className={styles.mirrorVideo} 
                             />
                        </div>
                    )}
                </div>
            ) : (
                // حالت صوتی
                <div className={styles.avatarSection}>
                    <div className={`${styles.avatarWrapper} ${status === 'outgoing' || status === 'incoming' ? styles.pulsing : ''}`}>
                        <Image src={user.avatar} alt={user.name} width={120} height={120} className={styles.bigAvatar} />
                    </div>
                    <h2 className={styles.userName}>{user.name}</h2>
                    <p className={styles.callStatus}>
                        {status === 'connected' ? formatTime(duration) : t(status === 'incoming' ? 'incoming_' + type : 'outgoing_' + type)}
                    </p>
                </div>
            )}
        </div>

        {/* دکمه‌های کنترل */}
        <div className={styles.controls}>
             <div className={styles.activeActions}>
                 <button 
                   onClick={() => setIsMuted(!isMuted)} 
                   className={`${styles.controlBtn} ${isMuted ? styles.activeState : ''}`}
                 >
                     {isMuted ? <FiMicOff size={24} /> : <FiMic size={24} />}
                 </button>

                 <button 
                   onClick={() => setIsVideoEnabled(!isVideoEnabled)} 
                   className={`${styles.controlBtn} ${!isVideoEnabled ? styles.activeState : ''}`}
                 >
                     {!isVideoEnabled ? <FiVideoOff size={24} /> : <FiVideo size={24} />}
                 </button>

                 {/* دکمه اشتراک صفحه */}
                 {onScreenShare && (
                   <button onClick={onScreenShare} className={styles.controlBtn} title="Share Screen">
                      <FiMonitor size={24} />
                   </button>
                 )}

                 <button onClick={onEnd} className={styles.hangupBtn}>
                     <FiPhoneOff size={32} />
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
}