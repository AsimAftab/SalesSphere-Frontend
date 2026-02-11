import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z
      .string()
      .min(8, 'Must be at least 8 characters.')
      .regex(/[A-Z]/, 'Must contain an uppercase letter.')
      .regex(/[a-z]/, 'Must contain a lowercase letter.')
      .regex(/[0-9]/, 'Must contain a number.')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
