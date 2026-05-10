const WORKER_URL = process.env.NEXT_PUBLIC_AI_WORKER_URL || "http://localhost:8787";

export function getAiWorkerUrl(): string {
  return WORKER_URL;
}
