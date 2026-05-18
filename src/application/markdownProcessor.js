import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";

// ── Configuração do marked ──────────────────────────────────────────────────

try {
  marked.setOptions({ gfm: true, breaks: true });

  const renderer = new marked.Renderer();
  renderer.code = function ({ text, lang }) {
    if (lang === "mermaid") {
      const escaped = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<div class="mermaid-block" data-mermaid="${encodeURIComponent(text)}">${escaped}</div>`;
    }
    const language = lang && hljs.getLanguage(lang) ? lang : null;
    const highlighted = language
      ? hljs.highlight(text, { language }).value
      : hljs.highlightAuto(text).value;
    const langLabel = language || "";
    return `<pre><div class="code-lang-label">${langLabel}</div><code class="hljs${language ? ` language-${language}` : ""}">${highlighted}</code></pre>`;
  };

  marked.setOptions({ renderer });
} catch (error) {
  console.warn("Não foi possível configurar o marked. O app seguirá com as opções padrão.", error);
}

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
      /\n?\s*(<!--\s*pagebreak\s*-->|---page---|:::pagebreak)\s*\n?/gi,
      '\n\n<div class="page-break"></div>\n\n'
    );

  return restoreCodeBlocks(processed, blocks);
}

/**
 * Converte markdown em HTML seguro (DOMPurify sanitizado).
 * @param {string} markdown
 * @returns {string}
 */
export function renderMarkdown(markdown) {
  const raw = marked.parse(preprocessMarkdown(markdown));
  return DOMPurify.sanitize(raw, {
    ADD_TAGS: ["iframe", "mark"],
    ADD_ATTR: ["target", "allow", "allowfullscreen", "frameborder", "scrolling", "class", "data-mermaid"],
  });
}
