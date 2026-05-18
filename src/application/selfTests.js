import { preprocessMarkdown } from "./markdownProcessor.js";
import { createFullHtml } from "./htmlExporter.js";
import { defaultSettings } from "../domain/entities/settings.js";

/**
 * Executa os autotestes do sistema e loga resultados no console.
 */
export function runSelfTests() {
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
  ];

  const failed = tests.filter((test) => !test.pass);
  if (failed.length > 0) {
    console.warn("Autotestes falharam:", failed.map((t) => t.name));
  } else {
    console.info("Autotestes passaram:", tests.map((t) => t.name));
  }
}

// Roda uma única vez na inicialização do browser
if (typeof window !== "undefined" && !window.__MARKDOWN_RENDER_KIT_SELF_TESTS__) {
  window.__MARKDOWN_RENDER_KIT_SELF_TESTS__ = true;
  runSelfTests();
}
