import React from "react";
import { Plus, Highlighter, Copy, Check, ExternalLink, FileDown, Settings, User } from "lucide-react";

/**
 * Premium Frosted-Glass Header for MarkdownRenderKit in Light Theme.
 * @param {{ onInsertPageBreak: () => void, onInsertHighlight: () => void, onCopyHtml: () => void, onOpenPopup: () => void, onExportPdf: () => void, onToggleSettings: () => void, onToggleAbout: () => void, settingsOpen: boolean, copied: boolean }} props
 */
export default function Header({
  onInsertPageBreak,
  onInsertHighlight,
  onCopyHtml,
  onOpenPopup,
  onExportPdf,
  onToggleSettings,
  onToggleAbout,
  settingsOpen,
  copied,
}) {
  return (
    <header className="relative z-40 flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-5 py-3 backdrop-blur-md select-none">
      {/* Brand Logo and Title */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm">
          ✦ MD→PDF
        </span>
        <h1 className="text-lg font-black tracking-tight font-outfit bg-gradient-to-r from-slate-950 via-slate-900 to-slate-850 bg-clip-text text-transparent">
          Markdown<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">RenderKit</span>
        </h1>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-2">
        <button
          id="btn-pagebreak"
          onClick={onInsertPageBreak}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
          title="Inserir quebra de página para PDF"
        >
          <Plus className="h-3.5 w-3.5 text-indigo-500" /> 
          <span>Quebra</span>
        </button>
        
        <button
          id="btn-highlight"
          onClick={onInsertHighlight}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
          title="Destacar texto selecionado"
        >
          <Highlighter className="h-3.5 w-3.5 text-amber-500" />
          <span>Destaque</span>
        </button>

        <button
          id="btn-copy-html"
          onClick={onCopyHtml}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
          title="Copiar código HTML gerado"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span className="text-emerald-600">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-500" />
              <span>HTML</span>
            </>
          )}
        </button>
        
        <button
          id="btn-popup"
          onClick={onOpenPopup}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
          title="Abrir em uma nova janela de impressão"
        >
          <ExternalLink className="h-3.5 w-3.5 text-purple-500" />
          <span>Popup</span>
        </button>

        <button
          id="btn-export-pdf"
          onClick={onExportPdf}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 px-4 py-2 text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer shadow-md shadow-slate-900/10"
          title="Salvar ou Imprimir como PDF"
        >
          <FileDown className="h-3.5 w-3.5 text-indigo-400" />
          <span>PDF</span>
        </button>

        <div className="mx-1 h-5 w-px bg-slate-200" />

        {/* Sobre o Desenvolvedor Button */}
        <button
          id="btn-about"
          onClick={onToggleAbout}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3.5 py-2 text-xs font-bold active:scale-95 transition-all duration-200 cursor-pointer"
          title="Sobre o Desenvolvedor"
        >
          <User className="h-3.5 w-3.5 text-indigo-600" />
          <span>Sobre</span>
        </button>

        {/* Estilos Settings Button */}
        <button
          id="btn-toggle-settings"
          onClick={onToggleSettings}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-sm border ${
            settingsOpen
              ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-600/10 hover:bg-indigo-700"
              : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
          }`}
          title="Configurações de Estilos do PDF"
        >
          <Settings className={`h-3.5 w-3.5 ${settingsOpen ? "text-white animate-spin-slow" : "text-slate-500"}`} />
          <span>Estilos</span>
        </button>
      </div>
    </header>
  );
}
