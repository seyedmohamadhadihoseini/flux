// src/lib/definitions.ts
import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().min(2, { message: 'validation_name_min' }), // کلید ترجمه
  email: z.string().email({ message: 'validation_email_invalid' }), // کلید ترجمه
  password: z.string().min(6, { message: 'validation_password_min' }), // کلید ترجمه
  username: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: 'validation_email_invalid' }),
  password: z.string().min(1, { message: 'validation_generic' }),
});