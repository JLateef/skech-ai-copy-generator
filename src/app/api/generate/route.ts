import { NextResponse } from "next/server";
import { getAnthropicClient, MODEL } from "@/lib/anthropic";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompts";
import type { GenerateResult, ShoeAttributes } from "@/lib/types";

// Server-side only. The Anthropic API key never reaches the client -- the
// browser only ever talks to this Route Handler.
export async function POST(request: Request) {
  let attrs: ShoeAttributes;
  try {
    attrs = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!attrs?.styleName?.trim()) {
    return NextResponse.json(
      { ok: false, error: "styleName is required." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ANTHROPIC_API_KEY is not configured on the server. Add it to .env.local and restart the dev server.",
      },
      { status: 500 }
    );
  }

  try {
    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1800,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(attrs) }],
    });

    const raw = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n");

    const parsed = parseModelJson(raw);
    if (!parsed) {
      return NextResponse.json(
        {
          ok: false,
          error: "The model's response could not be parsed as JSON. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, model: MODEL, data: parsed });
  } catch (err) {
    console.error("[/api/generate] generation failed:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: `Generation failed: ${detail}` },
      { status: 502 }
    );
  }
}

// Defensive parse: strip stray markdown fences and, failing a clean parse,
// fall back to slicing the outermost {...} span before giving up.
function parseModelJson(raw: string): GenerateResult | null {
  const stripped = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(stripped) as GenerateResult;
  } catch {
    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(stripped.slice(start, end + 1)) as GenerateResult;
      } catch {
        return null;
      }
    }
    return null;
  }
}
