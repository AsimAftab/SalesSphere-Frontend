import { z } from 'zod';

export const tourPlanSchema = z.object({
    placeOfVisit: z.string()
        .min(3, 'Place of visit must be at least 3 characters')
        .max(100, 'Place name is too long'),
    purposeOfVisit: z.string()
        .min(10, 'Please provide a more detailed purpose (min 10 chars)')
        .max(500, 'Purpose cannot exceed 500 characters'),
    startDate: z.date({
        required_error: 'Start date is required',
        invalid_type_error: 'Please select a valid start date',
    }).optional(),
    endDate: z.date({
        invalid_type_error: 'Please select a valid end date',
    }).optional().nullable(),
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
    }
    return true;
}, {
    message: 'End date cannot be earlier than start date',
    path: ['endDate'],
});

export type TourPlanFormData = z.infer<typeof tourPlanSchema>;
