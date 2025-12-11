import { useTranslations } from 'next-intl';
import styles from './styles.module.css';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* برند */}
          <div className={styles.brandColumn}>
            <h2>.Aura</h2>
            <p className={styles.description}>{t('brandDescription')}</p>
          </div>

          {/* محصول */}
          <div>
            <h3 className={styles.columnTitle}>{t('columns.product')}</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.link}>{t('links.download')}</a></li>
              <li><a href="#" className={styles.link}>{t('links.features')}</a></li>
              {/* کلید security که ارور داده بود اینجا استفاده میشه */}
              <li><a href="#" className={styles.link}>{t('links.security')}</a></li> 
            </ul>
          </div>

          {/* قانونی */}
          <div>
             <h3 className={styles.columnTitle}>{t('columns.legal')}</h3>
             <ul className={styles.linkList}>
              <li><a href="#" className={styles.link}>{t('links.privacy')}</a></li>
              <li><a href="#" className={styles.link}>{t('links.terms')}</a></li>
            </ul>
          </div>
          
           {/* منابع (جایگزین سوشال مدیا) */}
           <div>
             <h3 className={styles.columnTitle}>{t('columns.resources')}</h3>
             <ul className={styles.linkList}>
               <li><a href="#" className={styles.link}>{t('links.blog')}</a></li>
               <li><a href="#" className={styles.link}>{t('links.status')}</a></li>
             </ul>
           </div>

        </div>
        
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Aura Messenger.
        </div>
      </div>
    </footer>
  );
}