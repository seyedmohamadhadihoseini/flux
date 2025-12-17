/* src/components/chat/Sidebar/Contacts/ContactList.tsx */
"use client";

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import styles from './styles.module.css';
import ContactItem from './ContactItem';
import AddContactModal from './AddContactModal';

// 1. تعریف اینترفیس برای رفع خطاهای تایپ‌اسکریپت
interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  phone?: string;
}

// دیتای اولیه
const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: "Ali Rezaei", avatar: "https://i.pravatar.cc/150?u=1", isOnline: true, phone: "+98 912 345 6789" },
  { id: '2', name: "Amir Hossein", avatar: "https://i.pravatar.cc/150?u=2", isOnline: false, lastSeen: "Yesterday" },
  { id: '3', name: "Babak", avatar: "https://i.pravatar.cc/150?u=3", isOnline: true, phone: "+1 234 567 890" },
  { id: '4', name: "Cyrus", avatar: "https://i.pravatar.cc/150?u=4", isOnline: false, lastSeen: "Last week" },
  { id: '5', name: "Darya", avatar: "https://i.pravatar.cc/150?u=5", isOnline: true },
];

export default function ContactList() {
  const t = useTranslations('chat.contacts');
  const router = useRouter();
  const params = useParams();
  
  // 2. استفاده از Generic برای useState
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // فیلتر کردن
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone?.includes(searchTerm)
    );
  }, [contacts, searchTerm]);

  // گروه‌بندی الفبایی
  const groupedContacts = useMemo(() => {
    const groups: Record<string, Contact[]> = {};
    
    filteredContacts.forEach(contact => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(contact);
    });

    return Object.keys(groups).sort().reduce((obj, key) => {
      obj[key] = groups[key];
      return obj;
    }, {} as Record<string, Contact[]>);
  }, [filteredContacts]);

  // --- هندلرها ---

  const handleAddClick = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (contact: Contact) => {
    if (confirm(t('confirm_delete'))) {
      setContacts(prev => prev.filter(c => c.id !== contact.id));
    }
  };

  const handleSaveContact = (data: { name: string; phone: string }) => {
    if (editingContact) {
      // ویرایش: بدون خطا چون تایپ مشخص است
      setContacts(prev => prev.map(c => 
        c.id === editingContact.id ? { ...c, ...data } : c
      ));
    } else {
      // افزودن
      const newContact: Contact = {
        id: Date.now().toString(),
        name: data.name,
        phone: data.phone,
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        isOnline: false,
        lastSeen: 'Just now'
      };
      setContacts(prev => [...prev, newContact]);
    }
    setIsModalOpen(false);
  };

  const handleChatClick = (contact: Contact) => {
    router.push(`/${params.locale}/chat/${contact.id}`);
  };

  return (
    <div className={styles.container}>
      {/* هدر */}
      <div className={styles.header}>
        <div className={styles.topRow}>
          <span className={styles.title}>{t('title')}</span>
          <button onClick={handleAddClick} className={styles.addBtn} title={t('add_contact')}>
            <FiUserPlus size={20} />
          </button>
        </div>
        
        <div className={styles.searchBox}>
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

      {/* لیست */}
      <div className={styles.scrollList}>
        {Object.entries(groupedContacts).length > 0 ? (
          Object.entries(groupedContacts).map(([letter, contacts]) => (
            <div key={letter}>
              <div className={styles.sectionHeader}>{letter}</div>
              {contacts.map(contact => (
                <ContactItem 
                  key={contact.id} 
                  contact={contact} 
                  onChat={handleChatClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>{t('empty_search')}</div>
        )}
      </div>

      <AddContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
        initialData={editingContact}
      />
    </div>
  );
}