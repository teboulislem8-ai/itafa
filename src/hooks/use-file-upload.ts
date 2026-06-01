"use client";

import { useState, useCallback } from "react";

type UploadState = "idle" | "uploading" | "success" | "error";

interface UseFileUploadReturn {
  state: UploadState;
  progress: number;
  error: string | null;
  upload: (file: File) => Promise<{ id: string; storagePath: string } | null>;
  reset: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<{ id: string; storagePath: string } | null> => {
      try {
        setState("uploading");
        setProgress(0);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Upload failed");
        }

        const data = await res.json();
        setState("success");
        setProgress(100);
        return { id: data.id, storagePath: data.storage_path };
      } catch (err) {
        setState("error");
        setError(err instanceof Error ? err.message : "Upload failed");
        return null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setState("idle");
    setProgress(0);
    setError(null);
  }, []);

  return { state, progress, error, upload, reset };
}
