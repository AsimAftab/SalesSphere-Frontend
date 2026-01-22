import { z } from 'zod';

export const expenseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    amount: z.string()
        .min(1, 'Amount is required')
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: 'Amount must be greater than 0',
        }),
    incurredDate: z.date({
        required_error: "Incurred Date is required",
        invalid_type_error: "Incurred Date is required",
    }).nullable().refine((val) => val !== null, "Incurred Date is required"),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    partyId: z.string().optional(),
    newCategory: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
