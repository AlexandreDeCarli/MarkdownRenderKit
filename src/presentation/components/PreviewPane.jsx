import React from "react";
import { Eye, Loader2, Sparkles, PanelRightClose, PanelLeftOpen, Columns2 } from "lucide-react";

/**
 * Premium Right Panel: Live HTML formatted preview.
 * Exibe a renderização em tempo real e indicadores visuais para processamento de documentos pesados.
 * @param {{
 *   renderedHtml: string,
 *   previewRef: React.RefObject,
 *   previewContainerRef: React.RefObject,
 *   isParsing?: boolean,
 *   mermaidProgress?: { isRendering: boolean, current: number, total: number },
 *   isCollapsed?: boolean,
 *   isOnlyVisible?: boolean,
 *   onToggleCollapse?: () => void
 * }} props
 */
const DocumentContent = React.memo(function DocumentContent({ html, previewRef }) {
  return (
    <article
      ref={previewRef}
      className="formatted-document mx-auto max-w-[800px] shadow-sm rounded-2xl bg-white border border-slate-200/40 p-10 transition-colors duration-200"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

export default function PreviewPane({
  renderedHtml,
  previewRef,
  previewContainerRef,
  isParsing = false,
  mermaidProgress = { isRendering: false, current: 0, total: 0 },
  isCollapsed = false,
  isOnlyVisible = false,
  onToggleCollapse = () => {},
}) {
  return (
    <section
      className={`flex flex-col bg-white min-w-0 transition-all duration-200 ${
        isCollapsed ? "hidden" : isOnlyVisible ? "w-full flex-1" : "w-1/2 flex-1"
      }`}
    >
      {/* Pane Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 sm:px-5 py-2.5 sm:py-3 select-none gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {isOnlyVisible && (
            <button
              id="btn-restore-editor-left"
              onClick={onToggleCollapse}
              className="mr-1 inline-flex items-center gap-1.5 rounded-xl border border-indigo-200/90 bg-indigo-50/90 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm shrink-0"
              title="Expandir editor Markdown (Alt+1 ou Alt+0)"
            >
              <PanelLeftOpen className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span className="hidden sm:inline">Editor</span>
            </button>
          )}
          <Eye className="h-4 w-4 text-indigo-500 shrink-0" />
          <h2 className="text-xs sm:text-sm font-bold font-outfit text-slate-800 tracking-tight truncate">Visualização Formatada</h2>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Status Indicator Badge */}
          {isParsing ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 sm:px-2.5 py-1 text-[10px] font-bold text-amber-700 shadow-sm animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin text-amber-600 shrink-0" />
              <span className="hidden sm:inline">Processando...</span>
            </span>
          ) : mermaidProgress.isRendering ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2 sm:px-2.5 py-1 text-[10px] font-bold text-indigo-700 shadow-sm">
              <Loader2 className="h-3 w-3 animate-spin text-indigo-600 shrink-0" />
              <span className="hidden sm:inline">Diagramas ({mermaidProgress.current}/{mermaidProgress.total})</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex rounded-full border border-indigo-100/80 bg-indigo-50/60 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 shadow-sm">
              HTML + CSS Embutido
            </span>
          )}

          <div className="mx-0.5 sm:mx-1 h-4 w-px bg-slate-200 shrink-0" />

          {isOnlyVisible ? (
            <button
              id="btn-split-preview"
              onClick={onToggleCollapse}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
              title="Dividir tela (mostrar editor Markdown - Alt+0)"
            >
              <Columns2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span className="hidden sm:inline">Dividir</span>
            </button>
          ) : (
            <button
              id="btn-collapse-preview"
              onClick={onToggleCollapse}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200 bg-white px-2 sm:px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
              title="Recolher visualização (modo foco no editor - Alt+1)"
            >
              <PanelRightClose className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="hidden xl:inline">Recolher</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Document Preview Box */}
      <div
        ref={previewContainerRef}
        className="flex-1 overflow-auto bg-slate-100/50 p-6 custom-scrollbar relative"
      >
        {/* Floating progress pill during heavy document processing */}
        {(isParsing || mermaidProgress.isRendering) && (
          <div className="sticky top-2 float-right z-30 mr-2 -mb-8 flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-3.5 py-1.5 shadow-md backdrop-blur-md text-xs font-semibold text-slate-700 animate-fade-in pointer-events-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            {isParsing ? (
              <span>Processando documento...</span>
            ) : (
              <span>Renderizando diagramas ({mermaidProgress.current}/{mermaidProgress.total})...</span>
            )}
          </div>
        )}

        {/* Document Content isolado e memoizado: nunca é destruído ou resetado por atualizações de progresso */}
        <DocumentContent html={renderedHtml} previewRef={previewRef} />
      </div>
    </section>
  );
}

