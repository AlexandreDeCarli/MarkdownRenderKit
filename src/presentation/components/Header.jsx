import React from "react";
import { Copy, Check, ExternalLink, FileDown, Settings, User, Loader2, PanelLeft, Columns2, PanelRight } from "lucide-react";

/**
 * Premium Frosted-Glass Header for MarkdownRenderKit in Light Theme.
 * @param {{
 *   onCopyHtml: () => void,
 *   onOpenPopup: () => void,
 *   onExportPdf: () => void,
 *   onToggleSettings: () => void,
 *   onToggleAbout: () => void,
 *   settingsOpen: boolean,
 *   copied: boolean,
 *   isExporting?: boolean,
 *   layoutMode?: "split" | "editor" | "preview",
 *   onLayoutModeChange?: (mode: "split" | "editor" | "preview") => void
 * }} props
 */
export default function Header({
  onCopyHtml,
  onOpenPopup,
  onExportPdf,
  onToggleSettings,
  onToggleAbout,
  settingsOpen,
  copied,
  isExporting = false,
  layoutMode = "split",
  onLayoutModeChange = () => {},
}) {
  return (
    <header className="relative z-40 flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-3 sm:px-5 py-2.5 sm:py-3 backdrop-blur-md select-none gap-2 overflow-x-auto custom-scrollbar">
      {/* Brand Logo and Title */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm">
          ✦ MD→PDF
        </span>
        <h1 className="text-base sm:text-lg font-black tracking-tight font-outfit bg-gradient-to-r from-slate-950 via-slate-900 to-slate-850 bg-clip-text text-transparent">
          Markdown<span className="hidden sm:inline bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">RenderKit</span>
        </h1>
      </div>

      {/* Segmented Control de Modo de Visualização */}
      <div className="flex items-center rounded-xl border border-slate-200/80 bg-slate-100/90 p-0.5 sm:p-1 shadow-inner shrink-0">
        <button
          id="btn-layout-editor"
          onClick={() => onLayoutModeChange("editor")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
            layoutMode === "editor"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
          title="Modo Foco: Apenas Editor Markdown (Alt+1)"
        >
          <PanelLeft className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Editor</span>
        </button>

        <button
          id="btn-layout-split"
          onClick={() => onLayoutModeChange("split")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
            layoutMode === "split"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
          title="Modo Dividido: Lado a Lado (Alt+0)"
        >
          <Columns2 className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Dividido</span>
        </button>

        <button
          id="btn-layout-preview"
          onClick={() => onLayoutModeChange("preview")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
            layoutMode === "preview"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
          title="Modo Visualização: Apenas Documento (Alt+2)"
        >
          <PanelRight className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Visualização</span>
        </button>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-2">

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
          disabled={isExporting}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 px-4 py-2 text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer shadow-md shadow-slate-900/10 disabled:opacity-75"
          title="Salvar ou Imprimir como PDF"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
              <span>Gerando...</span>
            </>
          ) : (
            <>
              <FileDown className="h-3.5 w-3.5 text-indigo-400" />
              <span>PDF</span>
            </>
          )}
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


