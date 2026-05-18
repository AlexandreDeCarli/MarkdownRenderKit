import { translucent } from "./cssBuilder.js";

/**
 * Gera as variáveis de tema para o Mermaid com base nas configurações atuais.
 * @param {import("../domain/entities/settings").Settings} settings
 * @param {boolean} darkPaper
 * @returns {Object}
 */
export function buildMermaidThemeVars(settings, darkPaper) {
  const textColor = settings.flowTextColor || (darkPaper ? "#e5e7eb" : "#1f2937");
  const codeBg = darkPaper ? "#020617" : "#f3f4f6";
  const borderColor = darkPaper ? "#334155" : "#e5e7eb";

  const primaryBg = settings.flowPrimaryBg || (darkPaper
    ? translucent(settings.h2Color, 0.15)
    : translucent(settings.h2Color, 0.08));
  const primaryBorder = settings.flowPrimaryBorder || settings.h2Color;
  const secondaryBg = settings.flowSecondaryBg || (darkPaper
    ? translucent(settings.linkColor, 0.12)
    : translucent(settings.linkColor, 0.06));
  const secondaryBorder = settings.flowSecondaryBorder || settings.linkColor;
  const tertiaryBg = settings.flowTertiaryBg || (darkPaper
    ? translucent(settings.highlightColor, 0.15)
    : translucent(settings.highlightColor, 0.1));
  const tertiaryBorder = settings.flowTertiaryBorder || settings.highlightTextColor;
  const lineColor = settings.flowLineColor || (darkPaper ? "#64748b" : "#94a3b8");

  return {
    darkMode: darkPaper,
    theme: "base",
    themeVariables: {
      primaryColor: primaryBg,
      primaryBorderColor: primaryBorder,
      primaryTextColor: textColor,
      secondaryColor: secondaryBg,
      secondaryBorderColor: secondaryBorder,
      secondaryTextColor: textColor,
      tertiaryColor: tertiaryBg,
      tertiaryBorderColor: tertiaryBorder,
      tertiaryTextColor: textColor,
      lineColor: lineColor,
      textColor: textColor,
      mainBkg: primaryBg,
      nodeBorder: primaryBorder,
      clusterBkg: darkPaper ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.02)",
      clusterBorder: borderColor,
      titleColor: settings.titleColor,
      edgeLabelBackground: codeBg,
      nodeTextColor: textColor,
      fontSize: "14px",
      fontFamily: settings.bodyFont,
    },
  };
}
