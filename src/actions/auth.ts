// src/actions/auth.ts
'use server';

import { signIn } from '@/auth'; 
import { SignupSchema } from '@/lib/definitions';

// اگر AuthError ایمپورت نشد، مهم نیست چون پایین دستی هندل کردیم
// import { AuthError } from 'next-auth'; 

export async function registerUser(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = SignupSchema.safeParse(rawData);

  if (!validatedFields.success) {
    // اولین خطای مربوط به هر فیلد را برمی‌گردانیم
    // Zod errors: { name: ["validation_name_min"], ... }
    return {
      success: false,
      message: 'validation_generic', // پیام کلی
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // شبیه‌سازی دیتابیس
    console.log('Registering:', { name, email });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // در آینده اینجا یوزر را در دیتابیس می‌سازی
    
    return { success: true, message: 'signup_success' }; // کلید موفقیت

  } catch (error) {
    return { success: false, message: 'server_error' }; // کلید خطای سرور
  }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error: any) {
    if (error.type === 'CredentialsSignin') {
        return 'invalid_credentials'; // کلید خطای لاگین
    }
    throw error;
  }
}