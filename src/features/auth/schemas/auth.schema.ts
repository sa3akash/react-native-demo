import { z } from 'zod';
import { APP_CONSTANTS } from '../../../constants';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(
      APP_CONSTANTS.MIN_PASSWORD_LENGTH,
      `Password must be at least ${APP_CONSTANTS.MIN_PASSWORD_LENGTH} characters`,
    ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(
        APP_CONSTANTS.MIN_PASSWORD_LENGTH,
        `Password must be at least ${APP_CONSTANTS.MIN_PASSWORD_LENGTH} characters`,
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
