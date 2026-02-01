import { z } from "zod";
import { PAYMENT_MODE_VALUES, CHEQUE_STATUS_VALUES } from "../../../Pages/CollectionPage/components/CollectionConstants";

export const PAYMENT_MODES = PAYMENT_MODE_VALUES;
export const CHEQUE_STATUSES = CHEQUE_STATUS_VALUES;

// Base schema for common fields
const baseSchema = z.object({
    partyId: z.string().min(1, "Party is required"),
    amount: z.string().refine((val) => Number(val) > 0, "Valid amount required"),
    paymentMode: z.enum(PAYMENT_MODES, {
        errorMap: () => ({ message: "Payment mode is required" })
    }),
    receivedDate: z.date({
        required_error: "Received date is required",
        invalid_type_error: "Received date is required"
    }),
    notes: z.string().max(200, "Notes cannot exceed 200 characters").optional(),

    // Optional/Dynamic fields (will be refined later)
    bankName: z.string().optional(),
    chequeNumber: z.string().max(20, "Max 20 characters").optional(),
    chequeDate: z.date().optional().nullable(),
    chequeStatus: z.enum(CHEQUE_STATUSES).optional(),

    // Images (Handled separately in component but validated here for existence)
    // We use a custom refinement for image validation because it depends on paymentMode
    newImages: z.array(z.instanceof(File)).optional(), // We'll validate length/presence based on mode
});

// Refinement for conditional validation
export const collectionSchema = baseSchema.superRefine((data, ctx) => {
    // Cheque Validations
    if (data.paymentMode === "Cheque") {
        if (!data.bankName || data.bankName.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Bank name is required",
                path: ["bankName"],
            });
        }
        if (!data.chequeNumber || data.chequeNumber.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Cheque number is required",
                path: ["chequeNumber"],
            });
        }
        if (!data.chequeDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Cheque date is required",
                path: ["chequeDate"],
            });
        }
        if (!data.chequeStatus) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Status is required",
                path: ["chequeStatus"],
            });
        }
    }

    // Bank Transfer Validations
    if (data.paymentMode === "Bank Transfer") {
        if (!data.bankName || data.bankName.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Bank name is required",
                path: ["bankName"],
            });
        }
    }
});

export type CollectionFormData = z.infer<typeof baseSchema>;
