"use client";

import {
  CATEGORY_OPTIONS,
  COMFORT_TECH_OPTIONS,
  GENDER_OPTIONS,
  LOCALIZATION_MARKET_OPTIONS,
  PRICE_TIER_OPTIONS,
  type ShoeAttributes,
} from "@/lib/types";
import { SEED_EXAMPLES } from "@/lib/seedExamples";

interface Props {
  attrs: ShoeAttributes;
  onChange: (attrs: ShoeAttributes) => void;
  onSubmit: () => void;
  loading: boolean;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";

export function ShoeAttributeForm({ attrs, onChange, onSubmit, loading }: Props) {
  function set<K extends keyof ShoeAttributes>(key: K, value: ShoeAttributes[K]) {
    onChange({ ...attrs, [key]: value });
  }

  function toggleComfortTech(tech: string) {
    const has = attrs.comfortTech.includes(tech);
    set(
      "comfortTech",
      has ? attrs.comfortTech.filter((t) => t !== tech) : [...attrs.comfortTech, tech]
    );
  }

  return (
    <div className="flex h-full flex-col gap-5">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Shoe attributes</h2>
        <p className="mt-1 text-xs text-slate-500">
          Structured product data only. The model is instructed to never invent
          attributes not entered here.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SEED_EXAMPLES.map((ex) => {
          const selected = JSON.stringify(ex.attrs) === JSON.stringify(attrs);
          return (
            <button
              key={ex.label}
              type="button"
              onClick={() => onChange(ex.attrs)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                selected
                  ? "border-blue-900 bg-blue-900 text-white"
                  : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {ex.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Style name">
          <input
            className={inputClass}
            value={attrs.styleName}
            onChange={(e) => set("styleName", e.target.value)}
            placeholder="e.g. Glide Step Slip-ins — Arbor Trail"
          />
        </Field>

        <Field label="Category">
          <select
            className={inputClass}
            value={attrs.category}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="">Select…</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Gender">
          <select
            className={inputClass}
            value={attrs.gender}
            onChange={(e) => set("gender", e.target.value)}
          >
            <option value="">Select…</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Price tier">
          <select
            className={inputClass}
            value={attrs.priceTier}
            onChange={(e) => set("priceTier", e.target.value)}
          >
            <option value="">Select…</option>
            {PRICE_TIER_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Colorway">
          <input
            className={inputClass}
            value={attrs.colorway}
            onChange={(e) => set("colorway", e.target.value)}
            placeholder="e.g. Charcoal / Lime"
          />
        </Field>

        <Field label="Localization target market">
          <select
            className={inputClass}
            value={attrs.targetMarketForLocalization}
            onChange={(e) => set("targetMarketForLocalization", e.target.value)}
          >
            <option value="">Select…</option>
            {LOCALIZATION_MARKET_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Materials">
        <textarea
          className={inputClass}
          rows={2}
          value={attrs.materials}
          onChange={(e) => set("materials", e.target.value)}
          placeholder="e.g. Engineered mesh upper, synthetic overlays, rubber outsole"
        />
      </Field>

      <Field label="Use case">
        <textarea
          className={inputClass}
          rows={2}
          value={attrs.useCase}
          onChange={(e) => set("useCase", e.target.value)}
          placeholder="e.g. All-day standing and walking, retail and service jobs"
        />
      </Field>

      <div>
        <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Comfort technology
        </span>
        <div className="flex flex-wrap gap-3">
          {COMFORT_TECH_OPTIONS.map((tech) => {
            const checked = attrs.comfortTech.includes(tech);
            return (
              <label
                key={tech}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition ${
                  checked
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() => toggleComfortTech(tech)}
                />
                {tech}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Generating…" : "Generate copy"}
        </button>
      </div>
    </div>
  );
}
