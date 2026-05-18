import React from "react";

const icons = {
  copy: "⧉",
  pdf: "⇩",
  highlight: "▣",
  popup: "↗",
  plus: "+",
  reset: "↺",
  type: "Aa",
  magic: "✦",
  gear: "⚙",
  close: "✕",
};

/**
 * Ícone inline baseado em nome de chave.
 * @param {{ name: string, className?: string }} props
 */
export default function Icon({ name, className = "" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center font-black leading-none ${className}`}
      aria-hidden="true"
    >
      {icons[name] || "•"}
    </span>
  );
}
