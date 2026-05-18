import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import mermaid from "mermaid";
import { starterMarkdown } from "../../domain/starterMarkdown.js";
import { defaultSettings } from "../../domain/entities/settings.js";
import { renderMarkdown } from "../../application/markdownProcessor.js";
import { buildCss } from "../../application/cssBuilder.js";
import { buildMermaidThemeVars } from "../../application/mermaidService.js";
import { createFullHtml } from "../../application/htmlExporter.js";
import { loadSettings, saveSettings } from "../../infrastructure/settingsRepository.js";
import { copyToClipboard } from "../../infrastructure/clipboardService.js";

/**
 * Hook principal que encapsula toda a lógica do editor de markdown.
 * @returns {Object} estado e handlers para o componente App
 */
export function useMarkdownEditor() {
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const mermaidVersionRef = useRef(0);

  const [markdown, setMarkdown] = useState(starterMarkdown);
  const [debouncedMarkdown, setDebouncedMarkdown] = useState(starterMarkdown);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mermaidVersion, setMermaidVersion] = useState(0);
  const [settings, setSettings] = useState(() => loadSettings());

  // Debounce markdown rendering (500ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMarkdown(markdown), 500);
    return () => clearTimeout(timer);
  }, [markdown]);

  // Debounce localStorage save (500ms)
  useEffect(() => {
    const timer = setTimeout(() => saveSettings(settings), 500);
    return () => clearTimeout(timer);
  }, [settings]);

  const renderedHtml = useMemo(() => renderMarkdown(debouncedMarkdown), [debouncedMarkdown]);
  const previewCss = useMemo(() => buildCss(settings, false), [settings]);

  const renderMermaidBlocks = useCallback(async () => {
    const container = previewRef.current;
    if (!container) return;

    const darkPaper = settings.paperBg.toLowerCase() === "#0f172a" || settings.paperBg.toLowerCase() === "#020617";
    const mermaidConfig = buildMermaidThemeVars(settings, darkPaper);

    mermaid.initialize({ startOnLoad: false, ...mermaidConfig });

    const blocks = container.querySelectorAll(".mermaid-block[data-mermaid]");
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      try {
        const code = decodeURIComponent(block.getAttribute("data-mermaid"));
        const id = `mermaid-preview-${Date.now()}-${i}`;
        const { svg } = await mermaid.render(id, code);
        block.innerHTML = svg;
      } catch (error) {
        console.warn("Mermaid render error:", error);
        block.innerHTML = `<pre style="color:#ef4444;text-align:left;font-size:0.85em">Erro ao renderizar diagrama Mermaid:\n${error.message || error}</pre>`;
      }
    }
  }, [settings]);

  // Bump version para forçar re-render do mermaid
  useEffect(() => {
    mermaidVersionRef.current += 1;
    setMermaidVersion(mermaidVersionRef.current);
  }, [renderedHtml, settings]);

  useEffect(() => {
    const timer = setTimeout(() => renderMermaidBlocks(), 50);
    return () => clearTimeout(timer);
  }, [mermaidVersion, renderMermaidBlocks]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function updateSetting(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(preset) {
    setSettings((current) => ({ ...current, ...preset }));
  }

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  }

  function insertAtCursor(text) {
    const textarea = editorRef.current;
    if (!textarea) {
      setMarkdown((current) => `${current}\n\n${text}\n\n`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = markdown.slice(0, start);
    const after = markdown.slice(end);
    const next = `${before}\n\n${text}\n\n${after}`;
    setMarkdown(next);
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + text.length + 4;
    });
  }

  async function copyHtml() {
    const fullHtml = createFullHtml({ bodyHtml: renderedHtml, settings, title: "Documento formatado" });
    try {
      await copyToClipboard(fullHtml);
      setCopied(true);
      showNotice("HTML completo copiado para a área de transferência.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error(error);
      showNotice("Não consegui copiar automaticamente. Tente abrir o popup e copiar por lá.");
    }
  }

  function openFormattedWindow({ autoPrint = false } = {}) {
    const html = createFullHtml({
      bodyHtml: renderedHtml,
      settings,
      title: autoPrint ? "Exportar PDF" : "Preview formatado",
      includeActions: !autoPrint,
    });

    const popup = window.open("", "_blank", "width=1100,height=800");
    if (!popup) {
      showNotice("O navegador bloqueou o popup. Libere popups para abrir a versão formatada.");
      return;
    }

    popup.document.open();
    popup.document.write(html);
    popup.document.close();

    if (autoPrint) {
      const printPopup = () => {
        try { popup.focus(); popup.print(); } catch (e) { console.error(e); }
      };
      popup.onload = printPopup;
      window.setTimeout(printPopup, 700);
    }
  }

  return {
    // refs
    editorRef,
    previewRef,
    // state
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
    // handlers
    updateSetting,
    applyPreset,
    insertAtCursor,
    copyHtml,
    openFormattedWindow,
    defaultSettings,
  };
}
