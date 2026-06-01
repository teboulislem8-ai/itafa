import "server-only";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { gemini as geminiConfig } from "@/config";

const BACKOFF_MAX = 30_000;
const BACKOFF_BASE = 1_000;

interface KeyState {
  key: string;
  backoffUntil: number;
  failures: number;
}

class KeyPool {
  private keys: KeyState[];
  private index = 0;

  constructor(apiKeys: readonly string[]) {
    this.keys = apiKeys.map((key) => ({
      key,
      backoffUntil: 0,
      failures: 0,
    }));
  }

  next(): KeyState | null {
    const now = Date.now();

    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const candidate = this.keys[this.index % this.keys.length];
      this.index = (this.index + 1) % this.keys.length;

      if (now >= candidate.backoffUntil) {
        return candidate;
      }
    }

    const earliest = this.keys.reduce((a, b) =>
      a.backoffUntil < b.backoffUntil ? a : b,
    );
    earliest.backoffUntil = 0;
    return earliest;
  }

  markFailure(keyState: KeyState): void {
    keyState.failures++;
    const delay = Math.min(
      BACKOFF_BASE * Math.pow(2, keyState.failures - 1),
      BACKOFF_MAX,
    );
    keyState.backoffUntil = Date.now() + delay;
  }

  markSuccess(keyState: KeyState): void {
    keyState.failures = 0;
    keyState.backoffUntil = 0;
  }
}

const pool = new KeyPool(geminiConfig.apiKeys);

const DEFAULT_MODEL = "gemini-2.5-flash";
const HIGH_TEMP_MODEL = "gemini-2.5-flash";

function createModel(apiKey: string, modelId: string) {
  return createGoogleGenerativeAI({ apiKey })(modelId);
}

export function getDefaultModel() {
  const keyState = pool.next()!;
  const apiKey = keyState.key;

  return {
    instance: createModel(apiKey, DEFAULT_MODEL),
    onSuccess: () => pool.markSuccess(keyState),
    onError: () => pool.markFailure(keyState),
  };
}

export function getHighTempModel() {
  const keyState = pool.next()!;
  const apiKey = keyState.key;

  return {
    instance: createModel(apiKey, HIGH_TEMP_MODEL),
    onSuccess: () => pool.markSuccess(keyState),
    onError: () => pool.markFailure(keyState),
  };
}

export const EMBEDDING_MODEL = "text-embedding-004";
