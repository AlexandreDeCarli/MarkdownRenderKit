import React from "react";

/**
 * Input de cor com seletor nativo + campo de texto hex.
 * @param {{ value: string, onChange: (value: string) => void }} props
 */
export default function ColorInput({ value, onChange }) {
  const safeValue = /^#[0-9a-f]{6}$/i.test(value || "") ? value : "#000000";

  return (
    <div className="group flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white p-1 pr-1.5 shadow-2xs transition-all hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
      <label className="relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded border border-slate-300/80 shadow-2xs transition-transform group-hover:scale-105">
        <input
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
        />
        <span
          className="h-full w-full rounded"
          style={{ backgroundColor: safeValue }}
        />
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent font-mono text-[10.5px] font-bold uppercase tracking-tight text-slate-700 outline-none"
        maxLength={7}
        spellCheck={false}
      />
    </div>
  );
}
