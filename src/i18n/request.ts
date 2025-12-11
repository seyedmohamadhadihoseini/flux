// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import fs from 'fs';
import path from 'path';

const loadLocaleMessages = (locale: string) => {
  // ... (همان کد قبلی برای خواندن فایل‌ها - بدون تغییر)
  // برای جلوگیری از شلوغی اینجا تکرار نکردم، همان تابع قبلی را نگه دار
  const dirPath = path.resolve(process.cwd(), `messages/${locale}`);
  if (!fs.existsSync(dirPath)) return {};
  
  const messages: Record<string, any> = {};
  
  const walk = (directory: string, currentObj: Record<string, any>) => {
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (!currentObj[file]) currentObj[file] = {};
        walk(fullPath, currentObj[file]);
      } else if (path.extname(file) === '.json') {
        const fileName = path.basename(file, '.json');
        const fileContent = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        if (fileName === 'index') Object.assign(currentObj, fileContent);
        else currentObj[fileName] = fileContent;
      }
    });
  };
  walk(dirPath, messages);
  return messages;
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale, // <--- این خط را حتماً اضافه کن تا خطای تایپ‌اسکریپت برود
    messages: loadLocaleMessages(locale) // استفاده از تابع لود کردن خودت
  };
});