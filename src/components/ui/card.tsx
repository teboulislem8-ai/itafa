import type { ReactNode, CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  padding?: number | string;
  variant?: "default" | "diagnosis" | "lab" | "observation";
}

const variants: Record<string, CSSProperties> = {
  default: { borderLeft: "none" },
  diagnosis: { borderLeft: "3px solid var(--amber)" },
  lab: { borderLeft: "3px solid var(--green)" },
  observation: { borderLeft: "3px solid var(--blue)" },
};

export function Card({ children, style, padding = 20, variant = "default" }: CardProps) {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-md)",
        padding,
        fontFamily: "var(--font-body)",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </div>
  );
}