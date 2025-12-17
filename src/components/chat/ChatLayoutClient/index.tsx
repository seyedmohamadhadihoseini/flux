"use client";

import { useParams } from 'next/navigation';
import styles from './styles.module.css';

export default function ChatLayoutClient({ 
  sidebar, 
  children 
}: { 
  sidebar: React.ReactNode, 
  children: React.ReactNode 
}) {
  const params = useParams();
  const isChatOpen = !!params.id;

  return (
    <div className={styles.layout}>
      {/* Sidebar: 
          On Desktop: Always visible.
          On Mobile: Visible only if chat is NOT open.
      */}
      <aside className={`${styles.sidebar} ${isChatOpen ? styles.hiddenOnMobile : ''}`}>
        {sidebar}
      </aside>

      {/* Main Chat:
          On Desktop: Always visible (shows placeholder if no ID).
          On Mobile: Visible ONLY if chat IS open.
      */}
      <main className={`${styles.main} ${!isChatOpen ? styles.hiddenOnMobile : ''}`}>
        {children}
      </main>
    </div>
  );
}