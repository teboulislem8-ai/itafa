const STORAGE_KEY = "ita-theme";

export type Theme = "light" | "dark";

function getStored(): Theme {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? "light";
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

let current: Theme = "light";
const listeners = new Set<(t: Theme) => void>();

export function initTheme() {
  current = getStored();
  apply(current);
}

export function getTheme(): Theme {
  return current;
}

export function setTheme(theme: Theme) {
  current = theme;
  apply(theme);
  localStorage.setItem(STORAGE_KEY, theme);
  listeners.forEach((fn) => fn(theme));
}

export function toggleTheme() {
  setTheme(current === "dark" ? "light" : "dark");
}

export function subscribe(fn: (t: Theme) => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
