import { z } from "zod";

export const OrganizationFormSchema = z.object({
    name: z.string().min(1, "Organization Name is required"),
    ownerName: z.string().min(1, "Owner Name is required"),
    panVat: z.string().min(1, "PAN/VAT Number is required"),

    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address"),

    phone: z.string()
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^\d+$/, "Phone must contain only numbers"),

    address: z.string().optional(),

    // Subscription
    subscriptionType: z.string().optional(),
    customPlanId: z.string().optional(),
    subscriptionDuration: z.string().min(1, "Subscription Duration is required"),

    // Organization Details
    country: z.string().min(1, "Country is required"),
    weeklyOff: z.string().min(1, "Weekly Off Day is required"),
    timezone: z.string().min(1, "Timezone is required"),

    // Working Hours
    checkInTime: z.string().min(1, "Check-In Time is required"),
    checkOutTime: z.string().min(1, "Check-Out Time is required"),
    halfDayCheckOutTime: z.string().min(1, "Half Day Check-Out Time is required"),

    // Settings
    geoFencing: z.boolean().optional(),

    // Edit Mode Only - Status
    status: z.enum(['Active', 'Inactive']).optional(),

    // Location (Hidden fields usually)
    latitude: z.number().optional(),
    longitude: z.number().optional(),

    description: z.string().optional(),
}).superRefine((data, ctx) => {
    if (!data.subscriptionType && !data.customPlanId) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Either a Standard Plan or a Custom Plan must be selected",
            path: ["subscriptionType"],
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Either a Standard Plan or a Custom Plan must be selected",
            path: ["customPlanId"],
        });
    }
    if (data.subscriptionType && data.customPlanId) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select only one plan type",
            path: ["subscriptionType"],
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select only one plan type",
            path: ["customPlanId"],
        });
    }
});

export type OrganizationFormInputs = z.infer<typeof OrganizationFormSchema>;
