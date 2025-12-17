/* src/components/chat/Sidebar/Contacts/ContactItem.tsx */
"use client";

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FiMessageSquare, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './styles.module.css';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  phone?: string;
}

interface ContactItemProps {
  contact: Contact;
  onChat: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export default function ContactItem({ contact, onChat, onEdit, onDelete }: ContactItemProps) {
  const t = useTranslations('chat.contacts');

  return (
    <div className={styles.contactItem} onClick={() => onChat(contact)}>
      {/* اطلاعات مخاطب */}
      <div className={styles.contentWrapper}>
        <div className={styles.avatarWrapper}>
          <Image 
            src={contact.avatar} 
            alt={contact.name} 
            width={44} 
            height={44} 
            className={styles.avatar} 
          />
          {contact.isOnline && <div className={styles.onlineBadge} />}
        </div>
        
        <div className={styles.info}>
          <span className={styles.name}>{contact.name}</span>
          <span className={`${styles.status} ${contact.isOnline ? styles.onlineText : ''}`}>
            {contact.isOnline ? t('online') : contact.phone || contact.lastSeen}
          </span>
        </div>
      </div>

      {/* دکمه‌های عملیاتی (شناور) */}
      <div className={styles.itemActions}>
        <button 
          onClick={(e) => { e.stopPropagation(); onChat(contact); }} 
          className={styles.actionBtn} 
          title={t('chat')}
        >
           <FiMessageSquare size={16} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(contact); }} 
          className={styles.actionBtn} 
          title={t('edit')}
        >
           <FiEdit2 size={16} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(contact); }} 
          className={`${styles.actionBtn} ${styles.deleteBtn}`} 
          title={t('delete')}
        >
           <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
}