// src/components/Navbar/index.tsx
import styles from './styles.module.css';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Aura.</div>
      <div className={styles.links}>
        <Link href="#features">امکانات</Link>
        <Link href="#security">امنیت</Link>
        <Link href="#download">دانلود</Link>
      </div>
      <button className={styles.ctaButton}>ورود به پنل</button>
    </nav>
  );
};

export default Navbar;