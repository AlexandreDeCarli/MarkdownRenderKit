import React from "react";

/**
 * Select estilizado.
 * @param {{ value: string, onChange: (value: string) => void, children: React.ReactNode }} props
 */
export default function Select({ value, onChange, children }) {
  return (
    <div className="relative">
      <select
        className="w-full appearance-none rounded-lg border border-slate-200/90 bg-white px-2.5 py-1.5 pr-7 text-xs font-medium text-slate-800 shadow-2xs outline-none transition-all hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
