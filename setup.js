

const fs = require('fs');
const path = require('path');

// مسیر اصلی پوشه messages
const messagesDir = path.join(__dirname, 'messages');

// داده‌های ترجمه برای هر سه زبان
const translations = {
  // === فارسی ===
  fa: {
    'nav.json': {
      security: "امنیت",
      features: "امکانات",
      download: "دانلود",
      login: "ورود به پنل"
    },
    'footer.json': {
      brandDescription: "نسل جدید پیام‌رسان‌هاست. بدون محدودیت و با امنیت کامل.",
      columns: {
        product: "محصول",
        legal: "قوانین",
        social: "شبکه‌های اجتماعی"
      },
      links: {
        download: "دانلود اپلیکیشن",
        features: "ویژگی‌ها",
        privacy: "حریم خصوصی",
        terms: "شرایط استفاده"
      }
    },
    'common.json': {
      buttons: {
        confirm: "تایید",
        cancel: "لغو",
        submit: "ارسال"
      },
      errors: {
        general: "خطایی رخ داده است"
      }
    },
    // پوشه home
    'home/hero.json': {
      titleStart: "ارتباطی سریع، امن و",
      titleGradient: "فراتر از انتظار",
      titleEnd: "",
      description: "نسل جدید پیام‌رسان‌هاست. بدون محدودیت، با امنیت رمزنگاری شده و رابط کاربری که عاشقش می‌شوید.",
      buttons: {
        start: "شروع کنید (رایگان)",
        demo: "مشاهده دمو"
      }
    },
    // پوشه dashboard
    'dashboard/index.json': {
      welcome: "به داشبورد خوش آمدید",
      logout: "خروج از حساب"
    },
    'dashboard/settings.json': {
      title: "تنظیمات",
      theme: "تغییر پوسته",
      notifications: "مدیریت اعلانات"
    }
  },

  // === انگلیسی ===
  en: {
    'nav.json': {
      security: "Security",
      features: "Features",
      download: "Download",
      login: "Login to Panel"
    },
    'footer.json': {
      brandDescription: "The next generation of messengers. No limits, fully secure.",
      columns: {
        product: "Product",
        legal: "Legal",
        social: "Social"
      },
      links: {
        download: "Download App",
        features: "Features",
        privacy: "Privacy Policy",
        terms: "Terms of Service"
      }
    },
    'common.json': {
      buttons: {
        confirm: "Confirm",
        cancel: "Cancel",
        submit: "Submit"
      },
      errors: {
        general: "An error occurred"
      }
    },
    'home/hero.json': {
      titleStart: "Fast, Secure, and",
      titleGradient: "Beyond Expectations",
      titleEnd: "Communication",
      description: "The next-gen messenger. No limits, encrypted security, and a UI you'll fall in love with.",
      buttons: {
        start: "Get Started (Free)",
        demo: "View Demo"
      }
    },
    'dashboard/index.json': {
      welcome: "Welcome to Dashboard",
      logout: "Logout"
    },
    'dashboard/settings.json': {
      title: "Settings",
      theme: "Change Theme",
      notifications: "Manage Notifications"
    }
  },

  // === عربی ===
  ar: {
    'nav.json': {
      security: "الأمان",
      features: "المميزات",
      download: "تحميل",
      login: "تسجيل الدخول"
    },
    'footer.json': {
      brandDescription: "الجيل القادم من برامج المراسلة. بلا حدود وبأمان تام.",
      columns: {
        product: "المنتج",
        legal: "قانوني",
        social: "تواصل اجتماعي"
      },
      links: {
        download: "تحميل التطبيق",
        features: "المميزات",
        privacy: "سياسة الخصوصية",
        terms: "شروط الخدمة"
      }
    },
    'common.json': {
      buttons: {
        confirm: "تأكيد",
        cancel: "إلغاء",
        submit: "إرسال"
      },
      errors: {
        general: "حدث خطأ ما"
      }
    },
    'home/hero.json': {
      titleStart: "تواصل سريع وآمن",
      titleGradient: "يفوق التوقعات",
      titleEnd: "",
      description: "الجيل الجديد من برامج المراسلة. بلا حدود، أمان مشفر، وواجهة مستخدم ستحبها.",
      buttons: {
        start: "ابدأ الآن (مجاناً)",
        demo: "شاهد العرض"
      }
    },
    'dashboard/index.json': {
      welcome: "مرحبًا بك في لوحة التحكم",
      logout: "تسجيل خروج"
    },
    'dashboard/settings.json': {
      title: "الإعدادات",
      theme: "تغيير المظهر",
      notifications: "إدارة الإشعارات"
    }
  }
};

// تابع اصلی برای ساخت فایل‌ها
async function createStructure() {
  console.log('🚀 Starting i18n setup...');

  // ساخت پوشه اصلی messages اگر نباشد
  if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir);
  }

  // پیمایش روی زبان‌ها
  for (const [lang, files] of Object.entries(translations)) {
    const langDir = path.join(messagesDir, lang);
    
    // ساخت پوشه زبان (en, fa, ar)
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir);
    }

    // پیمایش روی فایل‌ها
    for (const [filePath, content] of Object.entries(files)) {
      // ترکیب مسیر کامل فایل
      const fullPath = path.join(langDir, filePath);
      const dirName = path.dirname(fullPath);

      // اگر فایل داخل پوشه باشد (مثل home/hero.json)، پوشه والدش را بساز
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }

      // نوشتن فایل جیسون
      fs.writeFileSync(fullPath, JSON.stringify(content, null, 2), 'utf8');
      console.log(`✅ Created: messages/${lang}/${filePath}`);
    }
  }

  console.log('\n✨ All files generated successfully!');
  console.log('👉 You can now delete "setup-i18n.js".');
}

createStructure();