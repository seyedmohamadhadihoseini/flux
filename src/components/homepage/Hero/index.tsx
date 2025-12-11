// components/HeroSection.tsx

import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('home.hero'); // فرض بر استفاده از کلید hero

  return (
    <div className="pt-24 pb-12">
      <section className="relative w-full flex flex-col items-center justify-center py-20 md:py-32 px-4 overflow-hidden">
        
        {/* افکت نور */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10" />

        <div className="text-center max-w-4xl mx-auto z-10">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
             {t('titleStart')}{" "}
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
               {t('titleGradient')}
             </span>
             {" "}{t('titleEnd')}
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition w-full sm:w-auto">
               {t('buttons.start')}
             </button>
             <button className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-full font-bold hover:bg-white/20 transition w-full sm:w-auto">
               {t('buttons.demo')}
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}