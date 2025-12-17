import { ThemeProvider } from '@/providers/theme-provider'; // یا مسیر کامپوننت خودتان
import SessionProvider from '@/providers/session-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Vazirmatn } from 'next/font/google';
import '@/app/globals.css';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing'; // یا مسیری که کانفیگ i18n را دارید

const vazir = Vazirmatn({ subsets: ['arabic', 'latin'] });

export const metadata = {
  title: 'Aura | پیام‌رسان نسل جدید',
  description: 'سریع، امن و زیبا',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // اطمینان از اینکه لوکیل معتبر است
  // if (!routing.locales.includes(locale as any)) {
  //   notFound();
  // }

  const messages = await getMessages();
  
  // تعیین جهت بر اساس زبان
  const direction = locale === 'fa' || locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={vazir.className}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <ThemeProvider
              attribute="data-theme"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              {/* اینجا دیگر هیچ هدر یا فوتری نیست، فقط فرزندان رندر می‌شوند */}
              {children}
            </ThemeProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}