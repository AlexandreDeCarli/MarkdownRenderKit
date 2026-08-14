import { Marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";

// ── Instância e Configuração do Marked com Mapeamento de Linhas ─────────────

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
    table(token) {
      let headerCells = "";
      for (let r = 0; r < token.header.length; r++) {
        headerCells += this.tablecell(token.header[r]);
      }
      const headerRow = this.tablerow({ text: headerCells });

      let bodyRows = "";
      for (let r = 0; r < token.rows.length; r++) {
        let rowCells = "";
        for (let c = 0; c < token.rows[r].length; c++) {
          rowCells += this.tablecell(token.rows[r][c]);
        }
        bodyRows += this.tablerow({ text: rowCells });
      }
      if (bodyRows) {
        bodyRows = `<tbody>${bodyRows}</tbody>`;
      }
      const lineAttr = formatLineAttr(token);
      return `<table${lineAttr}>\n<thead>\n${headerRow}</thead>\n${bodyRows}</table>\n`;
    },
    code(token) {
      const lineAttr = formatLineAttr(token);
      const text = token.text;
      const lang = token.lang;
      if (lang === "mermaid") {
        const escaped = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<div class="mermaid-block"${lineAttr} data-mermaid="${encodeURIComponent(text)}">${escaped}</div>\n`;
      }
      const language = lang && hljs.getLanguage(lang) ? lang : null;
      const highlighted = language
        ? hljs.highlight(text, { language }).value
        : hljs.highlightAuto(text).value;
      const langLabel = language || "";
      return `<pre${lineAttr}><div class="code-lang-label">${langLabel}</div><code class="hljs${language ? ` language-${language}` : ""}">${highlighted}</code></pre>\n`;
    },
    hr(token) {
      const lineAttr = formatLineAttr(token);
      return `<hr${lineAttr}>\n`;
    },
    html(token) {
      if (token.block && token.startLine) {
        return `<div data-source-line="${token.startLine}" data-line-end="${token.endLine || token.startLine}">${token.text}</div>\n`;
      }
      return token.text;
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
  const blocks = [];
  const protectedText = normalizeMarkdown(markdown).replace(/```[\s\S]*?```/g, (match) => {
    const token = `@@CODE_BLOCK_${blocks.length}@@`;
    blocks.push(match);
    return token;
  });
  return { protectedText, blocks };
}

/**
 * Restaura os blocos de código previamente protegidos.
 * @param {string} markdown
 * @param {string[]} blocks
 * @returns {string}
 */
export function restoreCodeBlocks(markdown, blocks) {
  return blocks.reduce(
    (current, block, index) => current.replace(`@@CODE_BLOCK_${index}@@`, block),
    markdown
  );
}

/**
 * Pré-processa o markdown:
 * - Converte ==texto== em <mark>texto</mark>
 * - Converte <!-- pagebreak -->, ---page--- e :::pagebreak em div.page-break
 * @param {string} markdown
 * @returns {string}
 */
export function preprocessMarkdown(markdown) {
  const { protectedText, blocks } = protectCodeBlocks(markdown);

  const processed = protectedText
    .replace(/==([^=\n][\s\S]*?[^=\n])==/g, "<mark>$1</mark>")
    .replace(
      /(<!--\s*pagebreak\s*-->|---page---|:::pagebreak)/gi,
      '<div class="page-break"></div>'
    );

  return restoreCodeBlocks(processed, blocks);
}

/**
 * Converte markdown em HTML seguro (DOMPurify sanitizado) com marcadores de linha.
 * @param {string} markdown
 * @returns {string}
 */
export function renderMarkdown(markdown) {
  const preprocessed = preprocessMarkdown(markdown);
  const tokens = customMarked.lexer(preprocessed);

  // Calcula startLine e endLine para cada token com base nas quebras de linha
  let currentLine = 1;
  for (const token of tokens) {
    token.startLine = currentLine;
    const lineCount = (token.raw.match(/\n/g) || []).length;
    token.endLine = currentLine + lineCount;
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
      "data-line-end"
    ],
  };

  if (DOMPurify && typeof DOMPurify.sanitize === "function") {
    return DOMPurify.sanitize(raw, sanitizeOptions);
  }

  return raw;
}


