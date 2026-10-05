"use client";

import { useState, type ReactNode } from "react";
import { Plus, X } from "lucide-react";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]";

export const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20";

const chipClass = (on: boolean, extra = "") =>
  `border text-xs font-medium transition-colors ${focus} ${extra} ${
    on
      ? "border-[#2563EB] bg-[#2563EB] text-white"
      : "border-gray-200 bg-white text-gray-600 hover:border-[#2563EB]/40"
  }`;

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

/** Label + single input. The child input should use the same id. */
export function Field({
  id, label, error, children,
}: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

/** Pick exactly one option (level, complexity). */
export function ChoiceGroup<T extends string>({
  id, legend, options, value, onChange, format = (o) => o, error,
}: {
  id: string; legend: string; options: readonly T[]; value: string;
  onChange: (v: T) => void; format?: (o: T) => string; error?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gray-700">{legend}</legend>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <button
            key={o} type="button" aria-pressed={value === o}
            onClick={() => onChange(o)} className={chipClass(value === o, "h-11 rounded-xl")}
          >
            {format(o)}
          </button>
        ))}
      </div>
      <ErrorText id={`${id}-error`} message={error} />
    </fieldset>
  );
}

/** Pick many from presets, plus add custom entries. */
export function TagPicker({
  id, legend, hint, presets, value, onChange, placeholder, error,
}: {
  id: string; legend: string; hint?: string; presets: readonly string[];
  value: string[]; onChange: (v: string[]) => void; placeholder: string; error?: string;
}) {
  const [draft, setDraft] = useState("");
  const custom = value.filter((v) => !presets.includes(v));

  const toggle = (tag: string) =>
    onChange(value.includes(tag) ? value.filter((v) => v !== tag) : [...value, tag]);

  const addDraft = () => {
    const text = draft.trim();
    setDraft("");
    if (!text) return;
    // Reuse a preset's spelling ("python" -> "Python") and ignore duplicates.
    const match = [...presets, ...value].find((v) => v.toLowerCase() === text.toLowerCase());
    const tag = match ?? text;
    if (!value.includes(tag)) onChange([...value, tag]);
  };

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gray-700">{legend}</legend>
      {hint && <p className="mb-3 text-xs text-gray-500">{hint}</p>}
      <div className="mb-3 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p} type="button" aria-pressed={value.includes(p)}
            onClick={() => toggle(p)} className={chipClass(value.includes(p), "rounded-full px-3 py-1.5")}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          id={id} value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDraft(); } }}
          placeholder={placeholder} aria-label={`Add custom ${legend.toLowerCase()}`}
          className={`${inputClass} h-11 flex-1 px-3`}
        />
        <button
          type="button" onClick={addDraft} aria-label={`Add ${legend.toLowerCase()}`}
          className={`flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#2563EB]/40 ${focus}`}
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {custom.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {custom.map((tag) => (
            <li key={tag} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
              {tag}
              <button type="button" aria-label={`Remove ${tag}`} onClick={() => toggle(tag)} className={focus}>
                <X className="h-3 w-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <ErrorText id={`${id}-error`} message={error} />
    </fieldset>
  );
}