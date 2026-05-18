/** @type {Array<{label: string, value: string}>} */
export const fontOptions = [
  { label: "Inter", value: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { label: "Roboto", value: "Roboto, system-ui, sans-serif" },
  { label: "Lato", value: "Lato, system-ui, sans-serif" },
  { label: "Montserrat", value: "Montserrat, system-ui, sans-serif" },
  { label: "Merriweather", value: "Merriweather, Georgia, serif" },
  { label: "Lora", value: "Lora, Georgia, serif" },
  { label: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
];

/** @type {Array<{label: string, value: string}>} */
export const codeFontOptions = [
  { label: "JetBrains Mono", value: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace" },
  { label: "Fira Code", value: "'Fira Code', 'SFMono-Regular', Consolas, monospace" },
  { label: "SF Mono", value: "'SFMono-Regular', Consolas, monospace" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
];

/**
 * @typedef {Object} Settings
 * @property {string} bodyFont
 * @property {string} headingFont
 * @property {string} codeFont
 * @property {string} titleColor
 * @property {string} h2Color
 * @property {string} highlightColor
 * @property {string} highlightTextColor
 * @property {string} linkColor
 * @property {string} pageBg
 * @property {string} paperBg
 * @property {string} flowPrimaryBg
 * @property {string} flowPrimaryBorder
 * @property {string} flowSecondaryBg
 * @property {string} flowSecondaryBorder
 * @property {string} flowTertiaryBg
 * @property {string} flowTertiaryBorder
 * @property {string} flowLineColor
 * @property {string} flowTextColor
 * @property {number} fontSize
 * @property {number} lineHeight
 * @property {number} pageWidth
 * @property {number} pagePadding
 * @property {string} paperSize
 * @property {number} printMargin
 * @property {string} documentName
 * @property {string} watermarkUrl
 */

/** @type {Settings} */
export const defaultSettings = {
  bodyFont: fontOptions[0].value,
  headingFont: fontOptions[3].value,
  codeFont: codeFontOptions[0].value,
  titleColor: "#111827",
  h2Color: "#2563eb",
  highlightColor: "#fef08a",
  highlightTextColor: "#713f12",
  linkColor: "#2563eb",
  pageBg: "#f8fafc",
  paperBg: "#ffffff",
  // Flowchart / Mermaid colors
  flowPrimaryBg: "#dbeafe",
  flowPrimaryBorder: "#2563eb",
  flowSecondaryBg: "#e0e7ff",
  flowSecondaryBorder: "#4f46e5",
  flowTertiaryBg: "#fef9c3",
  flowTertiaryBorder: "#ca8a04",
  flowLineColor: "#64748b",
  flowTextColor: "#1e293b",
  fontSize: 13,
  lineHeight: 1.72,
  pageWidth: 880,
  pagePadding: 32,
  paperSize: "A4",
  printMargin: 16,
  documentName: "",
  watermarkUrl: "",
};
