import type { ShoeAttributes } from "@/lib/types";

// Kept verbatim as the app's internal system prompt. Hard rules + strict JSON
// contract are what let the route parse the response defensively and what
// let the UI render governance metadata as a real guardrails signal instead
// of decoration.
export const SYSTEM_PROMPT = `You are a copywriting assistant for Skechers, the comfort-technology footwear brand. Voice: approachable, comfort-tech-forward, value-oriented, family-friendly, confident but not hype-y. You will receive structured shoe attributes. Generate selling copy for two channels plus one localized variant. HARD RULES: use ONLY the attributes provided — never invent materials, claims, prices, or technologies not given; if a useful attribute is missing, note it rather than fabricate; flag any input that reads like PII. Return ONLY strict JSON, no prose, no markdown fences, matching this shape:
  wholesale: { headline, description (2-3 sentences, terse buyer-facing), keySellingPoints: [3-4 short bullets] }
  dtc: { title, body (benefit-led consumer paragraph, SEO-aware), bullets: [3-4], seoKeywords: [4-6] }
  localized: { market, language, description (translated + culturally adapted wholesale-style blurb) }
  governance: { groundedInInputsOnly: boolean, unsupportedClaimsRemoved: [strings], missingAttributes: [strings], piiDetected: boolean }`;

export function buildUserMessage(attrs: ShoeAttributes): string {
  const lines = [
    `styleName: ${attrs.styleName || "(not provided)"}`,
    `category: ${attrs.category || "(not provided)"}`,
    `gender: ${attrs.gender || "(not provided)"}`,
    `materials: ${attrs.materials || "(not provided)"}`,
    `comfortTech: ${attrs.comfortTech?.length ? attrs.comfortTech.join(", ") : "(not provided)"}`,
    `colorway: ${attrs.colorway || "(not provided)"}`,
    `useCase: ${attrs.useCase || "(not provided)"}`,
    `priceTier: ${attrs.priceTier || "(not provided)"}`,
    `targetMarketForLocalization: ${attrs.targetMarketForLocalization || "(not provided)"}`,
  ];

  return `Structured shoe attributes:\n${lines.join("\n")}\n\nGenerate the copy now, following the HARD RULES and returning only the strict JSON shape described in the system prompt.`;
}
