import { Marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import {
  virtualizeBase64Images,
  restoreBase64Images,
  hasBase64Images,
} from "./base64ImageManager.js";

// ── Cache de Sintaxe de Código e Otimizações de Desempenho ──────────────────

export const codeHighlightCache = new Map();
const MAX_HIGHLIGHT_CACHE_SIZE = 1000;

export function clearHighlightCache() {
  codeHighlightCache.clear();
}

function escapeCodeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function countNewlines(str) {
  if (!str) return 0;
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === 10) count++;
  }
  return count;
}

const customMarked = new Marked({ gfm: true, breaks: true });

function formatLineAttr(token) {
  if (!token || typeof token.startLine !== "number") return "";
  return ` data-source-line="${token.startLine}" data-line-end="${token.endLine || token.startLine}"`;
}

customMarked.use({
  renderer: {
    heading(token) {
      const lineAttr = formatLineAttr(token);
      return `<h${token.depth}${lineAttr}>${this.parser.parseInline(token.tokens)}</h${token.depth}>\n`;
    },
    paragraph(token) {
      const lineAttr = formatLineAttr(token);
      return `<p${lineAttr}>${this.parser.parseInline(token.tokens)}</p>\n`;
    },
    blockquote(token) {
      const lineAttr = formatLineAttr(token);
      return `<blockquote${lineAttr}>\n${this.parser.parse(token.tokens)}</blockquote>\n`;
    },
    list(token) {
      let body = "";
      for (let i = 0; i < token.items.length; i++) {
        body += this.listitem(token.items[i]);
      }
      const type = token.ordered ? "ol" : "ul";
      const start = token.ordered && token.start !== 1 ? ` start="${token.start}"` : "";
      const lineAttr = formatLineAttr(token);
      return `<${type}${start}${lineAttr}>\n${body}</${type}>\n`;
    },
    listitem(token) {
      const lineAttr = formatLineAttr(token);
      return `<li${lineAttr}>${this.parser.parse(token.tokens, !!token.loose)}</li>\n`;
    },
    table(token) {
      let headerCells = "";
      for (let r = 0; r < token.header.length; r++) {
        headerCells += this.tablecell(token.header[r]);
      }
      const headerAttr = token.startLine ? ` data-source-line="${token.startLine}"` : "";
      const headerRow = `<tr${headerAttr}>\n${headerCells}</tr>\n`;

      let bodyRows = "";
      for (let r = 0; r < token.rows.length; r++) {
        let rowCells = "";
        for (let c = 0; c < token.rows[r].length; c++) {
          rowCells += this.tablecell(token.rows[r][c]);
        }
        const rowLine = token.startLine ? token.startLine + 2 + r : null;
        const rowAttr = rowLine ? ` data-source-line="${rowLine}"` : "";
        bodyRows += `<tr${rowAttr}>\n${rowCells}</tr>\n`;
      }
      if (bodyRows) {
        bodyRows = `<tbody>${bodyRows}</tbody>`;
      }
      const lineAttr = formatLineAttr(token);
      return `<table${lineAttr}>\n<thead>\n${headerRow}</thead>\n${bodyRows}</table>\n`;
    },
    code(token) {
      const lineAttr = formatLineAttr(token);
      const text = token.text || "";
      const lang = token.lang;

      if (lang === "mermaid") {
        const escaped = escapeCodeHtml(text);
        return `<div class="mermaid-block"${lineAttr} data-mermaid="${encodeURIComponent(text)}">${escaped}</div>\n`;
      }

      const cacheKey = `${lang || ""}:${text}`;
      if (codeHighlightCache.has(cacheKey)) {
        const cached = codeHighlightCache.get(cacheKey);
        return `<pre${lineAttr}><div class="code-lang-label">${cached.langLabel}</div><code class="hljs${cached.language ? ` language-${cached.language}` : ""}">${cached.highlighted}</code></pre>\n`;
      }

      const language = lang && hljs.getLanguage(lang) ? lang : null;
      let highlighted = "";

      if (language) {
        try {
          highlighted = hljs.highlight(text, { language }).value;
        } catch (e) {
          highlighted = escapeCodeHtml(text);
        }
      } else if (text.length < 500) {
        // Para blocos pequenos sem linguagem, usa highlightAuto com segurança
        try {
          highlighted = hljs.highlightAuto(text).value;
        } catch (e) {
          highlighted = escapeCodeHtml(text);
        }
      } else {
        // Para blocos grandes sem linguagem explícita, evita escanear 100+ linguagens com regex
        highlighted = escapeCodeHtml(text);
      }

      const langLabel = language || "";

      if (codeHighlightCache.size >= MAX_HIGHLIGHT_CACHE_SIZE) {
        const firstKey = codeHighlightCache.keys().next().value;
        codeHighlightCache.delete(firstKey);
      }
      codeHighlightCache.set(cacheKey, { highlighted, language, langLabel });

      return `<pre${lineAttr}><div class="code-lang-label">${langLabel}</div><code class="hljs${language ? ` language-${language}` : ""}">${highlighted}</code></pre>\n`;
    },
    hr(token) {
      const lineAttr = formatLineAttr(token);
      return `<hr${lineAttr}>\n`;
    },
    html(token) {
      if (token.startLine && (token.block || (typeof token.text === "string" && token.text.includes("page-break")))) {
        return `<div data-source-line="${token.startLine}" data-line-end="${token.endLine || token.startLine}">${token.text}</div>\n`;
      }
      return token.text;
    },
    image(token) {
      const lineAttr = formatLineAttr(token);
      const href = token.href || "";
      const titleAttr = token.title ? ` title="${escapeCodeHtml(token.title)}"` : "";
      const alt = token.text || "";
      return `<img src="${href}" alt="${escapeCodeHtml(alt)}"${titleAttr}${lineAttr} loading="lazy" decoding="async" />\n`;
    }
  }
});

// ── Funções de processamento ─────────────────────────────────────────────────

/**
 * Normaliza quebras de linha para \n.
 * @param {string} markdown
 * @returns {string}
 */
export function normalizeMarkdown(markdown) {
  return String(markdown || "").replace(/\r\n?/g, "\n");
}

/**
 * Protege blocos de código triple-backtick para que transformações
 * subsequentes não alterem seu conteúdo.
 * @param {string} markdown
 * @returns {{ protectedText: string, blocks: string[] }}
 */
export function protectCodeBlocks(markdown) {
  const normalized = normalizeMarkdown(markdown);
  if (!normalized.includes("```")) {
    return { protectedText: normalized, blocks: [] };
  }
  const blocks = [];
  const protectedText = normalized.replace(/```[\s\S]*?```/g, (match) => {
    const token = `@@CODE_BLOCK_${blocks.length}@@`;
    blocks.push(match);
    return token;
  });
  return { protectedText, blocks };
}

/**
 * Restaura os blocos de código previamente protegidos em passada única O(N).
 * @param {string} markdown
 * @param {string[]} blocks
 * @returns {string}
 */
export function restoreCodeBlocks(markdown, blocks) {
  if (!blocks || blocks.length === 0) return markdown;
  return markdown.replace(/@@CODE_BLOCK_(\d+)@@/g, (_, id) => blocks[Number(id)] ?? _);
}

/**
 * Pré-processa o markdown:
 * - Converte ==texto== em <mark>texto</mark>
 * - Converte <!-- pagebreak -->, ---page--- e :::pagebreak em div.page-break
 * @param {string} markdown
 * @returns {string}
 */
export function preprocessMarkdown(markdown) {
  const hasMarks = typeof markdown === "string" && markdown.includes("==");
  const hasPageBreak =
    typeof markdown === "string" &&
    (markdown.includes("<!--") || markdown.includes("---page---") || markdown.includes(":::pagebreak"));

  if (!hasMarks && !hasPageBreak && !markdown.includes("```")) {
    return normalizeMarkdown(markdown);
  }

  const { protectedText, blocks } = protectCodeBlocks(markdown);

  let processed = protectedText;
  if (hasMarks) {
    processed = processed.replace(/==([^=\n][\s\S]*?[^=\n])==/g, "<mark>$1</mark>");
  }
  if (hasPageBreak) {
    processed = processed.replace(
      /(<!--\s*pagebreak\s*-->|---page---|:::pagebreak)/gi,
      '<div class="page-break"></div>'
    );
  }

  return restoreCodeBlocks(processed, blocks);
}

/**
 * Converte markdown em HTML seguro (DOMPurify sanitizado) com marcadores de linha.
 * Suporta virtualização de imagens base64 de alta performance.
 *
 * @param {string} markdown
 * @param {{ restoreImages?: boolean, keepVirtualized?: boolean }} [options]
 * @returns {string}
 */
export function renderMarkdown(markdown, options = {}) {
  const { restoreImages = false, keepVirtualized = false } = options;

  // 1. Virtualização de imagens base64: se contiver data:image/, virtualiza
  const { optimizedMarkdown, hasBase64Images: hasImages, tokenMap } = virtualizeBase64Images(markdown);

  const preprocessed = preprocessMarkdown(optimizedMarkdown);
  const tokens = customMarked.lexer(preprocessed);

  // Calcula startLine e endLine para cada token com base nas quebras de linha
  let currentLine = 1;
  for (const token of tokens) {
    token.startLine = currentLine;
    const lineCount = countNewlines(token.raw);
    token.endLine = currentLine + lineCount;

    if (token.type === "list" && Array.isArray(token.items)) {
      let itemLine = currentLine;
      for (const item of token.items) {
        item.startLine = itemLine;
        const itemLines = countNewlines(item.raw);
        item.endLine = itemLine + itemLines;
        itemLine += Math.max(1, itemLines);
      }
    }

    currentLine += lineCount;
  }

  const raw = customMarked.parser(tokens);
  const sanitizeOptions = {
    ADD_TAGS: ["iframe", "mark"],
    ADD_ATTR: [
      "target",
      "allow",
      "allowfullscreen",
      "frameborder",
      "scrolling",
      "class",
      "data-mermaid",
      "data-source-line",
      "data-line-end",
      "loading",
      "decoding"
    ],
  };

  let sanitized = raw;
  if (DOMPurify && typeof DOMPurify.sanitize === "function") {
    sanitized = DOMPurify.sanitize(raw, sanitizeOptions);
  }

  // Se restoreImages foi solicitado explicitamente, ou em ambiente de testes Node.js
  // onde o consumidor espera os dados originais no HTML retornado:
  if (hasImages && (restoreImages || (typeof window === "undefined" && !keepVirtualized))) {
    sanitized = restoreBase64Images(sanitized, tokenMap);
  }

  return sanitized;
}


