"use client";

import { useTranslations } from 'next-intl';
import { 
  FiMoon, FiGlobe, FiLock, FiLogOut, FiChevronRight, FiSmartphone 
} from 'react-icons/fi';
import styles from './styles.module.css';
import { SettingsView } from './SettingsNavigator';

interface MenuListProps {
  onNavigate: (view: SettingsView) => void;
}

export default function MenuList({ onNavigate }: MenuListProps) {
  const t = useTranslations('chat.settings');

  return (
    <div className={styles.container}>
      {/* عنوان اختیاری - چون تب پایین مشخص میکند این تنظیمات است شاید لازم نباشد */}
      {/* <h3 className={styles.headerTitle}>{t('title')}</h3> */}

      <div className={styles.menuList}>
        
        {/* ظاهر */}
        <button className={styles.menuItem} onClick={() => onNavigate('appearance')}>
          <div className={styles.iconBox} style={{background: '#e0e7ff', color: '#4f46e5'}}>
             <FiMoon />
          </div>
          <span className={styles.label}>{t('appearance.title')}</span>
          <FiChevronRight className={styles.chevronIcon} />
        </button>

        {/* زبان */}
        <button className={styles.menuItem} onClick={() => onNavigate('language')}>
          <div className={styles.iconBox} style={{background: '#dcfce7', color: '#16a34a'}}>
             <FiGlobe />
          </div>
          <span className={styles.label}>{t('language')}</span>
          <FiChevronRight className={styles.chevronIcon} />
        </button>

        {/* حریم خصوصی */}
        <button className={styles.menuItem} onClick={() => onNavigate('privacy')}>
          <div className={styles.iconBox} style={{background: '#fee2e2', color: '#dc2626'}}>
             <FiLock />
          </div>
          <span className={styles.label}>{t('privacy')}</span>
          <FiChevronRight className={styles.chevronIcon} />
        </button>

        {/* نشست‌های فعال - میتواند زیرمجموعه حریم خصوصی باشد یا جدا */}
        <button className={styles.menuItem} onClick={() => onNavigate('sessions')}>
          <div className={styles.iconBox} style={{background: '#ffedd5', color: '#ea580c'}}>
             <FiSmartphone />
          </div>
          <span className={styles.label}>{t('active_sessions')}</span>
          <FiChevronRight className={styles.chevronIcon} />
        </button>

        <div style={{ height: '1px', background: 'var(--border)', margin: '8px 12px' }} />

        {/* خروج */}
        <button className={styles.menuItem} onClick={() => console.log('Logout Clicked')}>
          <div className={styles.iconBox} style={{background: '#f3f4f6', color: '#374151'}}>
             <FiLogOut />
          </div>
          <span className={styles.label}>{t('logout')}</span>
        </button>

      </div>
    </div>
  );
}