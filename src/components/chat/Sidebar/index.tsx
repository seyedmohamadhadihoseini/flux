"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { 
  FiSearch, FiSettings, FiMenu, FiMessageSquare, FiUsers, FiLogOut 
} from 'react-icons/fi';
import ProfileViewer from '@/components/chat/ProfileViewer';
import styles from './styles.module.css';
import SettingsNavigator from './Settings/SettingsNavigator';
import ContactList from './Contacts/ContactList';

type ChatType = 'personal' | 'group' | 'channel';

const mockChats = [
  { id: 1, type: 'personal', name: "Ali Rezaei", lastMsg: "سلام، کجایی؟", time: "10:30", unread: 2, avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, type: 'group', name: "Aura Devs", lastMsg: "PR merged.", time: "Yesterday", unread: 0, avatar: "https://i.pravatar.cc/150?u=8" },
  { id: 3, type: 'channel', name: "Aura News", lastMsg: "New update v2.0 released!", time: "Mon", unread: 5, avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, type: 'personal', name: "Sara", lastMsg: "Ok.", time: "Mon", unread: 0, avatar: "https://i.pravatar.cc/150?u=4" },
];

export default function ChatSidebar() {
  const t = useTranslations('chat.sidebar');
  const router = useRouter();
  const params = useParams();
  
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'settings'>('chats');
  const [filter, setFilter] = useState<'all' | ChatType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [showProfile, setShowProfile] = useState(false);
  const [myPhotos, setMyPhotos] = useState(["https://i.pravatar.cc/150?u=me"]);

  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filter === 'all' || chat.type === filter;
    return matchesSearch && matchesType;
  });

  const handleChatClick = (id: number) => {
    router.push(`/${params.locale}/chat/${id}`);
  };

  return (
    <>
      <div className={`${styles.container} ${isCollapsed ? styles.collapsed : ''}`}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
             {/* Toggle Button - Hidden on Mobile via CSS */}
             <button 
                onClick={() => setIsCollapsed(!isCollapsed)} 
                className={`${styles.toggleBtn} ${styles.desktopOnly}`}
                title={t('toggle_sidebar')}
             >
                <FiMenu size={20} />
             </button>

             {!isCollapsed && (
                <div className={styles.userInfo} onClick={() => setShowProfile(true)}>
                  <div className={styles.myAvatar}>
                    <Image src={myPhotos[0]} alt="Me" width={32} height={32} className={styles.avatarImg} />
                  </div>
                  <span className={styles.username}>شما</span>
                </div>
             )}
          </div>

          {/* Search */}
          {!isCollapsed && activeTab === 'chats' && (
            <div className={styles.searchBox}>
              <div className={styles.searchInputWrapper}>
                <FiSearch className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder={t('search_placeholder')} 
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Filters (Only for Chats tab) */}
          {!isCollapsed && activeTab === 'chats' && (
            <div className={styles.filters}>
              {['all', 'personal', 'group', 'channel'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`${styles.filterChip} ${filter === f ? styles.activeFilter : ''}`}
                >
                  {t(`filters.${f}`)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* List Content */}
        <div className={styles.list}>
          {activeTab === 'chats' && (
            filteredChats.length > 0 ? (
              filteredChats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`${styles.chatItem} ${Number(params.id) === chat.id ? styles.activeChat : ''}`}
                  onClick={() => handleChatClick(chat.id)}
                  title={isCollapsed ? chat.name : ''}
                >
                  <div className={styles.itemAvatar}>
                    <Image src={chat.avatar} alt={chat.name} width={48} height={48} className={styles.avatarImg} />
                    {chat.unread > 0 && isCollapsed && <div className={styles.miniBadge} />}
                  </div>
                  
                  {!isCollapsed && (
                    <div className={styles.itemContent}>
                      <div className={styles.itemTop}>
                        <span className={styles.itemName}>{chat.name}</span>
                        <span className={styles.itemTime}>{chat.time}</span>
                      </div>
                      <div className={styles.itemBottom}>
                        <p className={styles.lastMsg}>{chat.lastMsg}</p>
                        {chat.unread > 0 && <span className={styles.unreadBadge}>{chat.unread}</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              !isCollapsed && <div className={styles.emptyState}>{t('no_chats')}</div>
            )
          )}

          {activeTab === 'contacts' && !isCollapsed && (
             <ContactList />
          )}

          {activeTab === 'settings' && !isCollapsed && (
             <SettingsNavigator />
          )}
        </div>

        {/* Bottom Tabs Navigation */}
        <div className={styles.bottomTabs}>
          <button 
            onClick={() => setActiveTab('chats')} 
            className={`${styles.tabBtn} ${activeTab === 'chats' ? styles.activeTabBtn : ''}`}
          >
            <FiMessageSquare size={20} />
            {!isCollapsed && <span className={styles.tabLabel}>{t('tabs.chats')}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('contacts')} 
            className={`${styles.tabBtn} ${activeTab === 'contacts' ? styles.activeTabBtn : ''}`}
          >
            <FiUsers size={20} />
            {!isCollapsed && <span className={styles.tabLabel}>{t('tabs.contacts')}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.activeTabBtn : ''}`}
          >
            <FiSettings size={20} />
            {!isCollapsed && <span className={styles.tabLabel}>{t('tabs.settings')}</span>}
          </button>
        </div>

      </div>

      {showProfile && (
        <ProfileViewer 
          initialImages={myPhotos} 
          onClose={() => setShowProfile(false)} 
          onUpdate={(newImages) => setMyPhotos(newImages)}
        />
      )}
    </>
  );
}