import { buildCss } from "./cssBuilder.js";
import { buildMermaidThemeVars } from "./mermaidService.js";

/**
 * Escapa caracteres HTML especiais.
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Gera o HTML completo do documento para exportar ou abrir em popup.
 * @param {{ bodyHtml: string, settings: Object, title?: string, includeActions?: boolean }} params
 * @returns {string}
 */
export function createFullHtml({ bodyHtml, settings, title = "Documento formatado", includeActions = false }) {
  const css = buildCss(settings, false);
  const printCss = buildCss(settings, true);
  const darkPaper = settings.paperBg.toLowerCase() === "#0f172a" || settings.paperBg.toLowerCase() === "#020617";
  const themeVars = buildMermaidThemeVars(settings, darkPaper).themeVariables;

  const actionBar = includeActions
    ? `<div class="popup-actions"><button onclick="window.print()">Exportar PDF</button><button onclick="navigator.clipboard.writeText(document.querySelector('.formatted-document').outerHTML)">Copiar HTML</button></div>`
    : "";

  const popupActionsCss = includeActions ? `
    .popup-actions {
      position: sticky; top: 0; z-index: 10;
      display: flex; justify-content: center; gap: 10px;
      padding: 14px;
      background: rgba(255,255,255,0.86);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #e5e7eb;
    }
    .popup-actions button {
      border: 0; border-radius: 999px; padding: 10px 16px;
      font: 700 14px Inter, system-ui, sans-serif;
      background: #111827; color: #fff; cursor: pointer;
    }
    @media print { .popup-actions { display: none; } }
  ` : "";

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    ${css}
    ${popupActionsCss}
    @media print { ${printCss} }
  </style>
</head>
<body>
  ${actionBar}
  ${settings.watermarkUrl ? `<img src="${escapeHtml(settings.watermarkUrl)}" class="print-watermark" alt="" />` : ""}
  ${settings.documentName ? `
    <div class="print-footer">
      <span class="document-name">${escapeHtml(settings.documentName || "")}</span>
    </div>
  ` : ""}
  <main class="formatted-document">${bodyHtml}</main>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', async function() {
      const darkPaper = ${JSON.stringify(darkPaper)};
      const themeVars = ${JSON.stringify(themeVars)};
      mermaid.initialize({ startOnLoad: false, theme: 'base', darkMode: darkPaper, themeVariables: themeVars });
      const blocks = document.querySelectorAll('.mermaid-block[data-mermaid]');
      for (let i = 0; i < blocks.length; i++) {
        try {
          const code = decodeURIComponent(blocks[i].getAttribute('data-mermaid'));
          const { svg } = await mermaid.render('mermaid-popup-' + i, code);
          blocks[i].innerHTML = svg;
        } catch (e) { console.warn('Mermaid render error:', e); }
      }
    });
  </script>
</body>
</html>`;
}
