// src/components/Features/index.tsx
import styles from './styles.module.css';

const featuresList = [
  { title: 'رمزنگاری کامل', desc: 'پیام‌های شما فقط بین شما و مخاطبتان باقی می‌ماند.' },
  { title: 'سرعت نور', desc: 'بدون تاخیر، حتی با اینترنت ضعیف پیام بفرستید.' },
  { title: 'طراحی سیال', desc: 'تجربه‌ای روان با انیمیشن‌های ۶۰ فریم بر ثانیه.' },
];

const Features = () => {
  return (
    <section id="features" className={styles.container}>
      <h2 className={styles.heading}>چرا Aura؟</h2>
      <div className={styles.grid}>
        {featuresList.map((item, index) => (
          <div key={index} className={styles.card}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;