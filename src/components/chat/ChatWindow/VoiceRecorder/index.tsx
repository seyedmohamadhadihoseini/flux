"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FiSquare } from 'react-icons/fi';
import styles from './styles.module.css';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export default function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
  const t = useTranslations('chat.recorder');
  const [time, setTime] = useState(0);
  // استفاده از state برای انیمیشن موج صدا
  const [waveHeight, setWaveHeight] = useState<number[]>(new Array(20).fill(10));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    startRecording();
    return () => stopCleanup();
  }, []);

  // افکت برای انیمیشن ویژوالایزر (صوری اما زیبا)
  useEffect(() => {
    const animate = () => {
      setWaveHeight(prev => prev.map(() => Math.random() * 20 + 5));
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // تایمر
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      // اینجا فرض بر این است که والد اجازه را گرفته است
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (chunksRef.current.length > 0) {
            onRecordingComplete(blob);
        } else {
            onCancel();
        }
        // خاموش کردن استریم
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Recording error inside component:", err);
      onCancel();
    }
  };

  const stopCleanup = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const stopRecording = (save: boolean) => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;
    
    if (save) {
      mediaRecorderRef.current.stop(); // تریگر کردن onstop و ارسال
    } else {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      onCancel();
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.visualizer}>
        <div className={styles.recordingDot} />
        {/* ویژوالایزر متحرک */}
        <div className={styles.waves}>
           {waveHeight.map((h, i) => (
             <div key={i} className={styles.bar} style={{ height: `${h}px` }} />
           ))}
        </div>
        <span className={styles.timer}>{formatTime(time)}</span>
      </div>
      
      <div className={styles.actions}>
        <button onClick={() => stopRecording(false)} className={styles.textBtn}>
            {t('cancel')}
        </button>
        <button onClick={() => stopRecording(true)} className={styles.stopBtn}>
            <FiSquare fill="currentColor" />
        </button>
      </div>
    </div>
  );
}