/**
 * Módulo de Validação e Formatação de Tabelas Markdown (GFM).
 * 
 * Identifica tabelas no documento, ignorando blocos de código (code fences),
 * e valida a consistência de cada linha de dados e da linha divisora
 * em relação às colunas do cabeçalho.
 */

/**
 * Divide uma linha de tabela Markdown em células, respeitando escapes (\\|)
 * e blocos de código inline (`...`).
 * @param {string} line
 * @returns {string[]}
 */
export function splitTableCells(line) {
  let content = String(line || "").trim();
  if (content.startsWith("|")) {
    content = content.slice(1);
  }
  if (content.endsWith("|") && !content.endsWith("\\|")) {
    content = content.slice(0, -1);
  }

  const cells = [];
  let currentCell = "";
  let activeFence = 0;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const prevChar = i > 0 ? content[i - 1] : "";

    // Detecção de crases (inline code fences)
    if (char === "`" && prevChar !== "\\") {
      let run = 1;
      while (i + 1 < content.length && content[i + 1] === "`") {
        run++;
        i++;
      }
      currentCell += "`".repeat(run);
      if (activeFence === 0) {
        activeFence = run;
      } else if (activeFence === run) {
        activeFence = 0;
      }
      continue;
    }

    // Pipe separador de células (fora de blocos de código e não escapado)
    if (char === "|" && prevChar !== "\\" && activeFence === 0) {
      cells.push(currentCell);
      currentCell = "";
    } else {
      currentCell += char;
    }
  }
  cells.push(currentCell);
  return cells;
}

/**
 * Verifica se uma célula individual possui formato de divisor Markdown (:?-+:?).
 * @param {string} cell
 * @returns {boolean}
 */
export function isDelimiterCell(cell) {
  return /^\s*:?-{1,}:?\s*$/.test(cell);
}

/**
 * Verifica se uma linha inteira é uma linha divisora de tabela Markdown.
 * @param {string} line
 * @returns {boolean}
 */
export function isDelimiterLine(line) {
  if (!line || !line.includes("|")) return false;
  const cells = splitTableCells(line);
  return cells.length > 0 && cells.every(isDelimiterCell);
}

/**
 * Extrai o alinhamento de uma célula divisora ("left", "center", "right").
 * @param {string} cell
 * @returns {"left" | "center" | "right"}
 */
export function getColumnAlignment(cell) {
  const trimmed = String(cell || "").trim();
  const startsWithColon = trimmed.startsWith(":");
  const endsWithColon = trimmed.endsWith(":");
  if (startsWithColon && endsWithColon) return "center";
  if (endsWithColon) return "right";
  return "left";
}

/**
 * Localiza todas as tabelas Markdown no texto, ignorando blocos de código.
 * @param {string} markdown
 * @returns {Array} lista de tabelas encontradas com seus metadados e linhas
 */
export function parseMarkdownTables(markdown) {
  const lines = String(markdown || "").split("\n");
  const tables = [];
  let inCodeBlock = false;
  const consumedLines = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detecta início/fim de bloco de código demarcado por ``` ou ~~~
    if (/^\s*(```|~~~)/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock || consumedLines.has(i)) continue;

    // Caso 1: Tabela padrão com linha divisora logo abaixo do cabeçalho
    if (i + 1 < lines.length && isDelimiterLine(lines[i + 1])) {
      const headerLineIdx = i;
      const delimiterLineIdx = i + 1;
      consumedLines.add(headerLineIdx);
      consumedLines.add(delimiterLineIdx);

      const headerRaw = lines[headerLineIdx];
      const headerCells = splitTableCells(headerRaw).map((c) => c.trim());
      const delimiterRaw = lines[delimiterLineIdx];
      const delimiterCells = splitTableCells(delimiterRaw).map((c) => c.trim());

      const dataRows = [];
      let j = i + 2;
      while (j < lines.length) {
        const rowLine = lines[j];
        if (
          /^\s*(```|~~~)/.test(rowLine) ||
          rowLine.trim() === "" ||
          /^#{1,6}\s/.test(rowLine) ||
          !rowLine.includes("|")
        ) {
          break;
        }
        consumedLines.add(j);
        dataRows.push({
          lineIdx: j,
          lineNum: j + 1,
          raw: rowLine,
          cells: splitTableCells(rowLine).map((c) => c.trim()),
        });
        j++;
      }

      tables.push({
        type: "STANDARD",
        startLine: headerLineIdx + 1,
        endLine: j > i + 2 ? j : delimiterLineIdx + 1,
        headerLineIdx,
        delimiterLineIdx,
        headerCells,
        delimiterCells,
        dataRows,
        hasDelimiter: true,
      });
      continue;
    }

    // Caso 2: Tentativa de tabela sem linha divisora (2+ linhas consecutivas com pipes)
    if (line.includes("|") && line.trim().startsWith("|")) {
      const candidateLines = [i];
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        if (
          /^\s*(```|~~~)/.test(nextLine) ||
          nextLine.trim() === "" ||
          /^#{1,6}\s/.test(nextLine) ||
          !nextLine.includes("|") ||
          isDelimiterLine(nextLine)
        ) {
          break;
        }
        candidateLines.push(j);
        j++;
      }

      if (candidateLines.length >= 2) {
        candidateLines.forEach((idx) => consumedLines.add(idx));
        const headerRaw = lines[candidateLines[0]];
        const headerCells = splitTableCells(headerRaw).map((c) => c.trim());
        const dataRows = candidateLines.slice(1).map((idx) => ({
          lineIdx: idx,
          lineNum: idx + 1,
          raw: lines[idx],
          cells: splitTableCells(lines[idx]).map((c) => c.trim()),
        }));

        tables.push({
          type: "MISSING_DELIMITER",
          startLine: candidateLines[0] + 1,
          endLine: candidateLines[candidateLines.length - 1] + 1,
          headerLineIdx: candidateLines[0],
          delimiterLineIdx: null,
          headerCells,
          delimiterCells: [],
          dataRows,
          hasDelimiter: false,
        });
      }
    }
  }

  return tables;
}

/**
 * Valida a consistência de todas as tabelas em um documento Markdown.
 * @param {string} markdown
 * @returns {{
 *   isValid: boolean,
 *   totalTables: number,
 *   consistentTables: number,
 *   inconsistentTables: number,
 *   totalIssues: number,
 *   tables: Array,
 *   issues: Array
 * }}
 */
export function validateMarkdownTables(markdown) {
  const parsedTables = parseMarkdownTables(markdown);
  const tables = [];
  const allIssues = [];

  parsedTables.forEach((table, index) => {
    const tableIssues = [];
    const expectedCols = table.headerCells.length;

    // 1. Validação da linha divisora
    if (!table.hasDelimiter) {
      const issue = {
        tableIndex: index + 1,
        line: table.startLine + 1,
        type: "MISSING_DELIMITER",
        severity: "error",
        message: `Tabela sem linha divisora (| --- |) logo abaixo do cabeçalho. Sem ela, o Markdown não renderiza a tabela.`,
        expected: expectedCols,
        actual: 0,
      };
      tableIssues.push(issue);
      allIssues.push(issue);
    } else if (table.delimiterCells.length !== expectedCols) {
      const issue = {
        tableIndex: index + 1,
        line: table.delimiterLineIdx + 1,
        type: "DELIMITER_MISMATCH",
        severity: "warning",
        message: `Linha divisora possui ${table.delimiterCells.length} coluna(s), mas o cabeçalho possui ${expectedCols}.`,
        expected: expectedCols,
        actual: table.delimiterCells.length,
      };
      tableIssues.push(issue);
      allIssues.push(issue);
    }

    // 2. Validação das linhas de dados
    table.dataRows.forEach((row) => {
      const actualCols = row.cells.length;
      if (actualCols !== expectedCols) {
        const diff = actualCols - expectedCols;
        const msg =
          diff < 0
            ? `Linha ${row.lineNum}: possui ${actualCols} célula(s), mas o cabeçalho requer ${expectedCols} (faltando ${Math.abs(diff)} célula(s)).`
            : `Linha ${row.lineNum}: possui ${actualCols} célula(s), mas o cabeçalho possui apenas ${expectedCols} (${diff} célula(s) a mais).`;

        const issue = {
          tableIndex: index + 1,
          line: row.lineNum,
          type: "CELL_MISMATCH",
          severity: "error",
          message: msg,
          expected: expectedCols,
          actual: actualCols,
          diff,
        };
        tableIssues.push(issue);
        allIssues.push(issue);
      }
    });

    tables.push({
      ...table,
      tableIndex: index + 1,
      expectedCols,
      issues: tableIssues,
      isConsistent: tableIssues.length === 0,
    });
  });

  const totalTables = tables.length;
  const consistentTables = tables.filter((t) => t.isConsistent).length;
  const inconsistentTables = totalTables - consistentTables;

  return {
    isValid: allIssues.length === 0,
    totalTables,
    consistentTables,
    inconsistentTables,
    totalIssues: allIssues.length,
    tables,
    issues: allIssues,
  };
}

/**
 * Preenche ou alinha uma célula de acordo com a largura da coluna.
 * @param {string} text
 * @param {number} width
 * @param {"left" | "center" | "right"} align
 * @returns {string}
 */
function padCell(text, width, align) {
  const str = String(text || "").trim();
  if (align === "right") return str.padStart(width);
  if (align === "center") {
    const totalPad = Math.max(0, width - str.length);
    const leftPad = Math.floor(totalPad / 2);
    const rightPad = totalPad - leftPad;
    return " ".repeat(leftPad) + str + " ".repeat(rightPad);
  }
  return str.padEnd(width);
}

/**
 * Constrói a célula divisora (ex: :---:, ---:, :---).
 * @param {number} width
 * @param {"left" | "center" | "right"} align
 * @returns {string}
 */
function buildDelimiterCell(width, align) {
  const minWidth = Math.max(3, width);
  if (align === "center") {
    return ":" + "-".repeat(Math.max(1, minWidth - 2)) + ":";
  }
  if (align === "right") {
    return "-".repeat(Math.max(2, minWidth - 1)) + ":";
  }
  return "-".repeat(minWidth);
}

/**
 * Corrige e formata todas as tabelas encontradas no Markdown:
 * - Preenche células faltantes com vazios
 * - Ajusta / insere linhas divisoras
 * - Alinha perfeitamente as colunas com espaçamento proporcional
 * 
 * @param {string} markdown
 * @returns {{ fixedMarkdown: string, fixCount: number }}
 */
export function formatAndFixTables(markdown) {
  const validation = validateMarkdownTables(markdown);
  if (validation.totalTables === 0) {
    return { fixedMarkdown: markdown, fixCount: 0 };
  }

  const lines = String(markdown || "").split("\n");
  // Ordena as tabelas de trás para frente para que as substituições de linhas não afetem índices anteriores
  const reversedTables = [...validation.tables].sort((a, b) => b.headerLineIdx - a.headerLineIdx);

  let fixCount = 0;

  for (const table of reversedTables) {
    const rawRows = table.dataRows.map((r) => [...r.cells]);

    // Descobre quantas colunas são necessárias
    let maxCols = table.headerCells.length;
    rawRows.forEach((row) => {
      // Se houver células excedentes com texto real, expande
      for (let c = maxCols; c < row.length; c++) {
        if (row[c] && row[c].trim() !== "") {
          maxCols = c + 1;
        }
      }
    });

    const header = [...table.headerCells];
    while (header.length < maxCols) {
      header.push(`Coluna ${header.length + 1}`);
    }

    // Normaliza linhas de dados para ter exatamente maxCols células
    const normalizedRows = rawRows.map((row) => {
      const copy = [...row];
      while (copy.length < maxCols) {
        copy.push("");
      }
      return copy.slice(0, maxCols);
    });

    // Extrai alinhamentos da linha divisora existente
    const alignments = [];
    for (let c = 0; c < maxCols; c++) {
      if (table.delimiterCells[c]) {
        alignments.push(getColumnAlignment(table.delimiterCells[c]));
      } else {
        alignments.push("left");
      }
    }

    // Calcula a largura máxima de cada coluna (mínimo de 3 caracteres)
    const colWidths = Array(maxCols).fill(3);
    for (let c = 0; c < maxCols; c++) {
      colWidths[c] = Math.max(colWidths[c], header[c].trim().length);
      for (const row of normalizedRows) {
        colWidths[c] = Math.max(colWidths[c], (row[c] || "").trim().length);
      }
    }

    // Monta as novas linhas formatadas
    const newLines = [];
    newLines.push("| " + header.map((h, i) => padCell(h, colWidths[i], alignments[i])).join(" | ") + " |");
    newLines.push("| " + colWidths.map((w, i) => buildDelimiterCell(w, alignments[i])).join(" | ") + " |");
    normalizedRows.forEach((row) => {
      newLines.push("| " + row.map((c, i) => padCell(c, colWidths[i], alignments[i])).join(" | ") + " |");
    });

    // Linhas a serem substituídas no documento original
    const startIdx = table.headerLineIdx;
    const endIdx = table.endLine; // exclusivo
    const deleteCount = endIdx - startIdx;

    lines.splice(startIdx, deleteCount, ...newLines);
    fixCount++;
  }

  return {
    fixedMarkdown: lines.join("\n"),
    fixCount,
  };
}
