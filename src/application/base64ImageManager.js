/**
 * Serviço de Gerenciamento e Virtualização de Imagens Base64.
 *
 * Otimiza a performance ao manipular documentos Markdown pesados com imagens base64 embutidas
 * (ex: arquivos de 40MB com múltiplos megabytes de imagens).
 *
 * Princípios de Design:
 * 1. Zero Overhead para documentos normais: verificação O(1) com includes("data:image/").
 * 2. Virtualização em Blob URLs: substitui payloads gigantes de 3MB de texto por URLs curtas
 *    (ex: blob:http://... ou tokens internos), reduzindo a árvore de parsing de 40MB para ~40KB.
 * 3. Cache por Fingerprint: evita re-decodificar a mesma imagem entre edições sucessivas (0ms).
 * 4. Prevenção de Layout Thrashing: alivia a carga do analisador léxico, DOMPurify e renderizador React.
 * 5. Reversibilidade Total: permite restaurar as imagens base64 originais para cópia ou exportação independente.
 */

// Cache de Blob URLs indexado por fingerprint rápido da imagem
const blobCacheByFingerprint = new Map();
// Mapeamento reverso para restaurar base64 a partir do Blob URL
const dataUriByBlobUrl = new Map();

let internalTokenCounter = 0;

/**
 * Verifica rapidamente se o texto contém imagens em data URI base64.
 * Custo praticamente zero (0.001ms) para 99% das edições normais.
 * @param {string} text
 * @returns {boolean}
 */
export function hasBase64Images(text) {
  return typeof text === "string" && text.length > 50 && text.includes("data:image/");
}

/**
 * Gera um fingerprint O(1) ultra-rápido para uma data URI base64
 * sem precisar computar hashes custosos em strings de milhões de caracteres.
 * @param {string} dataUri
 * @returns {string}
 */
export function getImageFingerprint(dataUri) {
  const len = dataUri.length;
  const prefix = dataUri.slice(0, 80);
  const suffix = dataUri.slice(-80);
  return `${len}:${prefix}:${suffix}`;
}

/**
 * Converte data URI base64 em Blob binário nativo.
 * Suporta navegador (atob + Uint8Array) e Node.js (Buffer).
 * @param {string} dataUri
 * @returns {Blob|null}
 */
export function dataUriToBlob(dataUri) {
  if (!dataUri || typeof dataUri !== "string") return null;

  const commaIdx = dataUri.indexOf(",");
  if (commaIdx === -1) return null;

  const meta = dataUri.slice(0, commaIdx);
  const rawBase64 = dataUri.slice(commaIdx + 1);
  const mimeMatch = meta.match(/data:([^;]+)/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/png";

  try {
    // Ambiente Node.js (testes e utilitários)
    if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
      const buf = Buffer.from(rawBase64.replace(/\s+/g, ""), "base64");
      return new Blob([buf], { type: mimeType });
    }

    // Ambiente Navegador (Browser DOM)
    if (typeof atob === "function") {
      const cleanBase64 = rawBase64.indexOf("\n") !== -1 || rawBase64.indexOf("\r") !== -1 || rawBase64.indexOf(" ") !== -1
        ? rawBase64.replace(/\s+/g, "")
        : rawBase64;
      const binaryString = atob(cleanBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: mimeType });
    }
  } catch (err) {
    console.warn("Falha ao converter dataUri para Blob:", err);
  }

  return null;
}

/**
 * Obtém ou cria uma Blob URL para a data URI base64 fornecida.
 * Se já existir em cache (mesmo fingerprint), reutiliza instantaneamente.
 * @param {string} dataUri
 * @returns {string} Blob URL ou token interno
 */
export function getOrCreateBlobUrl(dataUri) {
  const fp = getImageFingerprint(dataUri);

  if (blobCacheByFingerprint.has(fp)) {
    return blobCacheByFingerprint.get(fp);
  }

  // Tenta criar ObjectURL nativo no navegador
  if (
    typeof window !== "undefined" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function"
  ) {
    try {
      const blob = dataUriToBlob(dataUri);
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        blobCacheByFingerprint.set(fp, blobUrl);
        dataUriByBlobUrl.set(blobUrl, dataUri);
        return blobUrl;
      }
    } catch (e) {
      console.warn("Erro ao invocar createObjectURL:", e);
    }
  }

  // Fallback para Node.js ou caso createObjectURL não esteja disponível
  const internalToken = `blob:mock-image/${++internalTokenCounter}`;
  blobCacheByFingerprint.set(fp, internalToken);
  dataUriByBlobUrl.set(internalToken, dataUri);
  return internalToken;
}

/**
 * Substitui URIs base64 pesadas por URLs otimizadas (Blob URLs)
 * antes do processamento no lexer e no DOMPurify.
 * Preserva quebras de linha exatas para não alterar contagem de linhas do editor.
 *
 * @param {string} markdown
 * @param {number} [minThreshold=512] Tamanho mínimo em caracteres para virtualizar
 * @returns {{ optimizedMarkdown: string, hasBase64Images: boolean, tokenMap: Map<string, string> }}
 */
export function virtualizeBase64Images(markdown, minThreshold = 512) {
  if (!hasBase64Images(markdown)) {
    return { optimizedMarkdown: markdown, hasBase64Images: false, tokenMap: null };
  }

  const tokenMap = new Map();
  // Regex eficiente e sem backtracking para capturar data URIs de imagem
  const dataUriRegex = /data:image\/[a-zA-Z0-9+.-]+;base64,[^)"'>\s]+/g;

  const optimizedMarkdown = markdown.replace(dataUriRegex, (match) => {
    // Imagens minúsculas (ex: ícones ou placeholders < minThreshold) não causam gargalo
    if (match.length < minThreshold) {
      return match;
    }

    const url = getOrCreateBlobUrl(match);
    tokenMap.set(url, match);
    return url;
  });

  return {
    optimizedMarkdown,
    hasBase64Images: tokenMap.size > 0,
    tokenMap,
  };
}

/**
 * Restaura imagens base64 originais em uma string HTML que contém Blob URLs ou tokens.
 * Usado para exportação, cópia para área de transferência e geração de HTML autônomo.
 *
 * @param {string} html
 * @param {Map<string, string>} [localTokenMap]
 * @returns {string}
 */
export function restoreBase64Images(html, localTokenMap = null) {
  if (!html || typeof html !== "string") return "";
  if (!html.includes("blob:")) return html;

  // Regex para encontrar URLs blob: geradas
  return html.replace(/blob:[^"'\s>)]+/g, (blobUrl) => {
    if (localTokenMap && localTokenMap.has(blobUrl)) {
      return localTokenMap.get(blobUrl);
    }
    if (dataUriByBlobUrl.has(blobUrl)) {
      return dataUriByBlobUrl.get(blobUrl);
    }
    return blobUrl;
  });
}

/**
 * Limpa o cache de Blob URLs e revoga os objetos na memória do navegador
 * para evitar vazamentos de memória (memory leaks).
 */
export function clearBase64ImageCache() {
  if (typeof window !== "undefined" && typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
    for (const blobUrl of blobCacheByFingerprint.values()) {
      if (blobUrl.startsWith("blob:") && !blobUrl.startsWith("blob:mock-image/")) {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch (e) {}
      }
    }
  }
  blobCacheByFingerprint.clear();
  dataUriByBlobUrl.clear();
  internalTokenCounter = 0;
}

/**
 * Retorna estatísticas de uso do cache de imagens.
 * @returns {{ cachedImagesCount: number }}
 */
export function getBase64CacheStats() {
  return {
    cachedImagesCount: blobCacheByFingerprint.size,
  };
}
