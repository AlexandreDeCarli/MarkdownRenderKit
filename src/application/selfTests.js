import { preprocessMarkdown, renderMarkdown } from "./markdownProcessor.js";
import { createFullHtml } from "./htmlExporter.js";
import { buildCss } from "./cssBuilder.js";
import { defaultSettings } from "../domain/entities/settings.js";
import { calculatePreviewScrollTop, calculateEditorScrollTop } from "./scrollSyncService.js";
import { validateMarkdownTables, formatAndFixTables } from "./tableValidator.js";

/**
 * Executa os autotestes do sistema e loga resultados no console.
 */
export function runSelfTests() {
  const dummyEditor = { scrollHeight: 1000, clientHeight: 200 };
  const dummyPreview = { scrollHeight: 2000, clientHeight: 400 };
  const mockMap = [
    { startLine: 1, endLine: 1, editorTop: 0, editorBottom: 28, previewTop: 0, previewBottom: 50, previewHeight: 50 },
    // Bloco Mermaid: 4 linhas no editor (112px) gerando 500px no preview
    { startLine: 10, endLine: 14, editorTop: 252, editorBottom: 392, previewTop: 300, previewBottom: 800, previewHeight: 500 },
    { startLine: 20, endLine: 22, editorTop: 532, editorBottom: 616, previewTop: 900, previewBottom: 980, previewHeight: 80 },
  ];

  const htmlWithMermaid = renderMarkdown("# Título\n\n```mermaid\nflowchart TD\nA-->B\n```\n\nTexto final");

  // Testa interpolação no meio do bloco Mermaid
  const midMermaidEditorScroll = 252 + (392 - 252) / 2; // meio do bloco mermaid no editor (322px)
  const calculatedPreviewScroll = calculatePreviewScrollTop(midMermaidEditorScroll, dummyEditor, dummyPreview, mockMap);
  const midMermaidPreviewScroll = 300 + 500 / 2; // meio do bloco mermaid no preview (550px)

  const tests = [
    {
      name: "converte destaque ==texto== em mark",
      pass: preprocessMarkdown("Olá ==mundo==").includes("<mark>mundo</mark>"),
    },
    {
      name: "converte comentário de quebra de página",
      pass: preprocessMarkdown("A\n<!-- pagebreak -->\nB").includes('class="page-break"'),
    },
    {
      name: "converte marcador ---page---",
      pass: preprocessMarkdown("A\n---page---\nB").includes('class="page-break"'),
    },
    {
      name: "não altera destaque dentro de bloco de código",
      pass: preprocessMarkdown("```js\nconst x = '==não destacar=='\n```").includes("==não destacar=="),
    },
    {
      name: "HTML completo tem documento válido",
      pass: createFullHtml({ bodyHtml: "<h1>Teste</h1>", settings: defaultSettings }).startsWith("<!doctype html>"),
    },
    {
      name: "renderMarkdown insere data-source-line nos cabeçalhos e parágrafos",
      pass: htmlWithMermaid.includes('data-source-line="1"') && htmlWithMermaid.includes('data-source-line="8"'),
    },
    {
      name: "renderMarkdown preserva data-source-line no bloco mermaid",
      pass: htmlWithMermaid.includes('class="mermaid-block"') && htmlWithMermaid.includes('data-source-line="3"'),
    },
    {
      name: "sincronização de rolagem interpola com precisão dentro do bloco Mermaid",
      pass: Math.abs(calculatedPreviewScroll - midMermaidPreviewScroll) < 5,
    },
    {
      name: "sincronização de rolagem inversa (preview -> editor) funciona dentro do Mermaid",
      pass: Math.abs(calculateEditorScrollTop(midMermaidPreviewScroll, dummyEditor, dummyPreview, mockMap) - midMermaidEditorScroll) < 5,
    },
    {
      name: "sincronização de rolagem parte exatamente de zero sem salto inicial",
      pass: calculatePreviewScrollTop(0, dummyEditor, dummyPreview, mockMap) === 0 && calculateEditorScrollTop(0, dummyEditor, dummyPreview, mockMap) === 0,
    },
    {
      name: "sincronização de rolagem atinge o final exato no limite máximo",
      pass: calculatePreviewScrollTop(800, dummyEditor, dummyPreview, mockMap) === 1600 && calculateEditorScrollTop(1600, dummyEditor, dummyPreview, mockMap) === 800,
    },
    {
      name: "renderMarkdown atribui data-source-line individualmente aos itens de lista",
      pass: renderMarkdown("- Item 1\n- Item 2").includes('data-source-line="1"') && renderMarkdown("- Item 1\n- Item 2").includes('data-source-line="2"'),
    },
    {
      name: "renderMarkdown atribui data-source-line individualmente a cada linha de tabela",
      pass: (() => {
        const html = renderMarkdown("| A |\n|---|\n| 1 |\n| 2 |");
        return html.includes('data-source-line="3"') && html.includes('data-source-line="4"');
      })(),
    },
    {
      name: "detecta tabela consistente com sucesso",
      pass: validateMarkdownTables("| A | B |\n| --- | --- |\n| 1 | 2 |").isValid === true,
    },
    {
      name: "detecta inconsistência de células na linha da tabela",
      pass: (() => {
        const res = validateMarkdownTables("| A | B | C |\n| --- | --- | --- |\n| 1 | 2 |");
        return res.isValid === false && res.totalIssues === 1 && res.issues[0].actual === 2;
      })(),
    },
    {
      name: "detecta tentativa de tabela sem divisor",
      pass: (() => {
        const res = validateMarkdownTables("| A | B |\n| 1 | 2 |");
        return res.isValid === false && res.issues.some((i) => i.type === "MISSING_DELIMITER");
      })(),
    },
    {
      name: "corrige e alinha automaticamente tabela inconsistente",
      pass: (() => {
        const broken = "| A | B | C |\n| --- | --- | --- |\n| 1 | 2 |";
        const { fixedMarkdown } = formatAndFixTables(broken);
        return validateMarkdownTables(fixedMarkdown).isValid === true;
      })(),
    },
    {
      name: "buildCss aplica escala configurada do Mermaid SVG",
      pass: (() => {
        const customCss = buildCss({ ...defaultSettings, mermaidScale: 60 });
        return customCss.includes("zoom: 0.6;");
      })(),
    },
  ];

  const failed = tests.filter((test) => !test.pass);
  if (failed.length > 0) {
    console.warn("Autotestes falharam:", failed.map((t) => t.name));
  } else {
    console.info("Autotestes passaram com sucesso! (" + tests.length + " verificações)");
  }
}

// Roda uma única vez na inicialização do browser
if (typeof window !== "undefined" && !window.__MARKDOWN_RENDER_KIT_SELF_TESTS__) {
  window.__MARKDOWN_RENDER_KIT_SELF_TESTS__ = true;
  runSelfTests();
}

