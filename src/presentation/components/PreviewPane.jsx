import React from "react";

/**
 * Painel direito: preview renderizado do markdown.
 * @param {{ renderedHtml: string, mermaidVersion: number, previewRef: React.RefObject }} props
 */
export default function PreviewPane({ renderedHtml, mermaidVersion, previewRef }) {
  return (
    <section className="flex w-1/2 flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
        <h2 className="text-sm font-black text-slate-950">Preview</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-400">
          HTML + CSS embutido
        </span>
      </div>
      <div className="flex-1 overflow-auto bg-slate-200/50 p-4">
        <article
          key={mermaidVersion}
          ref={previewRef}
          className="formatted-document"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>
    </section>
  );
}
