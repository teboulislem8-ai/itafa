import { z } from "zod/v4";

const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const fileMetadataSchema = z.object({
  originalName: z.string().min(1).max(255),
  mimeType: z.enum(ACCEPTED_MIME_TYPES),
  sizeBytes: z.number().int().positive().max(MAX_FILE_SIZE),
  chatId: z.string().uuid().optional(),
});

export type FileMetadata = z.infer<typeof fileMetadataSchema>;
