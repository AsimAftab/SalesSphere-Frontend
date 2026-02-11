import { z } from 'zod';

export const UpdateStatusSchema = z.object({
    status: z.string().min(1, "Status is required"),
    note: z.string().optional(),
});

export type UpdateStatusFormData = z.infer<typeof UpdateStatusSchema>;

export const BulkUpdateSchema = z.object({
    status: z.string().min(1, "Status is required"),
    note: z.string().min(1, "A note is required for bulk updates"),
});

export type BulkUpdateFormData = z.infer<typeof BulkUpdateSchema>;
