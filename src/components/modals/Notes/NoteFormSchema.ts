import { z } from "zod";

export const ENTITY_TYPES = ["party", "prospect", "site"] as const;

export const noteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Provide a more detailed description"),
  entityType: z.enum(ENTITY_TYPES, {
    errorMap: (issue) => ({
      message: issue.code === "invalid_enum_value" ? "Please select a link type" : "Invalid selection"
    })
  }),
  entityId: z.string().min(1, "Please select a specific entity"),
  newImages: z.array(z.instanceof(File)).max(2, "Max 2 images allowed").optional(),
});

export type NoteFormData = z.infer<typeof noteSchema>;