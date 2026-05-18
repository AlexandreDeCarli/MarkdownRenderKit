import React from "react";
import Icon from "./Icon.jsx";

/**
 * Label + field wrapper para o painel de configurações.
 * @param {{ label: string, icon?: string, children: React.ReactNode }} props
 */
export default function Field({ label, children, icon }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        {icon ? <Icon name={icon} className="h-4 min-w-4 text-[12px]" /> : null}
        {label}
      </span>
      {children}
    </label>
  );
}
