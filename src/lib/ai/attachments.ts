import "server-only";
import { getAdminClient } from "@/lib/supabase/proxy";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { PDFParse } from "pdf-parse";
import type { ProcessedAttachment } from "@/types/ai";

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const TEXT_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

export interface AttachmentInput {
  id: string;
  mimeType: string;
  storagePath: string;
}

export async function processAttachments(
  attachments: AttachmentInput[],
): Promise<ProcessedAttachment[]> {
  if (attachments.length === 0) return [];

  const supabase = getAdminClient();
  const results: ProcessedAttachment[] = [];

  for (const attachment of attachments) {
    const { data, error } = await supabase.storage
      .from("uploads")
      .download(attachment.storagePath);

    if (error || !data) continue;

    const buffer = Buffer.from(await data.arrayBuffer());

    if (IMAGE_MIME_TYPES.has(attachment.mimeType)) {
      results.push({ type: "image", mimeType: attachment.mimeType, data: buffer.toString("base64") });
    } else if (TEXT_MIME_TYPES.has(attachment.mimeType)) {
      let text: string | null = null;

      if (attachment.mimeType === "application/pdf") {
        const pdf = new PDFParse({ data: buffer });
        const result = await pdf.getText();
        text = result.text;
      } else if (
        attachment.mimeType === "application/msword" ||
        attachment.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } else if (
        attachment.mimeType === "application/vnd.ms-excel" ||
        attachment.mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const parts: string[] = [];
        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
          if (csv.trim()) {
            parts.push(`[Sheet: ${sheetName}]\n${csv}`);
          }
        }
        text = parts.join("\n\n");
      }

      if (text) {
        results.push({ type: "text", mimeType: attachment.mimeType, data: text });
      }
    }
  }

  return results;
}
