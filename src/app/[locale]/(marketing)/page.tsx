import Features from '@/components/homepage/Features';
import HeroSection from '@/components/homepage/Hero';
import HowItWorks from '@/components/homepage/HowItWorks';
import LandingSections from '@/components/homepage/LandingSections';
import Testimonials from '@/components/homepage/Testimonials';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  // تغییر اینجاست: اشاره به فایل hero داخل پوشه home
  const t = useTranslations('home.hero'); 

  return (
    <div>

        <HeroSection/>
        <Features />
        <LandingSections />

    </div>
    
  );
}