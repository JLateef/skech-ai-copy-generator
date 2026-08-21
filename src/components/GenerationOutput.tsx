"use client";

import { useState } from "react";
import type { GenerateResult } from "@/lib/types";

type Tab = "wholesale" | "dtc" | "localized";

const TABS: { key: Tab; label: string }[] = [
  { key: "wholesale", label: "Wholesale" },
  { key: "dtc", label: "DTC" },
  { key: "localized", label: "Localized" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function wholesaleText(data: GenerateResult) {
  return [
    data.wholesale.headline,
    "",
    data.wholesale.description,
    "",
    ...data.wholesale.keySellingPoints.map((b) => `• ${b}`),
  ].join("\n");
}

function dtcText(data: GenerateResult) {
  return [
    data.dtc.title,
    "",
    data.dtc.body,
    "",
    ...data.dtc.bullets.map((b) => `• ${b}`),
    "",
    `SEO keywords: ${data.dtc.seoKeywords.join(", ")}`,
  ].join("\n");
}

function localizedText(data: GenerateResult) {
  return [
    `Market: ${data.localized.market} (${data.localized.language})`,
    "",
    data.localized.description,
  ].join("\n");
}

export function GenerationOutput({
  data,
  model,
  error,
  loading,
}: {
  data: GenerateResult | null;
  model: string | null;
  error: string | null;
  loading: boolean;
}) {
  const [tab, setTab] = useState<Tab>("wholesale");

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        Generating copy…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-md rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Generation failed</p>
          <p className="mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
        Load an example or fill in the attribute form, then click{" "}
        <span className="mx-1 font-medium text-slate-700">Generate copy</span> to see
        wholesale, DTC, and localized output here.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-md bg-slate-100 p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
                tab === t.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {model && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
            Powered by {model}
          </span>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        {tab === "wholesale" && (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900">
                {data.wholesale.headline}
              </h3>
              <CopyButton text={wholesaleText(data)} />
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              {data.wholesale.description}
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              {data.wholesale.keySellingPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {tab === "dtc" && (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900">{data.dtc.title}</h3>
              <CopyButton text={dtcText(data)} />
            </div>
            <p className="text-sm leading-relaxed text-slate-700">{data.dtc.body}</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              {data.dtc.bullets.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.dtc.seoKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === "localized" && (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900">
                {data.localized.market}{" "}
                <span className="font-normal text-slate-400">
                  ({data.localized.language})
                </span>
              </h3>
              <CopyButton text={localizedText(data)} />
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              {data.localized.description}
            </p>
          </div>
        )}
      </div>

      <GuardrailsPanel data={data} />
    </div>
  );
}

function GuardrailsPanel({ data }: { data: GenerateResult }) {
  const g = data.governance;
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Guardrails
      </h4>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <StatusDot ok={g.groundedInInputsOnly} />
          <span>
            Grounded in inputs only:{" "}
            <span className="font-medium text-slate-900">
              {g.groundedInInputsOnly ? "Yes" : "No"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <StatusDot ok={!g.piiDetected} warnLabel="PII flagged" />
          <span>
            PII detected:{" "}
            <span className="font-medium text-slate-900">
              {g.piiDetected ? "Yes" : "No"}
            </span>
          </span>
        </div>
        <div className="text-sm text-slate-700">
          <span className="text-slate-500">Unsupported claims removed:</span>{" "}
          {g.unsupportedClaimsRemoved.length ? (
            <span className="font-medium text-slate-900">
              {g.unsupportedClaimsRemoved.join(", ")}
            </span>
          ) : (
            <span className="text-slate-400">none</span>
          )}
        </div>
        <div className="text-sm text-slate-700">
          <span className="text-slate-500">Missing attributes:</span>{" "}
          {g.missingAttributes.length ? (
            <span className="font-medium text-slate-900">
              {g.missingAttributes.join(", ")}
            </span>
          ) : (
            <span className="text-slate-400">none</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusDot({ ok, warnLabel }: { ok: boolean; warnLabel?: string }) {
  return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-500"}`}
      title={ok ? undefined : warnLabel}
    />
  );
}
