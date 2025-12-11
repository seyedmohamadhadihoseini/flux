import Features from '@/components/homepage/Features';
import HeroSection from '@/components/homepage/Hero';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  // تغییر اینجاست: اشاره به فایل hero داخل پوشه home
  const t = useTranslations('home.hero'); 

  return (
    <div>

        <HeroSection/>
        <Features />
    </div>
    
  );
}