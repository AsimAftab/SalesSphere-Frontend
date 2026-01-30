import { z } from "zod";

// Common fields shared across all entity schemas
const commonFields = {
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

    // Entity Specific (Nullable/Optional by default in base)
    partyType: z.string().optional(),
};

// Conditional field schemas
const panVatOptional = z.string().optional();
const panVatRequired = z.string().min(1, "PAN/VAT is required").min(9, "PAN/VAT must be between 9 and 15 characters").max(15, "PAN/VAT must be between 9 and 15 characters");
const subOrgOptional = z.string().optional();
const subOrgRequired = z.string().min(1, "Sub Org is required");

// Base schema with optional fields (used for type inference)
const baseEntitySchema = z.object({
    ...commonFields,
    panVat: panVatOptional,
    subOrgName: subOrgOptional,
});

export type EntityFormData = z.infer<typeof baseEntitySchema>;

// Helper to create the refined schema based on props
export const createEntitySchema = (
    entityType: 'Party' | 'Prospect' | 'Site',
    panVatMode: 'hidden' | 'optional' | 'required'
) => {
    return z.object({
        ...commonFields,
        panVat: panVatMode === 'required' ? panVatRequired : panVatOptional,
        subOrgName: entityType === 'Site' ? subOrgRequired : subOrgOptional,
    });
};
