import { z } from 'zod';

export const demoRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  companyName: z.string().min(1, 'Company name is required'),
  country: z.string().min(1, 'Country is required'),
  preferredDate: z
    .date({ required_error: 'Preferred date is required' })
    .nullable()
    .refine((val) => !!val, 'Preferred date is required'),
  message: z.string().optional(),
});

export const DEFAULT_FORM_VALUES = {
  name: '',
  email: '',
  phoneNumber: '',
  companyName: '',
  country: '',
  preferredDate: null,
  message: '',
};
