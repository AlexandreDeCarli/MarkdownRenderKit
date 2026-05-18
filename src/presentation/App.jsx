import React from "react";
import { useMarkdownEditor } from "./hooks/useMarkdownEditor.js";
import Header from "./components/Header.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import EditorPane from "./components/EditorPane.jsx";
import PreviewPane from "./components/PreviewPane.jsx";

/**
 * Componente raiz do MarkdownRenderKit.
 * Orquestra os painéis, o cabeçalho e o painel de configurações.
 */
export default function App() {
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
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
      <style>{previewCss}</style>

      {notice ? (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl">
          {notice}
        </div>
      ) : null}

      <Header
        onInsertPageBreak={() => insertAtCursor("<!-- pagebreak -->")}
        onInsertHighlight={() => insertAtCursor("==texto destacado==")}
        onCopyHtml={copyHtml}
        onOpenPopup={() => openFormattedWindow()}
        onExportPdf={() => openFormattedWindow({ autoPrint: true })}
        onToggleSettings={() => setSettingsOpen(!settingsOpen)}
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

      <main className="flex flex-1 overflow-hidden">
        <EditorPane
          markdown={markdown}
          onChange={setMarkdown}
          editorRef={editorRef}
        />
        <PreviewPane
          renderedHtml={renderedHtml}
          mermaidVersion={mermaidVersion}
          previewRef={previewRef}
        />
      </main>
    </div>
  );
}
