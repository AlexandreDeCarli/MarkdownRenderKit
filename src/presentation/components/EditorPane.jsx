import React from "react";
import { Trash2, FileEdit, Plus, Highlighter, Table, Loader2, PanelLeftClose, Columns2 } from "lucide-react";

/**
 * Premium Left Panel: Markdown source editor text area.
 * @param {{
 *   markdown: string,
 *   onChange: (v: string) => void,
 *   editorRef: React.RefObject,
 *   onInsertPageBreak: () => void,
 *   onInsertHighlight: () => void,
 *   onValidateTables: () => void,
 *   isValidatingTables?: boolean,
 *   isCollapsed?: boolean,
 *   isOnlyVisible?: boolean,
 *   onToggleCollapse?: () => void
 * }} props
 */
export default function EditorPane({
  markdown,
  onChange,
  editorRef,
  onInsertPageBreak,
  onInsertHighlight,
  onValidateTables,
  isValidatingTables = false,
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
          <FileEdit className="h-4 w-4 text-indigo-500 shrink-0" />
          <h2 className="text-xs sm:text-sm font-bold font-outfit text-slate-800 tracking-tight truncate">Fonte Markdown</h2>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            id="btn-pagebreak"
            onClick={onInsertPageBreak}
            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200/80 bg-white px-2 sm:px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
            title="Inserir quebra de página para PDF"
          >
            <Plus className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="hidden sm:inline">Quebra</span>
          </button>

          <button
            id="btn-highlight"
            onClick={onInsertHighlight}
            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200/80 bg-white px-2 sm:px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
            title="Destacar texto selecionado"
          >
            <Highlighter className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="hidden sm:inline">Destaque</span>
          </button>

          <button
            id="btn-validate-tables"
            onClick={onValidateTables}
            disabled={isValidatingTables}
            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200/80 bg-white px-2 sm:px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-75"
            title="Validar se as tabelas estão consistentes (células vs cabeçalho)"
          >
            {isValidatingTables ? (
              <>
                <Loader2 className="h-3.5 w-3.5 text-indigo-600 animate-spin shrink-0" />
                <span className="hidden md:inline">Verificando...</span>
              </>
            ) : (
              <>
                <Table className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                <span className="hidden md:inline">Tabelas</span>
              </>
            )}
          </button>

          <div className="mx-0.5 sm:mx-1 h-4 w-px bg-slate-200 shrink-0" />

          <button
            id="btn-clear-editor"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 sm:px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            title="Limpar editor"
          >
            <Trash2 className="h-3 w-3 shrink-0" />
            <span className="hidden lg:inline">Limpar</span>
          </button>

          <div className="mx-0.5 sm:mx-1 h-4 w-px bg-slate-200 shrink-0" />

          {isOnlyVisible ? (
            <button
              id="btn-split-editor"
              onClick={onToggleCollapse}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
              title="Dividir tela (mostrar visualização formatada - Alt+0)"
            >
              <Columns2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span className="hidden sm:inline">Dividir</span>
            </button>
          ) : (
            <button
              id="btn-collapse-editor"
              onClick={onToggleCollapse}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200 bg-white px-2 sm:px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
              title="Recolher editor (focar na visualização - Alt+2)"
            >
              <PanelLeftClose className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="hidden xl:inline">Recolher</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Markdown Text Area */}
      <textarea
        ref={editorRef}
        value={markdown}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 resize-none bg-[#0B0F19] p-6 font-mono text-[13px] leading-7 text-slate-100 outline-none placeholder:text-slate-600 custom-scrollbar shadow-inner"
        placeholder="Digite ou cole seu Markdown aqui..."
      />
    </section>
  );
}
