import { z } from "zod/v4";

export const updateProfileSchema = z.object({
  nickname: z.string().min(2).max(50).optional(),
  wilaya_code: z.number().int().min(1).max(69).optional(),
  specialization: z.string().max(100).optional(),
  language: z.enum(["ar", "fr", "en"]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
