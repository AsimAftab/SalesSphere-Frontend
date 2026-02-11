import { z } from 'zod';

export const productEntitySchema = z.object({
    productName: z.string().min(1, 'Product name is required'),
    categoryId: z.string().min(1, 'Category is required'),
    newCategoryName: z.string().optional(),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
    qty: z.coerce.number().int().min(0, 'Quantity must be a non-negative integer'),
    serialNo: z.string().optional(),
    // Image is handled separately as a File object or logic in the hook/component
    // We can validate it here if we want to enforce it via RHF, but typically file inputs are tricky with pure Zod text schemas.
    // For now, we'll keep it optional in schema and handle validaton in the component/hook if needed or treating it as distinct.
    // Actually, let's include it as any or string (preview URL) for now, but RHF often handles files via `watch`.
    // Let's rely on component logic for file validation for now to match strict Zod types, or refine this.
    // Update: We'll keep it out of the main data schema for simplicity or just allow optional.
}).refine((data) => {
    if (data.categoryId === 'OTHER' && !data.newCategoryName?.trim()) {
        return false;
    }
    return true;
}, {
    message: "New Category Name is required",
    path: ["newCategoryName"]
});

export type ProductEntityFormData = z.infer<typeof productEntitySchema>;
