"use client";

import { useState } from 'react';
import { CallType, CallStatus } from '../CallOverlay';

// تعریف نوع خروجی هوک برای استفاده راحت‌تر
export interface CallSystem {
  activeCall: {
    type: CallType;
    status: CallStatus;
    isMinimized: boolean;
  } | null;
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  startCall: (type: CallType) => Promise<void>;
  endCall: () => void;
  toggleMinimize: () => void;
  shareScreen: () => Promise<void>;
}

export function useCallSystem(onPermissionError: (action: () => Promise<void>) => void): CallSystem {
  const [activeCall, setActiveCall] = useState<{
    type: CallType;
    status: CallStatus;
    isMinimized: boolean;
  } | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const startCall = async (type: CallType) => {
    try {
      const constraints = {
        audio: true,
        video: type === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      
      setActiveCall({
        type,
        status: 'outgoing',
        isMinimized: false
      });
      
      // شبیه‌سازی اتصال
      setTimeout(() => {
          setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
      }, 2000);

    } catch (error) {
      console.error("Call permission denied:", error);
      // پاس دادن تابع تلاش مجدد به هندلر خطا (برای نمایش مودال)
      onPermissionError(() => startCall(type));
    }
  };

  const endCall = () => {
    setActiveCall(prev => prev ? { ...prev, status: 'ended' } : null);
    
    // پاکسازی استریم‌ها
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }

    setTimeout(() => setActiveCall(null), 1000);
  };

  const toggleMinimize = () => {
    setActiveCall(prev => prev ? { ...prev, isMinimized: !prev.isMinimized } : null);
  };

  const shareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setScreenStream(stream);
      
      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
      };
    } catch (error) {
      console.error("Screen share cancelled:", error);
    }
  };

  return {
    activeCall,
    localStream,
    screenStream,
    startCall,
    endCall,
    toggleMinimize,
    shareScreen
  };
}