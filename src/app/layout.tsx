// src/app/layout.tsx
import './globals.css';
import { Vazirmatn } from 'next/font/google'; // استفاده از فونت استاندارد گوگل

const vazir = Vazirmatn({ subsets: ['arabic', 'latin'] });

export const metadata = {
  title: 'Aura | پیام‌رسان نسل جدید',
  description: 'سریع، امن و زیبا',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // اضافه کردن dir="rtl" حیاتی است
    <html lang="fa" dir="rtl">
      <body className={vazir.className}>{children}</body>
    </html>
  );
}