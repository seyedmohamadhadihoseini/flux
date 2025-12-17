"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FiPlay, FiPause } from 'react-icons/fi';
import { useMediaControl } from '@/context/MediaControlContext';
import styles from './styles.module.css';

interface WaveformPlayerProps {
  id: string;
  url: string;
  isOwn: boolean;
}

export default function WaveformPlayer({ id, url, isOwn }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalDuration, setTotalDuration] = useState("0:00");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const { playingId, setPlayingId, registerMedia, unregisterMedia } = useMediaControl();

  // تابع ساخت گرادینت برای زیبایی موج
  const createGradient = (ctx: CanvasRenderingContext2D, isProgress: boolean) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    if (isOwn) {
      // پیام‌های ارسالی (روی پس زمینه رنگی)
      if (isProgress) {
         gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
         gradient.addColorStop(1, "rgba(255, 255, 255, 0.6)");
      } else {
         gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
         gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");
      }
    } else {
      // پیام‌های دریافتی (تم روشن/تیره)
      if (isProgress) {
         gradient.addColorStop(0, "#8b5cf6"); // بنفش پررنگ
         gradient.addColorStop(1, "#6d28d9");
      } else {
         gradient.addColorStop(0, "rgba(139, 92, 246, 0.3)");
         gradient.addColorStop(1, "rgba(139, 92, 246, 0.1)");
      }
    }
    return gradient;
  };

  useEffect(() => {
    if (!containerRef.current || !url) return;

    // ساخت یک کانواس موقت برای تولید گرادینت
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    let waveColor: string | CanvasGradient = isOwn ? 'rgba(255,255,255,0.3)' : '#cbd5e1';
    let progressColor: string | CanvasGradient = isOwn ? '#ffffff' : '#7c3aed';

    if (ctx) {
        waveColor = createGradient(ctx, false);
        progressColor = createGradient(ctx, true);
    }

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: waveColor,
      progressColor: progressColor,
      cursorColor: 'transparent', // حذف خط نشانگر زشت
      barWidth: 3,        // میله‌های ضخیم‌تر و مدرن
      barRadius: 3,       // گرد کردن لبه میله‌ها
      barGap: 2,          // فاصله کم بین میله‌ها
      height: 36,         // ارتفاع مناسب
      url: url,
      normalize: true,    // نرمال‌سازی بلندی صدا
      interact: true,     // اجازه کلیک برای جلو/عقب بردن (Seeking)
    });

    // --- هندلرها ---
    
    wavesurfer.current.on('ready', () => {
      const dur = wavesurfer.current?.getDuration() || 0;
      setTotalDuration(formatTime(dur));
    });

    wavesurfer.current.on('audioprocess', () => {
      const time = wavesurfer.current?.getCurrentTime() || 0;
      setCurrentTime(formatTime(time));
    });

    wavesurfer.current.on('finish', () => {
      setIsPlaying(false);
      setPlayingId(null);
      setCurrentTime("0:00");
      wavesurfer.current?.seekTo(0); // برگشت به اول
    });

    wavesurfer.current.on('interaction', () => {
       // وقتی کاربر روی نوار کلیک کرد، تایم آپدیت شود ولی لزوما پلی نشود مگر اینکه پلی بوده
       const time = wavesurfer.current?.getCurrentTime() || 0;
       setCurrentTime(formatTime(time));
    });

    registerMedia(id, () => {
      wavesurfer.current?.pause();
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.current?.destroy();
      unregisterMedia(id);
    };
  }, [url, isOwn, id]);

  // سینک با کانتکست
  useEffect(() => {
    if (playingId !== id && isPlaying) {
      wavesurfer.current?.pause();
      setIsPlaying(false);
    }
  }, [playingId, id, isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wavesurfer.current) {
      if (isPlaying) {
        wavesurfer.current.pause();
        setPlayingId(null);
      } else {
        wavesurfer.current.play();
        setPlayingId(id);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const speeds = [1, 1.5, 2];
    const nextSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    wavesurfer.current?.setPlaybackRate(nextSpeed);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.playerContainer} dir="ltr"> {/* همیشه LTR باشد تا کنترل‌ها جابجا نشوند */}
      
      {/* دکمه دایره‌ای پخش */}
      <div className={`${styles.playCircle} ${isOwn ? styles.playCircleOwn : styles.playCircleOther}`}>
        <button onClick={togglePlay} className={styles.playBtn}>
          {isPlaying ? <FiPause /> : <FiPlay className="ml-1" />}
        </button>
      </div>

      {/* بخش میانی: موج صدا */}
      <div className={styles.waveWrapper}>
         <div ref={containerRef} className={styles.wave} />
      </div>

      {/* بخش کناری: اطلاعات و سرعت */}
      <div className={styles.metaColumn}>
         <button onClick={changeSpeed} className={styles.speedBtn}>
             {playbackSpeed}x
         </button>
         <span className={styles.duration}>
             {isPlaying ? currentTime : totalDuration}
         </span>
      </div>

    </div>
  );
}