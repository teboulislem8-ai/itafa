import type { ReactNode } from "react";

export function renderText(text: string): ReactNode[] {
  text = text
    .replace(/([.!?:;)])\s*\*\s+/g, "$1 ")
    .replace(/^\*\s+/gm, "");
  const parts: ReactNode[] = [];
  const regex = /\*\*([\s\S]+?)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    parts.push(
      <span key={match.index} className="ita-bold-highlight">
        {match[1].replace(/^\*+|\*+$/g, "")}
      </span>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts.length > 0 ? parts : [text];
}
