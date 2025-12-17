/* update-contacts-crud.js */
const fs = require('fs');
const path = require('path');

const locales = ['fa', 'en', 'ar'];
// مسیر دقیق بر اساس ساختار جدید شما
const basePath = path.join(__dirname, 'messages');

const newTranslations = {
  // ما اینجا "contacts" را کلید اصلی قرار می‌دهیم
  // چون فایل contacts.json خودش روت است، محتوا مستقیم می‌رود داخلش
  chat: {
    contacts: {
      title: "مخاطبین",
      search_placeholder: "جستجو...",
      add_contact: "افزودن مخاطب",
      online: "آنلاین",
      last_seen: "آخرین بازدید",
      empty_search: "مخاطبی یافت نشد.",
      edit: "ویرایش",
      delete: "حذف",
      chat: "چت",
      save: "ذخیره",
      cancel: "لغو",
      name_label: "نام مخاطب",
      phone_label: "شماره تلفن / آیدی",
      confirm_delete: "آیا از حذف این مخاطب اطمینان دارید؟",
      edit_contact: "ویرایش مخاطب",
      new_contact: "مخاطب جدید"
    }
  }
};

const localizedValues = {
  en: {
    contacts: {
      title: "Contacts",
      search_placeholder: "Search...",
      add_contact: "Add Contact",
      online: "Online",
      last_seen: "Last seen",
      empty_search: "No contacts found.",
      edit: "Edit",
      delete: "Delete",
      chat: "Chat",
      save: "Save",
      cancel: "Cancel",
      name_label: "Contact Name",
      phone_label: "Phone / ID",
      confirm_delete: "Are you sure?",
      edit_contact: "Edit Contact",
      new_contact: "New Contact"
    }
  },
  ar: {
    contacts: {
      title: "جهات الاتصال",
      search_placeholder: "بحث...",
      add_contact: "إضافة",
      online: "متصل",
      last_seen: "آخر ظهور",
      empty_search: "لم يتم العثور على نتائج.",
      edit: "تعديل",
      delete: "حذف",
      chat: "دردشة",
      save: "حفظ",
      cancel: "إلغاء",
      name_label: "الاسم",
      phone_label: "الهاتف",
      confirm_delete: "هل أنت متأكد؟",
      edit_contact: "تعديل",
      new_contact: "جديد"
    }
  }
};

function mergeDeep(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], mergeDeep(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

locales.forEach(locale => {
  // مسیر هدف: messages/[locale]/chat/contacts.json
  const dirPath = path.join(basePath, locale, 'chat');
  const filePath = path.join(dirPath, 'contacts.json');

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  let content = {};
  if (fs.existsSync(filePath)) {
    try {
      content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {}
  }

  let specific = JSON.parse(JSON.stringify(newTranslations.chat.contacts));
  if (locale === 'en') specific = localizedValues.en.contacts;
  if (locale === 'ar') specific = localizedValues.ar.contacts;

  // ادغام محتوا
  mergeDeep(content, specific);

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  console.log(`✅ Updated: ${filePath}`);
});