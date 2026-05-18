import React from "react";

/**
 * Slider com label de min/max/valor atual.
 * @param {{ value: number, min: number, max: number, step?: number, onChange: (v: number) => void, suffix?: string }} props
 */
export default function Slider({ value, min, max, step = 1, onChange, suffix = "" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
        <span>{min}{suffix}</span>
        <span className="text-slate-900">{value}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-slate-900"
      />
    </div>
  );
}
