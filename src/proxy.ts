// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing'; // همان فایل routing که قبلا ساختیم

const handleI18n = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ۱. نادیده گرفتن فایل‌های استاتیک، تصاویر و APIهای سیستمی
  // این دقیقاً کار همان matcher را به صورت دستی و قابل کنترل‌تر انجام می‌دهد
  if (
    pathname.startsWith('/_next') || // فایل‌های بیلد Next.js
    pathname.startsWith('/api') ||   // روت‌های API (اگر نخواهید ترجمه شوند)
    pathname.includes('.')           // فایل‌های دارای پسوند (css, png, ico, ...)
  ) {
    return NextResponse.next();
  }

  // ۲. اجرای لاجیک تغییر زبان (i18n)
  // این تابع خودش Redirect یا Rewrite لازم را انجام می‌دهد
  const response = handleI18n(request);

  // ۳. (اختیاری) اضافه کردن هدرهای امنیتی یا لاجیک‌های دیگر به ریسپانس
  // response.headers.set('X-Frame-Options', 'DENY');

  return response;
}