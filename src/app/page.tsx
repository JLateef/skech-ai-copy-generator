"use client";

import { useState } from "react";
import { ShoeAttributeForm } from "@/components/ShoeAttributeForm";
import { GenerationOutput } from "@/components/GenerationOutput";
import { SEED_EXAMPLES } from "@/lib/seedExamples";
import type { GenerateApiResponse, GenerateResult, ShoeAttributes } from "@/lib/types";

export default function Home() {
  const [attrs, setAttrs] = useState<ShoeAttributes>(SEED_EXAMPLES[0].attrs);
  const [data, setData] = useState<GenerateResult | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attrs),
      });

      let body: GenerateApiResponse;
      try {
        body = await res.json();
      } catch {
        throw new Error("The server returned an unexpected response.");
      }

      if (!res.ok || !body.ok || !body.data) {
        throw new Error(body.error || `Request failed with status ${res.status}.`);
      }

      setData(body.data);
      setModel(body.model ?? null);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            SkechAI · Internal Demo
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">
            Product Copy Generator
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Structured shoe attributes in, on-brand wholesale + DTC + localized selling
            copy out — grounded only in what you enter.
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <ShoeAttributeForm
            attrs={attrs}
            onChange={setAttrs}
            onSubmit={handleGenerate}
            loading={loading}
          />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <GenerationOutput data={data} model={model} error={error} loading={loading} />
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        Illustrative demo — shoe styles are not real Skechers SKUs.
      </footer>
    </div>
  );
}
