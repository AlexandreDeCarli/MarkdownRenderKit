import React from "react";

/**
 * Painel esquerdo: textarea do editor de markdown.
 * @param {{ markdown: string, onChange: (v: string) => void, editorRef: React.RefObject }} props
 */
export default function EditorPane({ markdown, onChange, editorRef }) {
  return (
    <section className="flex w-1/2 flex-col border-r border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
        <h2 className="text-sm font-black text-slate-950">Markdown</h2>
        <button
          id="btn-clear-editor"
          onClick={() => onChange("")}
          className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500 transition hover:bg-slate-200"
        >
          Limpar
        </button>
      </div>
      <textarea
        ref={editorRef}
        value={markdown}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 resize-none bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500"
        placeholder="Cole seu Markdown aqui..."
      />
    </section>
  );
}
