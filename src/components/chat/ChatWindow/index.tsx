"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';

import styles from './styles.module.css'; 

// Components
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import UserProfilePanel from '../UserProfilePanel';
import MediaPreviewModal from './MediaPreviewModal';
import VoiceRecorder from './VoiceRecorder';
import MediaLightbox from './MediaLightbox';
import PermissionModal from './PermissionModal'; 
import CallOverlay from './CallOverlay'; 
import ChatHeader from './ChatHeader'; // کامپوننت جدید هدر

// Context
import { MediaProvider } from '@/context/MediaControlContext';

// Custom Hooks (ماژول‌های جدید)
import { useCallSystem } from './hooks/useCallSystem';
import { useChatMessages } from './hooks/useChatMessages';

interface ChatWindowProps {
  chatId: string;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const t = useTranslations('chat.window');
  const router = useRouter();
  const params = useParams();
  
  // --- UI State (فقط وضعیت‌های ظاهری اینجا می‌مانند) ---
  const [showProfile, setShowProfile] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false); 
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [draftVoice, setDraftVoice] = useState<{ blob: Blob; url: string } | null>(null);
  const [lightboxInitialId, setLightboxInitialId] = useState<string | null>(null);
  
  // ذخیره عملیاتی که نیاز به پرمیشن داشته (برای Retry)
  const [pendingPermissionAction, setPendingPermissionAction] = useState<(() => Promise<void>) | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Logic Hooks (تمام لاجیک‌ها از اینجا فراخوانی می‌شوند) ---
  const { messages, sendMessage, sendFile, deleteMessage } = useChatMessages();
  
  // هندلر خطای پرمیشن که به هوک‌ها پاس می‌دهیم
  const handlePermissionError = (action: () => Promise<void>) => {
    setPendingPermissionAction(() => action);
    setShowPermissionModal(true);
  };

  // سیستم تماس
  const callSystem = useCallSystem(handlePermissionError);

  // --- Mock Data ---
  const chatInfo = { 
    id: chatId, 
    name: chatId === '2' ? "Aura Developers" : `User ${chatId}`, 
    avatar: `https://i.pravatar.cc/150?u=${chatId}`,
    status: t('online'),
    isGroup: chatId === '2',
    photos: [`https://i.pravatar.cc/150?u=${chatId}`, `https://i.pravatar.cc/150?u=${chatId}2`]
  };

  // --- Effects ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isRecording, draftVoice]); 

  // --- Handlers ---
  const handleBack = () => router.push(`/${params.locale}/chat`);

  // هندلر ضبط صدا (هنوز کمی لاجیک UI دارد که می‌تواند در آینده جدا شود)
  const handleStartRecordingRequest = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'microphone' as any });
        if (result.state === 'denied') {
          setShowPermissionModal(true);
          return;
        }
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setIsRecording(true);
    } catch (error) {
      handlePermissionError(handleStartRecordingRequest);
    }
  };

  // رپر برای ارسال پیام تا بتوانیم ویس درفت را پاک کنیم
  const handleSendMessageWrapper = (text: string, voiceBlob?: Blob) => {
    const success = sendMessage(text, voiceBlob);
    if (success && voiceBlob) {
      setDraftVoice(null);
    }
  };

  const mediaList = useMemo(() => {
    return messages
      .filter(m => m.type === 'image' || m.type === 'video')
      .map(m => ({
        id: m.id,
        url: m.fileUrl!,
        type: m.type as 'image' | 'video',
        caption: m.text
      }));
  }, [messages]);

  return (
    <MediaProvider>
      <div className={styles.container}>
        
        {/* --- Call Overlay --- */}
        {callSystem.activeCall && (
            <CallOverlay 
                user={{ name: chatInfo.name, avatar: chatInfo.avatar }}
                type={callSystem.activeCall.type}
                status={callSystem.activeCall.status}
                isMinimized={callSystem.activeCall.isMinimized}
                onEnd={callSystem.endCall}
                onToggleMinimize={callSystem.toggleMinimize}
                localStream={callSystem.localStream} 
                screenStream={callSystem.screenStream}
                onScreenShare={callSystem.shareScreen}
            />
        )}

        {/* --- Permission Modal --- */}
        <PermissionModal 
          isOpen={showPermissionModal}
          onClose={() => setShowPermissionModal(false)}
          onRetry={() => {
             if (pendingPermissionAction) {
                pendingPermissionAction().then(() => setShowPermissionModal(false));
             }
          }}
        />

        {/* --- Header (کامپوننت جدا شده) --- */}
        <ChatHeader 
          chatInfo={chatInfo}
          onBack={handleBack}
          onProfileClick={() => setShowProfile(!showProfile)}
          onStartVoiceCall={() => callSystem.startCall('voice')}
          onStartVideoCall={() => callSystem.startCall('video')}
        />

        {/* --- Chat Body --- */}
        <div className={styles.chatBody}>
          <div className={styles.chatMainArea}>
            <div className={styles.messagesList}>
              {messages.map((msg) => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  isGroup={chatInfo.isGroup} 
                  onAction={(action, m) => action === 'delete' && deleteMessage(m.id)}
                  onMediaClick={() => (msg.type === 'image' || msg.type === 'video') && setLightboxInitialId(msg.id)}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* --- Input Area --- */}
            {isRecording ? (
              <VoiceRecorder 
                onRecordingComplete={(blob) => {
                  setDraftVoice({ blob, url: URL.createObjectURL(blob) });
                  setIsRecording(false);
                }} 
                onCancel={() => setIsRecording(false)} 
              />
            ) : (
              <div className={styles.footerWrapper}>
                <ChatInput 
                  onSend={handleSendMessageWrapper}
                  onFileSelect={setPreviewFile}
                  onMicClick={handleStartRecordingRequest}
                  draftVoice={draftVoice}
                  onCancelVoice={() => setDraftVoice(null)}
                />
              </div>
            )}
          </div>

          {/* --- Side Panels --- */}
          {showProfile && (
            <UserProfilePanel user={chatInfo} onClose={() => setShowProfile(false)} />
          )}
        </div>

        {/* --- Modals --- */}
        {lightboxInitialId && (
          <MediaLightbox 
            mediaList={mediaList}
            initialId={lightboxInitialId}
            onClose={() => setLightboxInitialId(null)}
          />
        )}

        {previewFile && (
          <MediaPreviewModal 
            file={previewFile}
            onSend={(file, caption) => {
              sendFile(file, caption);
              setPreviewFile(null);
            }}
            onCancel={() => setPreviewFile(null)}
          />
        )}

      </div>
    </MediaProvider>
  );
}