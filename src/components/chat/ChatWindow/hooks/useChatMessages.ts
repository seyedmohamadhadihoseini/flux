"use client";

import { useState } from 'react';

export interface Message {
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

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "سلام! چطور میتونم کمکت کنم؟", senderId: 'other', senderName: 'Ali', time: "10:30", isOwn: false, type: 'text' },
  ]);

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const sendMessage = (text: string, voiceBlob?: Blob) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (voiceBlob) {
      const voiceUrl = URL.createObjectURL(voiceBlob);
      addMessage({
        id: Date.now().toString(),
        senderId: 'me',
        time: timestamp,
        isOwn: true,
        type: 'voice',
        fileUrl: voiceUrl,
        text: text.trim() ? text : undefined,
        status: 'sent'
      });
      return true; // نشان دهنده موفقیت برای پاک کردن درفت
    } 
    else if (text.trim()) {
      addMessage({
        id: Date.now().toString(),
        text: text,
        senderId: 'me',
        time: timestamp,
        isOwn: true,
        type: 'text',
        status: 'sent'
      });
      return true;
    }
    return false;
  };

  const sendFile = (file: File, caption: string) => {
    let type: 'image' | 'video' | 'file' = 'file';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';

    const tempUrl = URL.createObjectURL(file);
    addMessage({
      id: Date.now().toString(),
      text: caption,
      senderId: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      type: type,
      fileUrl: tempUrl,
      fileName: file.name,
      fileSize: (file.size / 1024 / 1024).toFixed(2) + " MB",
      status: 'sent'
    });
  };

  return { messages, sendMessage, sendFile, deleteMessage };
}