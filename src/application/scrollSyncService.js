/**
 * Serviço de mapeamento e cálculo geométrico de sincronização de rolagem.
 * Realiza interpolação linear por trechos (Piecewise Linear Interpolation)
 * para sincronizar o editor e a visualização formatada com precisão absoluta,
 * compensando diferenças de altura em blocos Mermaid, imagens, tabelas e títulos.
 */

/**
 * Obtém a altura da linha em pixels do textarea do editor.
 * @param {HTMLElement} editorEl
 * @returns {number}
 */
export function getEditorLineHeight(editorEl) {
  if (!editorEl || typeof window === "undefined") return 28;
  const style = window.getComputedStyle(editorEl);
  const lh = parseFloat(style.lineHeight);
  return Number.isFinite(lh) && lh > 0 ? lh : 28;
}

/**
 * Constrói o mapa de mapeamento geométrico entre as linhas do Markdown e os elementos do Preview.
 * @param {HTMLElement} previewContainer - O container de rolagem do preview
 * @param {HTMLElement} editorEl - O textarea do editor
 * @returns {Array<{ startLine: number, endLine: number, editorTop: number, editorBottom: number, previewTop: number, previewBottom: number, previewHeight: number }>}
 */
export function buildElementMap(previewContainer, editorEl) {
  if (!previewContainer || !editorEl || typeof window === "undefined") return [];

  const elements = previewContainer.querySelectorAll("[data-source-line]");
  if (!elements || elements.length === 0) return [];

  const lineHeight = getEditorLineHeight(editorEl);
  const containerRect = previewContainer.getBoundingClientRect();
  const currentScrollTop = previewContainer.scrollTop;

  const map = [];

  elements.forEach((el) => {
    const startLine = parseInt(el.getAttribute("data-source-line"), 10);
    if (!Number.isFinite(startLine) || startLine < 1) return;

    const rawEnd = el.getAttribute("data-line-end");
    const endLine = rawEnd ? parseInt(rawEnd, 10) : startLine;

    const elRect = el.getBoundingClientRect();
    // Posição vertical relativa ao conteúdo rolável do container
    const previewTop = elRect.top - containerRect.top + currentScrollTop;
    const previewHeight = el.offsetHeight || elRect.height || 20;
    const previewBottom = previewTop + previewHeight;

    const editorTop = (startLine - 1) * lineHeight;
    const editorBottom = Math.max(editorTop + lineHeight, endLine * lineHeight);

    map.push({
      startLine,
      endLine,
      editorTop,
      editorBottom,
      previewTop,
      previewBottom,
      previewHeight,
    });
  });

  // Ordena por posição vertical
  map.sort((a, b) => a.editorTop - b.editorTop);
  return map;
}

/**
 * Calcula a posição de rolagem ideal do Preview a partir do ScrollTop do Editor.
 * @param {number} editorScrollTop
 * @param {HTMLElement} editorEl
 * @param {HTMLElement} previewContainer
 * @param {Array} map
 * @returns {number}
 */
export function calculatePreviewScrollTop(editorScrollTop, editorEl, previewContainer, map) {
  if (!editorEl || !previewContainer) return 0;

  const editorMaxScroll = Math.max(0, editorEl.scrollHeight - editorEl.clientHeight);
  const previewMaxScroll = Math.max(0, previewContainer.scrollHeight - previewContainer.clientHeight);

  if (editorMaxScroll <= 0 || previewMaxScroll <= 0) return 0;
  if (editorScrollTop <= 2) return 0;
  if (editorScrollTop >= editorMaxScroll - 2) return previewMaxScroll;

  if (!map || map.length === 0) {
    return (editorScrollTop / editorMaxScroll) * previewMaxScroll;
  }

  // Antes do primeiro bloco mapeado
  if (editorScrollTop < map[0].editorTop) {
    if (map[0].editorTop <= 0) return map[0].previewTop;
    const ratio = editorScrollTop / map[0].editorTop;
    return ratio * map[0].previewTop;
  }

  // Depois do último bloco mapeado
  const lastBlock = map[map.length - 1];
  if (editorScrollTop >= lastBlock.editorBottom) {
    const remainingEditor = editorMaxScroll - lastBlock.editorBottom;
    if (remainingEditor <= 0) return previewMaxScroll;
    const ratio = (editorScrollTop - lastBlock.editorBottom) / remainingEditor;
    return lastBlock.previewBottom + ratio * Math.max(0, previewMaxScroll - lastBlock.previewBottom);
  }

  // Percorre os blocos para encontrar onde o scroll do editor se localiza
  for (let i = 0; i < map.length; i++) {
    const current = map[i];

    // Caso 1: O scroll está dentro do próprio bloco (ex.: diagrama Mermaid ou bloco de código)
    if (editorScrollTop >= current.editorTop && editorScrollTop <= current.editorBottom) {
      const editorRange = current.editorBottom - current.editorTop;
      const ratio = editorRange > 0 ? (editorScrollTop - current.editorTop) / editorRange : 0;
      return current.previewTop + ratio * current.previewHeight;
    }

    // Caso 2: O scroll está no espaço entre o bloco atual e o próximo
    if (i < map.length - 1) {
      const next = map[i + 1];
      if (editorScrollTop > current.editorBottom && editorScrollTop < next.editorTop) {
        const gapEditor = next.editorTop - current.editorBottom;
        const gapPreview = next.previewTop - current.previewBottom;
        const ratio = gapEditor > 0 ? (editorScrollTop - current.editorBottom) / gapEditor : 0;
        return current.previewBottom + ratio * gapPreview;
      }
    }
  }

  // Fallback por proporção
  return (editorScrollTop / editorMaxScroll) * previewMaxScroll;
}

/**
 * Calcula a posição de rolagem ideal do Editor a partir do ScrollTop do Preview.
 * @param {number} previewScrollTop
 * @param {HTMLElement} editorEl
 * @param {HTMLElement} previewContainer
 * @param {Array} map
 * @returns {number}
 */
export function calculateEditorScrollTop(previewScrollTop, editorEl, previewContainer, map) {
  if (!editorEl || !previewContainer) return 0;

  const editorMaxScroll = Math.max(0, editorEl.scrollHeight - editorEl.clientHeight);
  const previewMaxScroll = Math.max(0, previewContainer.scrollHeight - previewContainer.clientHeight);

  if (editorMaxScroll <= 0 || previewMaxScroll <= 0) return 0;
  if (previewScrollTop <= 2) return 0;
  if (previewScrollTop >= previewMaxScroll - 2) return editorMaxScroll;

  if (!map || map.length === 0) {
    return (previewScrollTop / previewMaxScroll) * editorMaxScroll;
  }

  // Antes do primeiro bloco mapeado
  if (previewScrollTop < map[0].previewTop) {
    if (map[0].previewTop <= 0) return map[0].editorTop;
    const ratio = previewScrollTop / map[0].previewTop;
    return ratio * map[0].editorTop;
  }

  // Depois do último bloco mapeado
  const lastBlock = map[map.length - 1];
  if (previewScrollTop >= lastBlock.previewBottom) {
    const remainingPreview = previewMaxScroll - lastBlock.previewBottom;
    if (remainingPreview <= 0) return editorMaxScroll;
    const ratio = (previewScrollTop - lastBlock.previewBottom) / remainingPreview;
    return lastBlock.editorBottom + ratio * Math.max(0, editorMaxScroll - lastBlock.editorBottom);
  }

  // Percorre os blocos para encontrar onde o scroll do preview se localiza
  for (let i = 0; i < map.length; i++) {
    const current = map[i];

    // Caso 1: O scroll está dentro do próprio bloco (ex.: diagrama Mermaid renderizado)
    if (previewScrollTop >= current.previewTop && previewScrollTop <= current.previewBottom) {
      const previewRange = current.previewBottom - current.previewTop;
      const ratio = previewRange > 0 ? (previewScrollTop - current.previewTop) / previewRange : 0;
      const editorRange = current.editorBottom - current.editorTop;
      return current.editorTop + ratio * editorRange;
    }

    // Caso 2: O scroll está no espaço entre o bloco atual e o próximo
    if (i < map.length - 1) {
      const next = map[i + 1];
      if (previewScrollTop > current.previewBottom && previewScrollTop < next.previewTop) {
        const gapPreview = next.previewTop - current.previewBottom;
        const gapEditor = next.editorTop - current.editorBottom;
        const ratio = gapPreview > 0 ? (previewScrollTop - current.previewBottom) / gapPreview : 0;
        return current.editorBottom + ratio * gapEditor;
      }
    }
  }

  // Fallback por proporção
  return (previewScrollTop / previewMaxScroll) * editorMaxScroll;
}
