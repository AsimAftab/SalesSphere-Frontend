import { z } from "zod";

// Base Schema containing common fields
const baseEntitySchema = z.object({
    name: z.string().min(1, "Name is required"),
    ownerName: z.string().min(1, "Owner is required"),
    // phone: 10 digits required
    phone: z.string().length(10, "Valid 10-digit phone is required").regex(/^\d+$/, "Phone must be numeric"),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),

    // Location
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),

    // Dates
    dateJoined: z.date({
        required_error: "Date joined is required",
        invalid_type_error: "Date joined is required",
    }),

    // Optional Info
    description: z.string().optional(),

    // PAN/VAT - Validation handled via superRefine based on mode
    panVat: z.string().optional(),

    // Entity Specific (Nullable/Optional by default in base)
    subOrgName: z.string().optional(),
    partyType: z.string().optional(),
});

export type EntityFormData = z.infer<typeof baseEntitySchema>;

// Helper to create the refined schema based on props
export const createEntitySchema = (
    entityType: 'Party' | 'Prospect' | 'Site',
    panVatMode: 'hidden' | 'optional' | 'required'
) => {
    return baseEntitySchema.superRefine((data, ctx) => {
        // 1. Site Specific validations
        if (entityType === 'Site') {
            if (!data.subOrgName || data.subOrgName.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Sub Org is required",
                    path: ["subOrgName"],
                });
            }
        }

        // 2. Party Specific validations
        // Party Type is now optional per user request


        // 3. PAN/VAT Validation
        if (panVatMode === 'required') {
            if (!data.panVat || data.panVat.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "PAN/VAT is required",
                    path: ["panVat"],
                });
            } else if (data.panVat.length !== 14) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "PAN/VAT must be exactly 14 characters",
                    path: ["panVat"],
                });
            }
        }
    });
};
