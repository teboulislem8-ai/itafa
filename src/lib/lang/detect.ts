import type { DetectedLang } from "@/types/ai";

const ARABIC_RE = /\p{Script_Extensions=Arabic}/u;

const FRENCH_STOP = new Set([
  "je", "tu", "il", "elle", "nous", "vous", "ils", "elles",
  "le", "la", "les", "un", "une", "des", "du", "au", "aux",
  "ce", "cet", "cette", "ces", "son", "sa", "ses",
  "mon", "ton", "ma", "ta", "mes", "tes",
  "notre", "votre", "leur", "nos", "vos", "leurs",
  "et", "ou", "mais", "donc", "car", "ni", "or",
  "que", "qui", "dont", "où", "quand", "comment", "pourquoi",
  "pour", "avec", "sans", "dans", "sur", "sous", "entre", "parmi", "vers",
  "depuis", "pendant", "durant", "jusque", "chez",
  "bien", "très", "assez", "trop", "peu", "beaucoup", "plus", "moins",
  "bonjour", "bonsoir", "merci", "svp", "s'il", "oui", "non",
  "est", "sont", "avez", "ont", "faire", "fait", "peut", "peuvent",
  "voulez", "pouvez", "doit", "doivent", "sait", "savent",
  "chaque", "quelque", "plusieurs", "tout", "tous", "toute", "toutes",
]);

const ENGLISH_STOP = new Set([
  "i", "you", "he", "she", "it", "we", "they",
  "me", "him", "her", "us", "them",
  "my", "your", "his", "its", "our", "their",
  "mine", "yours", "hers", "its", "ours", "theirs",
  "this", "that", "these", "those",
  "a", "an", "the",
  "and", "but", "or", "because", "so", "if", "when", "where", "why", "how",
  "who", "whom", "which", "what",
  "hello", "hi", "thank", "please", "yes", "no",
  "is", "are", "was", "were", "been", "being",
  "have", "has", "had", "do", "does", "did",
  "can", "could", "will", "would", "shall", "should", "may", "might",
  "to", "for", "with", "without", "in", "on", "at", "by", "from",
  "about", "into", "through", "during", "before", "after",
  "very", "really", "quite", "some", "any", "every", "all", "each", "both",
  "more", "most", "much", "many", "few", "less",
]);

export function detectLanguage(text: string): DetectedLang {
  const trimmed = text.trim();
  if (!trimmed) return "fr";

  if (ARABIC_RE.test(trimmed)) return "ar";

  const tokens = trimmed
    .toLowerCase()
    .replace(/[^a-zéèêëàâäîïôöùûüç\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  let frScore = 0;
  let enScore = 0;

  for (const t of tokens) {
    if (FRENCH_STOP.has(t)) frScore++;
    if (ENGLISH_STOP.has(t)) enScore++;
  }

  if (frScore > enScore) return "fr";
  if (enScore > frScore) return "en";

  const frExclusive = tokens.filter((t) => FRENCH_STOP.has(t) && !ENGLISH_STOP.has(t)).length;
  const enExclusive = tokens.filter((t) => ENGLISH_STOP.has(t) && !FRENCH_STOP.has(t)).length;

  if (frExclusive > enExclusive) return "fr";
  if (enExclusive > frExclusive) return "en";

  return "fr";
}
