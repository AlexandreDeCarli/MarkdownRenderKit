import React from "react";

/**
 * Input de cor com seletor nativo + campo de texto hex.
 * @param {{ value: string, onChange: (value: string) => void }} props
 */
export default function ColorInput({ value, onChange }) {
  const safeValue = /^#[0-9a-f]{6}$/i.test(value || "") ? value : "#000000";

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <input
        type="color"
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none"
      />
    </div>
  );
}
