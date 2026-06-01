import { z } from "zod/v4";

export const createChatSchema = z.object({
  mode: z.enum(["plant", "pest", "soil", "analytics"]),
  title: z.string().max(200).optional(),
});

export const sendMessageSchema = z.object({
  chatId: z.string().uuid().optional(),
  mode: z.enum(["plant", "pest", "soil", "analytics"]),
  content: z.string().min(1).max(50000),
  attachments: z
    .array(
      z.object({
        id: z.string().uuid(),
        mimeType: z.string(),
        storagePath: z.string(),
      }),
    )
    .max(10)
    .optional(),
});

export type CreateChatInput = z.infer<typeof createChatSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
