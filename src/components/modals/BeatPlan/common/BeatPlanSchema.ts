import { z } from 'zod';

export const CreateBeatPlanSchema = z.object({
    name: z.string().min(1, 'Template name is required'),
    // We use string IDs for parties/sites/prospects, but in the form we might manage them differently.
    // The actual payload to API separates them, but the form might just track a set of IDs.
    // For the schema, we'll validate the final payload structure if needed, or the form fields.
    // Let's validate the form fields.
    parties: z.array(z.string()).optional(),
    sites: z.array(z.string()).optional(),
    prospects: z.array(z.string()).optional(),
}).refine((data) => {
    const total = (data.parties?.length || 0) + (data.sites?.length || 0) + (data.prospects?.length || 0);
    return total > 0;
}, {
    message: "Please select at least one stop",
    path: ["root"] // This might need handling in the form to show the error
});

export type CreateBeatPlanFormData = z.infer<typeof CreateBeatPlanSchema>;

export const AssignBeatPlanSchema = z.object({
    employeeId: z.string().min(1, 'Employee is required'),
    startDate: z.string().min(1, 'Start date is required'),
});

export type AssignBeatPlanFormData = z.infer<typeof AssignBeatPlanSchema>;
