import { z } from 'zod';

export const createLeaveSchema = z.object({
    startDate: z.string().min(1, 'Start Date is required'),
    // Transform empty strings to undefined for optional endDate
    endDate: z.string().optional().transform(val => val === '' ? undefined : val),
    category: z.string().min(1, 'Category is required'),
    reason: z.string().min(1, 'Reason is required')
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
}, {
    message: "End Date cannot be before Start Date",
    path: ["endDate"]
});

export type CreateLeaveFormData = z.infer<typeof createLeaveSchema>;
