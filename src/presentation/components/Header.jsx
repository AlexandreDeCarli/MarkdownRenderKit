import React from "react";
import Icon from "./Icon.jsx";

/**
 * Barra de cabeçalho do app com logo e ações.
 * @param {{ onInsertPageBreak: () => void, onInsertHighlight: () => void, onCopyHtml: () => void, onOpenPopup: () => void, onExportPdf: () => void, onToggleSettings: () => void, settingsOpen: boolean, copied: boolean }} props
 */
export default function Header({
  onInsertPageBreak,
  onInsertHighlight,
  onCopyHtml,
  onOpenPopup,
  onExportPdf,
  onToggleSettings,
  settingsOpen,
  copied,
}) {
  return (
    <header className="relative z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-2.5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
          <Icon name="magic" className="text-[11px]" /> MD→PDF
        </span>
        <h1 className="text-base font-black tracking-tight text-slate-950">MarkdownRenderKit</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          id="btn-pagebreak"
          onClick={onInsertPageBreak}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          <Icon name="plus" className="text-[13px]" /> Quebra
        </button>
        <button
          id="btn-highlight"
          onClick={onInsertHighlight}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          <Icon name="highlight" className="text-[13px]" /> Destaque
        </button>
        <button
          id="btn-copy-html"
          onClick={onCopyHtml}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          <Icon name="copy" className="text-[13px]" /> {copied ? "Copiado!" : "HTML"}
        </button>
        <button
          id="btn-popup"
          onClick={onOpenPopup}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          <Icon name="popup" className="text-[13px]" /> Popup
        </button>
        <button
          id="btn-export-pdf"
          onClick={onExportPdf}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800"
        >
          <Icon name="pdf" className="text-[13px]" /> PDF
        </button>

        <div className="mx-1 h-5 w-px bg-slate-200" />

        <button
          id="btn-toggle-settings"
          onClick={onToggleSettings}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ring-1 ${
            settingsOpen
              ? "bg-slate-950 text-white ring-slate-950"
              : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          <Icon name={settingsOpen ? "close" : "gear"} className="text-[13px]" /> Estilos
        </button>
      </div>
    </header>
  );
}
