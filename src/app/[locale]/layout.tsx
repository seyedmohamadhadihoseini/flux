import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/components/homepage/Header'; // مسیر را چک کنید
import Footer from '@/components/homepage/Footer'; // مسیر را چک کنید

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  // در نکست ۱۵ حتما باید await شوند
  const { locale } = await params;
  const messages = await getMessages();

  return (
    // اینجا دیگر html و body نمی گذاریم چون لی اوت اصلی شما آن را دارد
    <NextIntlClientProvider messages={messages} locale={locale}>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </div>

    </NextIntlClientProvider>
  );
}