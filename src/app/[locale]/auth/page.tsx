// src/app/[locale]/auth/page.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./styles.module.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // مدیریت حالت ورود یا ثبت‌نام
  const t = useTranslations("auth"); // فرض بر اینکه کلیدهای ترجمه را داری

  return (
    <div className={styles.container}>
      {/* بک‌گراند نوری (مثل صفحه اصلی) */}
      <div className={styles.glowEffect} />

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isLogin ? "خوش آمدید" : "ایجاد حساب کاربری"}
          </h1>
          <p className={styles.subtitle}>
            {isLogin
              ? "برای استفاده از Aura وارد شوید"
              : "به دنیای ارتباطات امن بپیوندید"}
          </p>
        </div>

        <form className={styles.form}>
          {!isLogin && (
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>نام</label>
                <input type="text" className={styles.input} placeholder="مثال: علی" />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>نام خانوادگی</label>
                <input type="text" className={styles.input} placeholder="مثال: علوی" />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                نام کاربری (آیدی) <span className={styles.optional}>(اختیاری)</span>
              </label>
              <input type="text" className={styles.input} dir="ltr" placeholder="@username" />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>ایمیل</label>
            <input type="email" className={styles.input} dir="ltr" placeholder="example@mail.com" />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>رمز عبور</label>
            <input type="password" className={styles.input} dir="ltr" placeholder="••••••••" />
          </div>

          {isLogin && (
            <div className={styles.forgotPass}>
              <Link href="/auth/forgot-password" className={styles.link}>
                رمز عبور را فراموش کرده‌اید؟
              </Link>
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? "ورود به حساب" : "ثبت‌نام رایگان"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            {isLogin ? "حساب کاربری ندارید؟" : "قبلاً ثبت‌نام کرده‌اید؟"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={styles.toggleBtn}
            >
              {isLogin ? "ثبت‌نام کنید" : "وارد شوید"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}