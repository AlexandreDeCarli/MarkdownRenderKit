import React from "react";
import Icon from "./Icon.jsx";

/**
 * Label + field wrapper para o painel de configurações.
 * @param {{ label: string, icon?: string, children: React.ReactNode }} props
 */
export default function Field({ label, children, icon }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-500 select-none">
        {icon ? <Icon name={icon} className="h-3.5 min-w-3.5 text-[11px]" /> : null}
        {label}
      </span>
      {children}
    </label>
  );
}
