"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { registerUser } from "@/actions/auth";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { ImSpinner8 } from "react-icons/im";
import styles from "./styles.module.css";

interface AuthModalProps {
  onClose: () => void;
}

// تعریف تایپ برای ارورهای فیلدها
interface FieldErrors {
    name?: string[];
    email?: string[];
    password?: string[];
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // استیت‌های پیام
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const t = useTranslations("auth");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // پاک کردن ارورها وقتی بین لاگین و ثبت‌نام جابجا می‌شویم
  const switchMode = () => {
      setIsLogin(!isLogin);
      setGlobalError(null);
      setFieldErrors({});
      setSuccessMsg(null);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGlobalError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        // ترجمه خطای بازگشتی (مثلاً invalid_credentials)
        setGlobalError("invalid_credentials");
      } else {
        window.location.reload();
      }
    } catch (err) {
      setGlobalError("server_error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGlobalError(null);
    setFieldErrors({});
    setSuccessMsg(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.success) {
        // پیام موفقیت (signup_success)
        setSuccessMsg(result.message as string);
        setTimeout(() => {
            switchMode(); // رفتن به لاگین
        }, 2000);
    } else {
        // اگر ارور فیلد داشتیم
        if (result.errors) {
            setFieldErrors(result.errors);
        }
        // اگر ارور کلی داشتیم
        if (result.message) {
            setGlobalError(result.message as string);
        }
    }
    setIsLoading(false);
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: "/" });
  };

  if (!mounted) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeBtn}>
          <IoClose size={24} />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>
            {isLogin ? t("title_login") : t("title_signup")}
          </h2>
          <p className={styles.subtitle}>
            {isLogin ? t("subtitle_login") : t("subtitle_signup")}
          </p>
        </div>

        <div className={styles.socialButtons}>
          <button onClick={() => handleSocialLogin("google")} className={styles.socialBtn} disabled={isLoading}>
            <FcGoogle size={22} />
            <span>Google</span>
          </button>
          <button onClick={() => handleSocialLogin("github")} className={styles.socialBtn} disabled={isLoading}>
            <FaGithub size={22} />
            <span>GitHub</span>
          </button>
        </div>

        <div className={styles.divider}>
          <span>{t("or_continue")}</span>
        </div>

        {/* نمایش پیام‌های کلی */}
        {/* نکته مهم: اینجا از t() استفاده می‌کنیم */}
        {globalError && (
            <div className="text-red-500 text-sm text-center mb-4 bg-red-500/10 p-2 rounded-lg">
                {t(globalError)}
            </div>
        )}
        {successMsg && (
            <div className="text-green-500 text-sm text-center mb-4 bg-green-500/10 p-2 rounded-lg">
                {t(successMsg)}
            </div>
        )}

        <form className={styles.form} onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>{t("name_label")}</label>
              <input name="name" type="text" placeholder={t("placeholder_name")} className={styles.input} />
              {/* نمایش خطای فیلد نام */}
              {fieldErrors.name && <span className="text-xs text-red-500 mt-1">{t(fieldErrors.name[0])}</span>}
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <label>{t("email_label")}</label>
            <input name="email" type="email" placeholder={t("placeholder_email")} dir="ltr" className={styles.input} />
            {/* نمایش خطای فیلد ایمیل */}
            {fieldErrors.email && <span className="text-xs text-red-500 mt-1">{t(fieldErrors.email[0])}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>{t("password_label")}</label>
            <input name="password" type="password" placeholder={t("placeholder_password")} dir="ltr" className={styles.input} />
            {/* نمایش خطای فیلد پسورد */}
            {fieldErrors.password && <span className="text-xs text-red-500 mt-1">{t(fieldErrors.password[0])}</span>}
          </div>

          {isLogin && (
            <button type="button" className={styles.forgotPass}>
              {t("forgot_password")}
            </button>
          )}

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <ImSpinner8 className="animate-spin" />
                    <span>...</span>
                </div>
            ) : (
                isLogin ? t("btn_login") : t("btn_signup")
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <button onClick={switchMode} className={styles.toggleBtn} disabled={isLoading}>
            {isLogin ? t("toggle_to_signup") : t("toggle_to_login")}
          </button>
        </div>
      </div>
    </div>
  );
}