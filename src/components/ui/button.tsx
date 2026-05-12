import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "ai";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const base: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderRadius: "var(--radius-sm)",
  fontWeight: 500,
  cursor: "pointer",
  border: "none",
  fontFamily: "var(--font-body)",
  letterSpacing: "0.01em",
  transition: "background 140ms ease, opacity 140ms ease",
};

const variants: Record<string, React.CSSProperties> = {
  primary: { background: "var(--brand)", color: "var(--text-inverse)" },
  secondary: { background: "transparent", color: "var(--text-primary)", border: "1px solid var(--border)" },
  ghost: { background: "transparent", color: "var(--text-muted)" },
  danger: { background: "var(--red-bg)", color: "var(--red-text)", border: "1px solid rgba(160,40,40,0.18)" },
  ai: { background: "var(--blue-bg)", color: "var(--blue-text)", border: "1px solid rgba(27,95,160,0.18)" },
};

const sizes: Record<string, React.CSSProperties> = {
  sm: { padding: "6px 14px", fontSize: 13 },
  md: { padding: "10px 20px", fontSize: 14 },
  lg: { padding: "12px 24px", fontSize: 15 },
};

export function Button({ variant = "primary", size = "md", loading, children, style, disabled, ...rest }: ButtonProps) {
  return (
    <button
      style={{ ...base, ...variants[variant], ...sizes[size], opacity: disabled || loading ? 0.5 : 1, ...style }}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span style={{ letterSpacing: "0.15em" }}>···</span> : children}
    </button>
  );
}