import React from "react";

/**
 * Select estilizado.
 * @param {{ value: string, onChange: (value: string) => void, children: React.ReactNode }} props
 */
export default function Select({ value, onChange, children }) {
  return (
    <select
      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  );
}
