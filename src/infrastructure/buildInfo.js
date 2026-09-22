/**
 * Módulo de Informações de Versão e Build do MarkdownRenderKit.
 * Injetado automaticamente pelo Vite via `define` em tempo de compilação.
 */
export const buildInfo = (typeof __APP_BUILD_INFO__ !== "undefined" && __APP_BUILD_INFO__) || {
  version: "1.0.0",
  buildTime: new Date().toISOString(),
  formattedBuildTime: new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
  commit: "dev",
};
