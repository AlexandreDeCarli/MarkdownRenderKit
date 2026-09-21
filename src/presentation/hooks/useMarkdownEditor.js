import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import mermaid from "mermaid";
import { starterMarkdown } from "../../domain/starterMarkdown.js";
import { defaultSettings } from "../../domain/entities/settings.js";
import { renderMarkdown } from "../../application/markdownProcessor.js";
import { buildCss } from "../../application/cssBuilder.js";
import { buildMermaidThemeVars } from "../../application/mermaidService.js";
import { createFullHtml } from "../../application/htmlExporter.js";
import { loadSettings, saveSettings } from "../../infrastructure/settingsRepository.js";
import { copyToClipboard } from "../../infrastructure/clipboardService.js";
import { validateMarkdownTables, formatAndFixTables } from "../../application/tableValidator.js";
import { useScrollSync } from "./useScrollSync.js";

/**
 * Hook principal que encapsula toda a lógica do editor de markdown.
 * Implementa renderização não-bloqueante (React 19 startTransition),
 * cache de SVGs Mermaid e indicadores de progresso para rotinas pesadas.
 * @returns {Object} estado e handlers para o componente App
 */
export function useMarkdownEditor() {
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const previewContainerRef = useRef(null);
  const mermaidVersionRef = useRef(0);
  const mermaidSvgCacheRef = useRef(new Map());
  const renderRunIdRef = useRef(0);

  const [markdown, setMarkdown] = useState(starterMarkdown);
  const [renderedHtml, setRenderedHtml] = useState(() => renderMarkdown(starterMarkdown));
  const [isParsing, startParsingTransition] = useTransition();

  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mermaidVersion, setMermaidVersion] = useState(0);
  const [settings, setSettings] = useState(() => loadSettings());
  const [tableValidationModalOpen, setTableValidationModalOpen] = useState(false);
  const [tableValidationResult, setTableValidationResult] = useState(null);

  // Estados de carregamento para rotinas pesadas
  const [mermaidProgress, setMermaidProgress] = useState({ isRendering: false, current: 0, total: 0 });
  const [isExporting, setIsExporting] = useState(false);
  const [isValidatingTables, setIsValidatingTables] = useState(false);

  // Hook de sincronização de rolagem com compensação para Mermaid
  const { syncEnabled, setSyncEnabled, toggleSync, rebuildMap } = useScrollSync({
    editorRef,
    previewContainerRef,
    mermaidVersion,
  });

  // Atualiza renderedHtml de forma não-bloqueante com debounce de 250ms e React 19 startTransition
  useEffect(() => {
    const timer = setTimeout(() => {
      startParsingTransition(() => {
        const nextHtml = renderMarkdown(markdown);
        setRenderedHtml(nextHtml);
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [markdown]);

  // Debounce localStorage save (500ms)
  useEffect(() => {
    const timer = setTimeout(() => saveSettings(settings), 500);
    return () => clearTimeout(timer);
  }, [settings]);

  const previewCss = useMemo(() => buildCss(settings, false), [settings]);

  /**
   * Renderiza blocos Mermaid de maneira incremental, cooperativa (cedendo a thread)
   * e reutilizando SVGs já cacheados para eliminar travamento da página.
   */
  const renderMermaidBlocks = useCallback(async () => {
    const container = previewRef.current;
    if (!container) return;

    const darkPaper = settings.paperBg.toLowerCase() === "#0f172a" || settings.paperBg.toLowerCase() === "#020617";
    const mermaidConfig = buildMermaidThemeVars(settings, darkPaper);
    const themeKey = `${settings.paperBg}-${settings.headingColor || ""}-${settings.primaryColor || ""}-${settings.mermaidScale || 75}`;

    try {
      mermaid.initialize({ startOnLoad: false, ...mermaidConfig });
    } catch (e) {
      console.warn("Mermaid init:", e);
    }

    const blocks = container.querySelectorAll(".mermaid-block[data-mermaid]");
    const total = blocks.length;
    if (total === 0) {
      setMermaidProgress({ isRendering: false, current: 0, total: 0 });
      return;
    }

    const runId = ++renderRunIdRef.current;
    setMermaidProgress({ isRendering: true, current: 0, total });

    const cache = mermaidSvgCacheRef.current;

    for (let i = 0; i < total; i++) {
      if (renderRunIdRef.current !== runId) {
        // Nova renderização iniciada, cancela esta execução desatualizada
        return;
      }

      const block = blocks[i];
      const code = decodeURIComponent(block.getAttribute("data-mermaid"));
      const cacheKey = `${themeKey}::${code}`;

      // Se o bloco já possui exatamente este SVG deste tema, pula imediatamente (0ms)
      if (block.getAttribute("data-rendered-key") === cacheKey) {
        setMermaidProgress({ isRendering: true, current: i + 1, total });
        continue;
      }

      // Se já temos em cache, injeta instantaneamente
      if (cache.has(cacheKey)) {
        block.innerHTML = cache.get(cacheKey);
        block.setAttribute("data-rendered-key", cacheKey);
        setMermaidProgress({ isRendering: true, current: i + 1, total });
        continue;
      }

      // Cede a thread para o navegador manter 60 FPS, animar spinners e processar eventos
      await new Promise((resolve) => setTimeout(resolve, 8));

      if (renderRunIdRef.current !== runId) return;

      try {
        const id = `mermaid-preview-${Date.now()}-${i}`;
        const { svg } = await mermaid.render(id, code);
        cache.set(cacheKey, svg);
        block.innerHTML = svg;
        block.setAttribute("data-rendered-key", cacheKey);
      } catch (error) {
        console.warn("Mermaid render error:", error);
        block.innerHTML = `<pre style="color:#ef4444;text-align:left;font-size:0.85em">Erro ao renderizar diagrama Mermaid:\n${error.message || error}</pre>`;
        block.setAttribute("data-rendered-key", cacheKey);
      }

      setMermaidProgress({ isRendering: true, current: i + 1, total });
    }

    if (renderRunIdRef.current === runId) {
      setMermaidProgress({ isRendering: false, current: total, total });
      rebuildMap();
    }
  }, [settings, rebuildMap]);

  // Bump version para disparar renderização do Mermaid quando HTML ou settings mudarem
  useEffect(() => {
    mermaidVersionRef.current += 1;
    setMermaidVersion(mermaidVersionRef.current);
  }, [renderedHtml, settings]);

  useEffect(() => {
    const timer = setTimeout(() => renderMermaidBlocks(), 30);
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
    setIsExporting(true);
    try {
      const fullHtml = createFullHtml({ bodyHtml: renderedHtml, settings, title: "Documento formatado" });
      await copyToClipboard(fullHtml);
      setCopied(true);
      showNotice("HTML completo copiado para a área de transferência.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error(error);
      showNotice("Não consegui copiar automaticamente. Tente abrir o popup e copiar por lá.");
    } finally {
      setIsExporting(false);
    }
  }

  function openFormattedWindow({ autoPrint = false } = {}) {
    setIsExporting(true);
    setTimeout(() => {
      try {
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
      } finally {
        setIsExporting(false);
      }
    }, 50);
  }

  function handleValidateTables() {
    setIsValidatingTables(true);
    setTimeout(() => {
      try {
        const result = validateMarkdownTables(markdown);
        setTableValidationResult(result);
        if (result.totalTables === 0) {
          showNotice("Nenhuma tabela encontrada no documento Markdown.");
        } else if (result.isValid) {
          showNotice(`✅ Todas as tabelas estão consistentes! (${result.totalTables} tabela(s) sem erros)`);
        } else {
          setTableValidationModalOpen(true);
        }
      } finally {
        setIsValidatingTables(false);
      }
    }, 40);
  }

  function handleAutoFixTables() {
    setIsValidatingTables(true);
    setTimeout(() => {
      try {
        const { fixedMarkdown, fixCount } = formatAndFixTables(markdown);
        setMarkdown(fixedMarkdown);
        const recheck = validateMarkdownTables(fixedMarkdown);
        setTableValidationResult(recheck);
        showNotice(`✨ ${fixCount} tabela(s) corrigida(s) e alinhada(s) com sucesso!`);
      } finally {
        setIsValidatingTables(false);
      }
    }, 40);
  }

  function handleJumpToLine(lineNumber) {
    const textarea = editorRef.current;
    if (!textarea) return;
    const lines = markdown.split("\n");
    let charIdx = 0;
    for (let i = 0; i < lineNumber - 1 && i < lines.length; i++) {
      charIdx += lines[i].length + 1;
    }
    const lineEndIdx = charIdx + (lines[lineNumber - 1] ? lines[lineNumber - 1].length : 0);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(charIdx, lineEndIdx);
      const targetScroll = Math.max(0, (lineNumber - 4) * 28);
      textarea.scrollTo({ top: targetScroll, behavior: "smooth" });
    }, 60);
  }

  return {
    // refs
    editorRef,
    previewRef,
    previewContainerRef,
    // state
    markdown,
    setMarkdown,
    settings,
    setSettings,
    copied,
    notice,
    settingsOpen,
    setSettingsOpen,
    tableValidationModalOpen,
    setTableValidationModalOpen,
    tableValidationResult,
    mermaidVersion,
    renderedHtml,
    previewCss,
    syncEnabled,
    setSyncEnabled,
    // novos estados de carregamento para rotinas pesadas
    isParsing,
    mermaidProgress,
    isExporting,
    isValidatingTables,
    // handlers
    toggleSync,
    rebuildMap,
    updateSetting,
    applyPreset,
    insertAtCursor,
    copyHtml,
    openFormattedWindow,
    handleValidateTables,
    handleAutoFixTables,
    handleJumpToLine,
    defaultSettings,
  };
}

