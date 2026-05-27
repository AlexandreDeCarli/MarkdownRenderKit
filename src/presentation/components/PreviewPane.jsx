import React from "react";
import { Eye } from "lucide-react";

/**
 * Premium Right Panel: Live HTML formatted preview.
 * @param {{ renderedHtml: string, mermaidVersion: number, previewRef: React.RefObject }} props
 */
export default function PreviewPane({ renderedHtml, mermaidVersion, previewRef }) {
  return (
    <section className="flex w-1/2 flex-col bg-white">
      {/* Pane Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3 select-none">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-indigo-500" />
          <h2 className="text-sm font-bold font-outfit text-slate-800 tracking-tight">Visualização Formatada</h2>
        </div>
        <span className="rounded-full border border-indigo-100/80 bg-indigo-50/60 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 shadow-sm">
          HTML + CSS Embutido
        </span>
      </div>
      
      {/* Document Preview Box */}
      <div className="flex-1 overflow-auto bg-slate-100/50 p-6 custom-scrollbar">
        <article
          key={mermaidVersion}
          ref={previewRef}
          className="formatted-document mx-auto max-w-[800px] shadow-sm rounded-2xl bg-white border border-slate-200/40 p-10 transition-all duration-300"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>
    </section>
  );
}
