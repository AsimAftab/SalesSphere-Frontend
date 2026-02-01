import { z } from 'zod';

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required.')
    .regex(/^[a-zA-Z\s]*$/, 'Letters only.'),
  lastName: z
    .string()
    .min(1, 'Last name is required.')
    .regex(/^[a-zA-Z\s]*$/, 'Letters only.'),
  dob: z.date({ required_error: 'Date of birth is required.' }).nullable().refine((val) => val !== null, { message: 'Date of birth is required.' }),
  phone: z
    .string()
    .min(1, 'Phone number is required.')
    .regex(/^\d{10}$/, 'Must be exactly 10 digits.'),
  gender: z.string().min(1, 'Gender is required.'),
  citizenship: z
    .string()
    .min(1, 'Citizenship number is required.')
    .regex(/^\d{2}[-/]\d{2}[-/]\d{2}[-/]\d{5}$/, 'Format must be XX-XX-XX-XXXXX or XX/XX/XX/XXXXX'),
  address: z.string().optional().or(z.literal('')),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
