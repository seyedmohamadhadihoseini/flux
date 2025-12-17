import { useTranslations } from 'next-intl';
import styles from './styles.module.css';

const Features = () => {
  const t = useTranslations('home.features');

  // لیست فیچرها را اینجا می‌سازیم تا به هوک t دسترسی داشته باشیم
  const featuresList = [
    { 
      key: 'encryption',
      title: t('items.encryption.title'), 
      desc: t('items.encryption.desc') 
    },
    { 
      key: 'speed',
      title: t('items.speed.title'), 
      desc: t('items.speed.desc') 
    },
    { 
      key: 'design',
      title: t('items.design.title'), 
      desc: t('items.design.desc') 
    },
  ];

  return (
    <section id="features" className={styles.container}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{t('heading')}</h2>
        
        <div className={styles.grid}>
          {featuresList.map((item) => (
            <div key={item.key} className={styles.card}>
              {/* یک آیکون تزئینی کوچک بالای هر کارت */}
              <div className={styles.iconLine} />
              
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;