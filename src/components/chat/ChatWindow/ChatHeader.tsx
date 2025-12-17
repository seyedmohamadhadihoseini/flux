"use client";

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FiArrowRight, FiPhone, FiVideo, FiMoreVertical } from 'react-icons/fi';
import styles from './styles.module.css';

interface ChatHeaderProps {
  chatInfo: { name: string; avatar: string; status: string };
  onBack: () => void;
  onProfileClick: () => void;
  onStartVoiceCall: () => void;
  onStartVideoCall: () => void;
}

export default function ChatHeader({ 
  chatInfo, 
  onBack, 
  onProfileClick, 
  onStartVoiceCall, 
  onStartVideoCall 
}: ChatHeaderProps) {
  const tCall = useTranslations('chat.call');

  return (
    <div className={styles.header}>
      <div className={styles.headerInfo}>
        <button onClick={onBack} className={styles.backBtn}>
          <FiArrowRight size={24} />
        </button>

        <div className={styles.headerProfile} onClick={onProfileClick}>
          <div className={styles.avatarWrapper}>
            <Image src={chatInfo.avatar} alt={chatInfo.name} width={40} height={40} className={styles.avatar} />
            <div className={styles.statusDot} />
          </div>
          <div className={styles.userInfo}>
            <h3 className={styles.username}>{chatInfo.name}</h3>
            <span className={styles.userStatus}>{chatInfo.status}</span>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
         <button 
           className={styles.iconBtn} 
           onClick={onStartVoiceCall}
           title={tCall('outgoing_voice')}
         >
           <FiPhone size={20} />
         </button>
         
         <button 
           className={styles.iconBtn} 
           onClick={onStartVideoCall}
           title={tCall('outgoing_video')}
         >
           <FiVideo size={20} />
         </button>

         <button className={styles.iconBtn}>
           <FiMoreVertical size={20} />
         </button>
      </div>
    </div>
  );
}