"use client";

import { useState } from 'react';
import MenuList from './MenuList';
import AppearancePage from './pages/AppearancePage';
import LanguagePage from './pages/LanguagePage';
// اینجا بقیه صفحات مثل Privacy و ... را بعدا اضافه میکنی

export type SettingsView = 'main' | 'appearance' | 'language' | 'privacy' | 'sessions';

export default function SettingsNavigator() {
  const [currentView, setCurrentView] = useState<SettingsView>('main');

  // تابع بازگشت به منوی اصلی
  const goBack = () => setCurrentView('main');

  // رندر شرطی بر اساس ویو انتخاب شده
  switch (currentView) {
    case 'appearance':
      return <AppearancePage onBack={goBack} />;
    
    case 'language':
      return <LanguagePage onBack={goBack} />;
      
    // case 'privacy': return <PrivacyPage onBack={goBack} />;
    // case 'sessions': return <SessionsPage onBack={goBack} />;

    case 'main':
    default:
      return <MenuList onNavigate={setCurrentView} />;
  }
}