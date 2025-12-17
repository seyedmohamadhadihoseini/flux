// src/components/homepage/Hero/index.tsx
import { useTranslations } from 'next-intl';
import styles from './styles.module.css'; // اتصال فایل استایل

export default function HeroSection() {
  const t = useTranslations('home.hero');

  return (
    <section className={styles.hero}>
      {/* بخش محتوا (متن و دکمه‌ها) */}
      <div className={styles.content}>
        <h1 className={styles.title}>
          {t('titleStart')}{" "}
          <span className={styles.gradientText}>
            {t('titleGradient')}
          </span>
          {" "}{t('titleEnd')}
        </h1>
        
        <p className={styles.description}>
          {t('description')}
        </p>

        <div className={styles.buttons}>
          <button className={styles.primaryBtn}>
            {t('buttons.start')}
          </button>
          <button className={styles.secondaryBtn}>
            {t('buttons.demo')}
          </button>
        </div>
      </div>

      {/* بخش ویژوال (افکت نور) */}
      {/* این بخش در موبایل طبق CSS شما به بالای صفحه می‌رود */}
      <div className={styles.visual}>
        <div className={styles.glowBall} />
      </div>
    </section>
  );
}