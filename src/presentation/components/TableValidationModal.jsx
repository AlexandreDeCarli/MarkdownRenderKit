import React from "react";
import {
  Table as TableIcon,
  AlertTriangle,
  CheckCircle2,
  X,
  Wand2,
  ArrowRight,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

/**
 * Modal de Diagnóstico e Auto-Correção de Tabelas Markdown.
 * 
 * Exibe um relatório detalhado das divergências de células em relação ao cabeçalho
 * e permite auto-correção com preenchimento de células e alinhamento visual de colunas.
 * 
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   validationResult: {
 *     isValid: boolean,
 *     totalTables: number,
 *     consistentTables: number,
 *     inconsistentTables: number,
 *     totalIssues: number,
 *     tables: Array,
 *     issues: Array
 *   } | null,
 *   onAutoFix: () => void,
 *   onJumpToLine?: (line: number) => void
 * }} props
 */
export default function TableValidationModal({
  isOpen,
  onClose,
  validationResult,
  onAutoFix,
  onJumpToLine,
}) {
  if (!isOpen || !validationResult) return null;

  const {
    isValid,
    totalTables,
    consistentTables,
    inconsistentTables,
    totalIssues,
    tables,
    issues,
  } = validationResult;

  const tablesWithIssues = tables.filter((t) => !t.isConsistent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 animate-fade-in cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl max-h-[85vh] overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.2)] backdrop-blur-xl transition-all duration-300 animate-modal-scale-in flex flex-col">
        {/* Top Gradient Banner */}
        <div
          className={`h-1.5 w-full shrink-0 ${
            isValid
              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
              : "bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600"
          }`}
        />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                isValid
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {isValid ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <TableIcon className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-base font-black font-outfit text-slate-900 tracking-tight">
                Consistência de Tabelas
              </h2>
              <p className="text-xs text-slate-500">
                {totalTables === 0
                  ? "Nenhuma tabela encontrada no editor"
                  : `${totalTables} tabela(s) mapeada(s) no documento`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-slate-100 bg-slate-50 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {/* Summary Badges */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Tabelas
              </span>
              <span className="text-lg font-black font-outfit text-slate-800">
                {totalTables}
              </span>
            </div>

            <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/40 p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block">
                Consistentes
              </span>
              <span className="text-lg font-black font-outfit text-emerald-700">
                {consistentTables}
              </span>
            </div>

            <div
              className={`rounded-2xl border p-3 text-center ${
                totalIssues === 0
                  ? "border-slate-200/80 bg-slate-50/60"
                  : "border-rose-200/70 bg-rose-50/40"
              }`}
            >
              <span
                className={`text-[10px] uppercase font-bold tracking-wider block ${
                  totalIssues === 0 ? "text-slate-400" : "text-rose-600"
                }`}
              >
                Inconsistências
              </span>
              <span
                className={`text-lg font-black font-outfit ${
                  totalIssues === 0 ? "text-slate-800" : "text-rose-700"
                }`}
              >
                {totalIssues}
              </span>
            </div>
          </div>

          {/* If 100% Valid */}
          {isValid && totalTables > 0 && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-emerald-900">
                  Todas as tabelas estão perfeitamente formatadas!
                </h3>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  Todas as linhas de dados possuem o mesmo número de células que o cabeçalho e as linhas divisoras estão corretas.
                </p>
              </div>
            </div>
          )}

          {/* If No Tables */}
          {totalTables === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-center">
              <HelpCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">
                Nenhuma tabela identificada
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Para criar uma tabela em Markdown, use a estrutura com barras verticais e linha divisora:
              </p>
              <pre className="mt-3 inline-block text-left text-[11px] bg-slate-900 text-slate-200 p-3 rounded-xl font-mono leading-5">
{`| Coluna 1 | Coluna 2 |
| :------- | :------- |
| Dado 1   | Dado 2   |`}
              </pre>
            </div>
          )}

          {/* List of Issues */}
          {!isValid && tablesWithIssues.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Divergências Identificadas ({totalIssues})
                </h3>
                <span className="text-[11px] text-slate-400">
                  Linhas em desacordo com o cabeçalho
                </span>
              </div>

              {tablesWithIssues.map((table) => (
                <div
                  key={table.tableIndex}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
                >
                  {/* Table Header Info */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
                        Tabela #{table.tableIndex}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        Linhas {table.startLine} a {table.endLine}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      Cabeçalho: {table.expectedCols} coluna(s)
                    </span>
                  </div>

                  {/* Header Columns Preview */}
                  <div className="flex flex-wrap gap-1">
                    {table.headerCells.map((col, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700 font-semibold"
                      >
                        {col || `(vazio)`}
                      </span>
                    ))}
                  </div>

                  {/* Issues List for this Table */}
                  <div className="space-y-2 pt-1">
                    {table.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50/40 p-2.5 text-xs"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-rose-800">
                              Linha {issue.line}:
                            </span>{" "}
                            <span className="text-rose-700">
                              {issue.message}
                            </span>
                          </div>
                        </div>

                        {onJumpToLine && (
                          <button
                            onClick={() => {
                              onJumpToLine(issue.line);
                              onClose();
                            }}
                            className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                            title="Ir até a linha no editor"
                          >
                            <span>Ir</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
          >
            Fechar
          </button>

          {!isValid && (
            <button
              id="btn-autofix-tables"
              onClick={() => {
                onAutoFix();
                onClose();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2 text-xs font-bold text-white hover:opacity-95 active:scale-95 transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/20"
              title="Preencher células faltantes e alinhar perfeitamente todas as colunas"
            >
              <Wand2 className="h-3.5 w-3.5 text-indigo-200" />
              <span>Corrigir e Alinhar Automaticamente</span>
            </button>
          )}

          {isValid && totalTables > 0 && (
            <button
              onClick={() => {
                onAutoFix();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all duration-200 cursor-pointer"
              title="Alinhar larguras de colunas para formatação perfeita"
            >
              <Wand2 className="h-3.5 w-3.5 text-indigo-500" />
              <span>Alinhar Colunas Visualmente</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
