import Anthropic from "@anthropic-ai/sdk";

/**
 * Single knob for the model powering /api/generate. Swap to a higher-tier
 * model (e.g. "claude-opus-5") for the live demo by setting ANTHROPIC_MODEL
 * in the environment -- no code changes required.
 */
export const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

let cachedClient: Anthropic | null = null;

// Server-only: this module must never be imported from a Client Component.
// The API key is read from the environment and never sent to the browser.
export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server."
    );
  }
  if (!cachedClient) {
    cachedClient = new Anthropic({ apiKey });
  }
  return cachedClient;
}
