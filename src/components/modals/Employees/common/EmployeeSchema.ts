import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOC_TYPES = ["application/pdf"];

export const employeeSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
    address: z.string().min(1, 'Address is required'),
    gender: z.enum(['Male', 'Female', 'Other'], { errorMap: () => ({ message: 'Gender is required' }) }),
    customRoleId: z.string().min(1, 'Role is required'),
    panNumber: z.string().min(9, 'PAN number is required').max(15, 'PAN number too long'),
    citizenshipNumber: z.string().regex(/^\d{2}[-/]\d{2}[-/]\d{2}[-/]\d{5}$/, 'Format must be XX-XX-XX-XXXXX or XX/XX/XX/XXXXX'),

    // Dates are strings for form inputs (ISO format from DatePicker)
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    dateJoined: z.string().min(1, 'Date joined is required'),

    // Files
    photoFile: z.any()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .optional()
        .nullable(),

    documents: z.array(z.any())
        .max(2, 'Maximum 2 documents allowed')
        .refine((files) => {
            if (!files) return true;
            return files.every((file: File) => ACCEPTED_DOC_TYPES.includes(file.type));
        }, "Only PDF files are allowed")
        .optional()
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export const systemUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
    address: z.string().min(1, 'Address is required'),
    gender: z.enum(['Male', 'Female', 'Other'], { errorMap: () => ({ message: 'Gender is required' }) }),
    role: z.enum(['superadmin', 'developer'], { errorMap: () => ({ message: 'Role is required' }) }),

    // System users don't have customRoleId (it's for org permissions)

    // Citizenship is required for system users too
    citizenshipNumber: z.string().regex(/^\d{2}[-/]\d{2}[-/]\d{2}[-/]\d{5}$/, 'Format must be XX-XX-XX-XXXXX or XX/XX/XX/XXXXX'),

    // Date of Birth is required
    dateOfBirth: z.string().min(1, 'Date of birth is required'),

    // Date Joined is required for manual entry
    dateJoined: z.string().min(1, 'Date joined is required'),

    // Added fields to match Employee Schema
    panNumber: z.string().min(9, 'PAN number is required').max(15, 'PAN number too long'),

    documents: z.array(z.any())
        .max(2, 'Maximum 2 documents allowed')
        .refine((files) => {
            if (!files) return true;
            return files.every((file: File) => ACCEPTED_DOC_TYPES.includes(file.type));
        }, "Only PDF files are allowed")
        .optional(),

    // Files - System users might have avatar but usually no documents
    photoFile: z.any()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .optional()
        .nullable(),
});

export type SystemUserFormData = z.infer<typeof systemUserSchema>;
