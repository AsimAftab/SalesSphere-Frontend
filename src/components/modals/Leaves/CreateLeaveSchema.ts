import { z } from 'zod';

export const createLeaveSchema = z.object({
    startDate: z.string().min(1, 'Start Date is required'),
    endDate: z.string().optional(),
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
