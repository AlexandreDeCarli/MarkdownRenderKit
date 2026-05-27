import React, { useState } from "react";
import { useMarkdownEditor } from "./hooks/useMarkdownEditor.js";
import Header from "./components/Header.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import EditorPane from "./components/EditorPane.jsx";
import PreviewPane from "./components/PreviewPane.jsx";
import AboutModal from "./components/AboutModal.jsx";

/**
 * Componente raiz do MarkdownRenderKit.
 * Orquestra os painéis, o cabeçalho, o painel de configurações e o modal de desenvolvedor.
 */
export default function App() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const {
    editorRef,
    previewRef,
    markdown,
    setMarkdown,
    settings,
    setSettings,
    copied,
    notice,
    settingsOpen,
    setSettingsOpen,
    mermaidVersion,
    renderedHtml,
    previewCss,
    updateSetting,
    applyPreset,
    insertAtCursor,
    copyHtml,
    openFormattedWindow,
    defaultSettings,
  } = useMarkdownEditor();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      <style>{previewCss}</style>

      {/* Notificação flutuante com design premium arredondado */}
      {notice ? (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-2xl bg-slate-900/95 px-5 py-3 text-xs font-bold text-white shadow-[0_12px_40px_-8px_rgba(15,23,42,0.3)] backdrop-blur-md animate-fade-in flex items-center gap-2 select-none border border-white/[0.06]">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>{notice}</span>
        </div>
      ) : null}

      <Header
        onInsertPageBreak={() => insertAtCursor("<!-- pagebreak -->")}
        onInsertHighlight={() => insertAtCursor("==texto destacado==")}
        onCopyHtml={copyHtml}
        onOpenPopup={() => openFormattedWindow()}
        onExportPdf={() => openFormattedWindow({ autoPrint: true })}
        onToggleSettings={() => setSettingsOpen(!settingsOpen)}
        onToggleAbout={() => setAboutOpen(true)}
        settingsOpen={settingsOpen}
        copied={copied}
      />

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onUpdate={updateSetting}
          onApplyPreset={applyPreset}
          onReset={() => setSettings(defaultSettings)}
        />
      )}

      {/* Main Split-Pane Workspace with premium clean division */}
      <main className="flex flex-1 overflow-hidden relative">
        <EditorPane
          markdown={markdown}
          onChange={setMarkdown}
          editorRef={editorRef}
        />
        
        {/* Soft elegant separator line */}
        <div className="w-[1.5px] bg-slate-200/80 shrink-0 self-stretch" />
        
        <PreviewPane
          renderedHtml={renderedHtml}
          mermaidVersion={mermaidVersion}
          previewRef={previewRef}
        />
      </main>

      {/* Modal Sobre o Desenvolvedor */}
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </div>
  );
}
