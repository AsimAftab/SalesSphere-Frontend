import { z } from 'zod';

export const PartyExcelRowSchema = z.object({
    sNo: z.union([z.string(), z.number()]).optional(),
    partyName: z.string().min(1, "Party Name is required"),
    ownerName: z.string().min(1, "Owner Name is required"),
    panVat: z.union([z.string(), z.number()]).transform(val => String(val)).refine(val => val.length > 0, "PAN/VAT is required"),
    phone: z.union([z.string(), z.number()]).transform(val => String(val)).refine(val => val.length >= 10, "Phone must be at least 10 digits"),
    email: z.string().email("Invalid email format").optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    partyType: z.string().optional().or(z.literal('')),
    description: z.string().optional().or(z.literal(''))
});

export type PartyExcelRow = z.infer<typeof PartyExcelRowSchema>;

export interface UploadResultState {
    successfullyImported: number;
}
