"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface MediaControlContextType {
  playingId: string | null;
  setPlayingId: (id: string | null) => void;
  registerMedia: (id: string, pauseFn: () => void) => void;
  unregisterMedia: (id: string) => void;
}

const MediaContext = createContext<MediaControlContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [playingId, setPlayingIdState] = useState<string | null>(null);
  const mediaRefs = React.useRef<Record<string, () => void>>({});

  const registerMedia = useCallback((id: string, pauseFn: () => void) => {
    mediaRefs.current[id] = pauseFn;
  }, []);

  const unregisterMedia = useCallback((id: string) => {
    delete mediaRefs.current[id];
  }, []);

  const setPlayingId = useCallback((id: string | null) => {
    // اگر مدیای جدیدی می‌خواهد پخش شود و مدیای دیگری در حال پخش است، قبلی را پاز کن
    if (id && playingId && playingId !== id) {
      const pausePrev = mediaRefs.current[playingId];
      if (pausePrev) pausePrev();
    }
    setPlayingIdState(id);
  }, [playingId]);

  return (
    <MediaContext.Provider value={{ playingId, setPlayingId, registerMedia, unregisterMedia }}>
      {children}
    </MediaContext.Provider>
  );
}

export const useMediaControl = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error("useMediaControl must be used within MediaProvider");
  return context;
};