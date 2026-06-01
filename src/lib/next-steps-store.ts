import type { NextStep } from "@/types/ai";

interface NextStepWithCheck extends NextStep {
  checked: boolean;
}

let store: NextStepWithCheck[] = [];
let currentChatId: string | null = null;
const listeners = new Set<() => void>();

const STORAGE_PREFIX = "ita-steps-";

function persist() {
  if (!currentChatId) return;
  try {
    localStorage.setItem(
      STORAGE_PREFIX + currentChatId,
      JSON.stringify(store),
    );
  } catch {}
}

function load(chatId: string): NextStepWithCheck[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + chatId);
    if (raw) return JSON.parse(raw) as NextStepWithCheck[];
  } catch {}
  return [];
}

export function getNextSteps(): NextStep[] {
  return store;
}

export function getNextStepsWithCheck(): NextStepWithCheck[] {
  return store;
}

export function setNextSteps(steps: NextStep[], chatId?: string) {
  if (chatId && chatId !== currentChatId) {
    currentChatId = chatId;
    const saved = load(chatId);
    if (saved.length > 0) {
      store = saved;
      listeners.forEach((fn) => fn());
      return;
    }
  }
  store = steps.map((s) => ({ ...s, checked: false }));
  persist();
  listeners.forEach((fn) => fn());
}

export function toggleStep(index: number) {
  if (index < 0 || index >= store.length) return;
  store = store.map((s, i) => (i === index ? { ...s, checked: !s.checked } : s));
  persist();
  listeners.forEach((fn) => fn());
}

export function allChecked(): boolean {
  return store.length > 0 && store.every((s) => s.checked);
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
