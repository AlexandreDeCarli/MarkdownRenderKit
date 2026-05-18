import { defaultSettings } from "../domain/entities/settings.js";

const STORAGE_KEY = "markdownRenderKitSettings";

/**
 * Carrega as configurações do localStorage.
 * Mescla com defaultSettings para garantir chaves ausentes.
 * @returns {import("../domain/entities/settings").Settings}
 */
export function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.warn("Erro ao carregar configurações do localStorage:", error);
  }
  return defaultSettings;
}

/**
 * Persiste as configurações no localStorage.
 * @param {import("../domain/entities/settings").Settings} settings
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Erro ao salvar configurações no localStorage:", error);
  }
}
