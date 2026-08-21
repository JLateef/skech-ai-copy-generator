# SkechAI Product Copy Generator

A working MVP + reference architecture for a SkechAI use case: turning structured
shoe attributes into on-brand wholesale, DTC, and localized selling copy — grounded
only in the attributes provided, with governance metadata surfaced in the UI.

This repo has two parts:

- **The app** (this directory) — a runnable Next.js MVP.
- **[`/architecture`](./architecture)** — a reference architecture for how this use
  case productionizes on AWS: [`ARCHITECTURE.md`](./architecture/ARCHITECTURE.md)
  (walkthrough + Mermaid diagram + NFR mapping) and
  [`diagram.html`](./architecture/diagram.html) (standalone, screenshot-ready render
  of the same diagram).

## Setup

Requires Node.js 18.18+.

```bash
npm install
cp .env.example .env.local
# edit .env.local and set ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click one of the three seeded
example shoes on the left, then **Generate copy**. Output renders on the right as
Wholesale / DTC / Localized tabs, each with copy-to-clipboard, plus a Guardrails
panel showing the model's self-reported grounding/PII/missing-attribute signals and
which model produced the output.

If `ANTHROPIC_API_KEY` is missing or the API call fails, the UI shows a plain-language
error instead of crashing — safe to demo live even if the key isn't wired up yet.

### Model note

The model is a single constant in [`src/lib/anthropic.ts`](./src/lib/anthropic.ts),
defaulting to `claude-sonnet-5`. Set `ANTHROPIC_MODEL` in `.env.local` to point at a
higher-tier model (e.g. `claude-opus-5`) for a live demo — no code changes needed.
All Anthropic calls happen server-side only, in the `/api/generate` Route Handler
([`src/app/api/generate/route.ts`](./src/app/api/generate/route.ts)); the API key is
read from `process.env` and never reaches the client.

## File tree

```
src/
  app/
    api/generate/route.ts   # server-only Anthropic call, defensive JSON parse
    page.tsx                # form + output, two-column layout
    layout.tsx
  components/
    ShoeAttributeForm.tsx    # attribute inputs + seed-example loader
    GenerationOutput.tsx     # tabs, copy-to-clipboard, guardrails panel
  lib/
    anthropic.ts             # client + MODEL constant
    prompts.ts                # system prompt + user-message builder
    seedExamples.ts           # 3 illustrative example shoes
    types.ts                  # shared types + form option constants
architecture/
  ARCHITECTURE.md             # AWS productionization walkthrough + NFR mapping
  diagram.html                 # standalone Mermaid render (CDN, screenshot-ready)
.env.example
```

## Interview talking points

**Use-case intake → platform lead.** The form is a stand-in for a real intake
pattern: structured attributes in, channel-specific copy out, with a guardrail
contract enforced in the prompt itself. That's the shape of most SkechAI use cases
that would land on a Solutions Analyst's desk first — a repeatable content-generation
job around a specific product-data schema, not a one-off chatbot. The `MODEL`
constant and the model-agnostic router described in `ARCHITECTURE.md` are the same
idea at two different scales: swap the model without touching call sites.

**Grounding / PII → EU AI Act & GDPR posture.** The system prompt's HARD RULES
(attributes-only, no invented claims, flag missing attributes instead of fabricating,
flag PII-looking input) map directly to EU AI Act transparency/accuracy expectations
and GDPR data-minimization principles for a company selling into the EU. In the MVP
this is the model self-reporting via the `governance` JSON block, surfaced live in the
Guardrails panel — a deliberately honest scope: it's a signal, not a control. The
architecture doc calls that out explicitly and describes the production version
(Amazon Comprehend PII redaction pre-call, Bedrock Guardrails + an independent
grounding check post-call) as a named next seam, not a gap someone would discover
later.

**Integration seams → Nike.net × SAP × eCommerce/OMS background.** The
`ARCHITECTURE.md` diagram's **Product Data** box (SAP Product Master) and
**Delivery** box (OMS, storefront/PDP, wholesale line-sheet workflow, DTC CMS) are
the parts of this that look like prior retail-platform integration work: pulling
verified product data from a system of record instead of trusting free-text input,
and landing generated content in the systems that actually consume it — fulfillment,
storefront, and buyer-facing line sheets — rather than stopping at "the model
returned JSON."

**NFRs, mapped concretely, not abstractly.** Security, Scalability, Extensibility,
Adaptability, and Self-healing each point at a specific component in the diagram (see
the NFR table in `ARCHITECTURE.md`), so they're answerable in an interview as "here's
the box on the diagram," not as buzzwords.
