import React from "react";

/**
 * Slider com label de min/max/valor atual.
 * @param {{ value: number, min: number, max: number, step?: number, onChange: (v: number) => void, suffix?: string }} props
 */
export default function Slider({ value, min, max, step = 1, onChange, suffix = "" }) {
  return (
    <div className="rounded-lg border border-slate-200/90 bg-white px-2.5 py-1.5 shadow-2xs transition-all hover:border-slate-300">
      <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-slate-400 select-none">
        <span>{min}{suffix}</span>
        <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] font-bold text-indigo-600">
          {value}{suffix}
        </span>
        <span>{max}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-indigo-600 outline-none transition-all block"
      />
    </div>
  );
}
