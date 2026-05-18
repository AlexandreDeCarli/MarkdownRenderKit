// ── Utilitários de cor ────────────────────────────────────────────────────────

/**
 * Verifica se o browser suporta color-mix().
 * @returns {boolean}
 */
export function supportsColorMix() {
  if (typeof window === "undefined" || !window.CSS || !window.CSS.supports) return true;
  return window.CSS.supports("background", "color-mix(in srgb, #000, transparent 50%)");
}

/**
 * Retorna uma cor rgba a partir de um hex #rrggbb.
 * @param {string} hex
 * @param {number} alpha
 * @returns {string}
 */
export function translucent(hex, alpha) {
  const safeHex = /^#[0-9a-f]{6}$/i.test(hex || "") ? hex : "#2563eb";
  const value = safeHex.slice(1);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Converte hex #rrggbb em HSL.
 * @param {string} hex
 * @returns {{ h: number, s: number, l: number }}
 */
export function hexToHsl(hex) {
  const safeHex = /^#[0-9a-f]{6}$/i.test(hex || "") ? hex : "#2563eb";
  const val = safeHex.slice(1);
  let r = parseInt(val.slice(0, 2), 16) / 255;
  let g = parseInt(val.slice(2, 4), 16) / 255;
  let b = parseInt(val.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Converte HSL em hex #rrggbb.
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {string}
 */
export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color))).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Deriva uma cor de código a partir de uma cor base aplicando deslocamento HSL.
 * @param {string} baseHex
 * @param {number} hueShift
 * @param {number|null} satOverride
 * @param {number} lightTarget
 * @returns {string}
 */
export function deriveCodeColor(baseHex, hueShift, satOverride, lightTarget) {
  const { h, s } = hexToHsl(baseHex);
  return hslToHex(
    h + hueShift,
    satOverride !== null ? satOverride : Math.min(s, 75),
    lightTarget
  );
}

/**
 * Gera o mapa de cores de sintaxe (highlight.js) baseado nas configurações.
 * @param {import("../domain/entities/settings").Settings} settings
 * @param {boolean} darkPaper
 * @returns {Object}
 */
export function buildSyntaxColors(settings, darkPaper) {
  const accent = settings.h2Color;
  const link = settings.linkColor;
  const title = settings.titleColor;
  const highlight = settings.highlightTextColor;

  const lightKw      = darkPaper ? 72 : 40;
  const lightStr     = darkPaper ? 68 : 34;
  const lightNum     = darkPaper ? 70 : 42;
  const lightComment = darkPaper ? 52 : 62;
  const lightTitle   = darkPaper ? 66 : 44;
  const lightType    = darkPaper ? 70 : 42;
  const lightVar     = darkPaper ? 68 : 38;
  const lightMeta    = darkPaper ? 60 : 50;
  const lightParam   = darkPaper ? 82 : 30;
  const lightAttr    = darkPaper ? 64 : 40;
  const lightPunc    = darkPaper ? 72 : 42;
  const satCode      = darkPaper ? 65 : 70;

  return {
    keyword:     deriveCodeColor(accent,    0,    satCode, lightKw),
    string:      deriveCodeColor(accent,    140,  satCode, lightStr),
    number:      deriveCodeColor(highlight, 0,    satCode, lightNum),
    comment:     deriveCodeColor(accent,    0,    15,      lightComment),
    fnTitle:     deriveCodeColor(link,      0,    satCode, lightTitle),
    type:        deriveCodeColor(accent,    40,   satCode, lightType),
    variable:    deriveCodeColor(accent,    -40,  satCode, lightVar),
    regexp:      deriveCodeColor(accent,    180,  satCode, lightVar),
    meta:        deriveCodeColor(accent,    0,    25,      lightMeta),
    params:      deriveCodeColor(title,     0,    null,    lightParam),
    attribute:   deriveCodeColor(link,      30,   satCode, lightAttr),
    punctuation: deriveCodeColor(accent,    0,    20,      lightPunc),
  };
}

/**
 * Gera o bloco CSS completo para o documento formatado.
 * @param {import("../domain/entities/settings").Settings} settings
 * @param {boolean} [forPrint=false]
 * @returns {string}
 */
export function buildCss(settings, forPrint = false) {
  const darkPaper = settings.paperBg.toLowerCase() === "#0f172a" || settings.paperBg.toLowerCase() === "#020617";
  const textColor = darkPaper ? "#e5e7eb" : "#1f2937";
  const mutedColor = darkPaper ? "#cbd5e1" : "#6b7280";
  const borderColor = darkPaper ? "#334155" : "#e5e7eb";
  const codeBg = darkPaper ? "#020617" : "#f3f4f6";
  const subtleSubtitleBg = supportsColorMix()
    ? "color-mix(in srgb, var(--subtitle), transparent 90%)"
    : translucent(settings.h2Color, 0.1);
  const subtleRowBg = darkPaper ? "rgba(255,255,255,0.035)" : "rgba(15,23,42,0.025)";
  const linkBorder = supportsColorMix()
    ? "color-mix(in srgb, var(--link), transparent 55%)"
    : translucent(settings.linkColor, 0.45);

  const syn = buildSyntaxColors(settings, darkPaper);

  return `
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Lato:wght@400;700;900&family=Lora:wght@400;500;600;700&family=Merriweather:wght@400;700;900&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700;800&family=Roboto:wght@400;500;700;900&display=swap');

    :root {
      --page-bg: ${settings.pageBg};
      --paper-bg: ${settings.paperBg};
      --text: ${textColor};
      --muted: ${mutedColor};
      --border: ${borderColor};
      --title: ${settings.titleColor};
      --subtitle: ${settings.h2Color};
      --highlight: ${settings.highlightColor};
      --highlight-text: ${settings.highlightTextColor};
      --link: ${settings.linkColor};
      --code-bg: ${codeBg};
    }

    .formatted-document {
      box-sizing: border-box;
      max-width: ${settings.pageWidth}px;
      min-height: 100%;
      margin: ${forPrint ? "0 auto" : "16px auto"};
      padding: ${forPrint ? "0" : settings.pagePadding + "px"};
      background: var(--paper-bg);
      border-radius: ${forPrint ? "0" : "16px"};
      box-shadow: ${forPrint ? "none" : "0 12px 40px rgba(15, 23, 42, 0.10)"};
      overflow-wrap: break-word;
      color: var(--text);
      font-family: ${settings.bodyFont};
      line-height: ${settings.lineHeight};
      font-size: ${settings.fontSize}px;
    }

    .formatted-document > *:first-child { margin-top: 0; }
    .formatted-document > *:last-child { margin-bottom: 0; }

    .formatted-document h1, .formatted-document h2, .formatted-document h3, .formatted-document h4, .formatted-document h5, .formatted-document h6 {
      font-family: ${settings.headingFont};
      line-height: 1.2;
      letter-spacing: -0.02em;
      margin: 1.1em 0 0.4em;
      break-after: avoid;
      page-break-after: avoid;
    }

    .formatted-document h1 {
      color: var(--title);
      font-size: 1.65em;
      font-weight: 800;
      border-bottom: 2px solid var(--subtitle);
      padding-bottom: 0.2em;
    }

    .formatted-document h2 {
      color: var(--subtitle);
      font-size: 1.3em;
      font-weight: 750;
      border-left: 3px solid var(--subtitle);
      padding-left: 0.45em;
    }

    .formatted-document h3 { color: var(--subtitle); font-size: 1.1em; }
    .formatted-document h4, .formatted-document h5, .formatted-document h6 { color: var(--title); }

    .formatted-document p, .formatted-document li, .formatted-document blockquote, .formatted-document table { font-size: 1em; }
    .formatted-document p { margin: 0.55em 0; }

    .formatted-document strong { color: var(--title); font-weight: 750; }
    .formatted-document em { color: var(--muted); }

    .formatted-document a {
      color: var(--link);
      text-decoration: none;
      border-bottom: 1px solid ${linkBorder};
    }

    .formatted-document mark {
      background: var(--highlight);
      color: var(--highlight-text);
      padding: 0.08em 0.28em;
      border-radius: 0.35em;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }

    .formatted-document blockquote {
      margin: 0.8em 0;
      padding: 0.5em 0.8em;
      border-left: 3px solid var(--subtitle);
      background: ${subtleSubtitleBg};
      border-radius: 0 10px 10px 0;
      color: var(--muted);
    }

    .formatted-document ul, .formatted-document ol { padding-left: 1.3em; margin: 0.55em 0; }
    .formatted-document li { margin: 0.15em 0; }

    .formatted-document table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 0.8em 0;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid var(--border);
    }

    .formatted-document th, .formatted-document td {
      padding: 0.4em 0.6em;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }

    .formatted-document th {
      text-align: left;
      background: ${subtleSubtitleBg};
      color: var(--title);
      font-weight: 750;
    }

    .formatted-document tr:last-child td { border-bottom: 0; }
    .formatted-document tr:nth-child(even) td { background: ${subtleRowBg}; }

    .formatted-document code {
      font-family: ${settings.codeFont};
      background: var(--code-bg);
      color: var(--title);
      padding: 0.13em 0.35em;
      border-radius: 0.4em;
      font-size: 0.92em;
    }

    .formatted-document pre {
      margin: 0.8em 0;
      padding: 0;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--code-bg);
      break-inside: avoid;
      page-break-inside: avoid;
      position: relative;
    }

    .formatted-document pre .code-lang-label {
      display: block;
      padding: 0.25em 0.8em;
      font-family: ${settings.codeFont};
      font-size: 0.65em;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${darkPaper ? "#94a3b8" : "#64748b"};
      background: ${darkPaper ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)"};
      border-bottom: 1px solid var(--border);
      user-select: none;
    }

    .formatted-document pre .code-lang-label:empty {
      display: none;
    }

    .formatted-document pre code {
      background: transparent;
      padding: 0.7em;
      display: block;
      overflow-x: auto;
      color: var(--text);
      font-size: 0.85em;
    }

    /* ── Highlight.js syntax theme ── */
    .formatted-document .hljs-keyword,
    .formatted-document .hljs-selector-tag,
    .formatted-document .hljs-built_in,
    .formatted-document .hljs-name {
      color: ${syn.keyword};
      font-weight: 600;
    }

    .formatted-document .hljs-string,
    .formatted-document .hljs-attr,
    .formatted-document .hljs-symbol,
    .formatted-document .hljs-bullet,
    .formatted-document .hljs-addition {
      color: ${syn.string};
    }

    .formatted-document .hljs-number,
    .formatted-document .hljs-literal {
      color: ${syn.number};
    }

    .formatted-document .hljs-comment,
    .formatted-document .hljs-quote,
    .formatted-document .hljs-deletion {
      color: ${syn.comment};
      font-style: italic;
    }

    .formatted-document .hljs-title,
    .formatted-document .hljs-section {
      color: ${syn.fnTitle};
      font-weight: 700;
    }

    .formatted-document .hljs-type,
    .formatted-document .hljs-class .hljs-title {
      color: ${syn.type};
    }

    .formatted-document .hljs-variable,
    .formatted-document .hljs-template-variable {
      color: ${syn.variable};
    }

    .formatted-document .hljs-regexp,
    .formatted-document .hljs-link {
      color: ${syn.regexp};
    }

    .formatted-document .hljs-meta {
      color: ${syn.meta};
    }

    .formatted-document .hljs-params {
      color: ${syn.params};
    }

    .formatted-document .hljs-attribute {
      color: ${syn.attribute};
    }

    .formatted-document .hljs-punctuation {
      color: ${syn.punctuation};
    }

    /* ── Mermaid diagrams ── */
    .formatted-document .mermaid-block {
      margin: 0.8em 0;
      padding: 1em 0.7em;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--code-bg);
      overflow-x: auto;
      text-align: center;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .formatted-document .mermaid-block svg {
      max-width: 100%;
      height: auto;
    }

    .formatted-document hr {
      border: 0;
      border-top: 1px solid var(--border);
      margin: 2em 0;
    }

    .formatted-document img {
      max-width: 100%;
      border-radius: 10px;
      margin: 0.8em 0;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.10);
    }

    .page-break {
      break-after: page;
      page-break-after: always;
      height: ${forPrint ? "0" : "40px"};
      margin: ${forPrint ? "0" : "34px 0"};
      border: 0;
      position: relative;
    }

    .page-break::before {
      content: ${forPrint ? "''" : "'Quebra de página'"};
      display: ${forPrint ? "none" : "block"};
      text-align: center;
      color: var(--muted);
      border-top: 2px dashed var(--border);
      padding-top: 12px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    @page {
      size: ${settings.paperSize};
      margin: ${settings.printMargin}mm;
    }
    .print-watermark, .print-footer { display: none; }

    @media print {
      .print-watermark {
        display: block;
        position: fixed;
        top: ${settings.printMargin}mm;
        left: ${settings.printMargin}mm;
        max-width: 150px;
        max-height: 80px;
        opacity: 0.15;
        z-index: -1;
        object-fit: contain;
      }

      .print-footer {
        display: flex;
        position: fixed;
        bottom: ${settings.printMargin}mm;
        left: ${settings.printMargin}mm;
        right: ${settings.printMargin}mm;
        justify-content: space-between;
        font-size: 10px;
        color: var(--muted);
        font-family: ${settings.bodyFont};
      }

      body {
        counter-reset: page;
      }

      html, body {
        background: #ffffff !important;
        color-adjust: exact;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .formatted-document {
        max-width: none;
        width: auto;
        padding: 0;
        margin: 0;
        background: #ffffff;
        color: #1f2937;
        box-shadow: none;
        border-radius: 0;
      }

      h1, h2, h3, h4, h5, h6, blockquote, pre, table, img {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  `;
}
