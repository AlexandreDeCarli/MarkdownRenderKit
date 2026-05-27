import React from "react";
import { Trash2, FileEdit } from "lucide-react";

/**
 * Premium Left Panel: Markdown source editor text area.
 * @param {{ markdown: string, onChange: (v: string) => void, editorRef: React.RefObject }} props
 */
export default function EditorPane({ markdown, onChange, editorRef }) {
  return (
    <section className="flex w-1/2 flex-col bg-white">
      {/* Pane Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3 select-none">
        <div className="flex items-center gap-2">
          <FileEdit className="h-4 w-4 text-indigo-500" />
          <h2 className="text-sm font-bold font-outfit text-slate-800 tracking-tight">Fonte Markdown</h2>
        </div>
        <button
          id="btn-clear-editor"
          onClick={() => onChange("")}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
          title="Limpar editor"
        >
          <Trash2 className="h-3 w-3" />
          <span>Limpar</span>
        </button>
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
