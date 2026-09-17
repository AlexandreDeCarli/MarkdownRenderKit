/**
 * Serviço de mapeamento e cálculo geométrico de sincronização de rolagem.
 * Realiza ancoragem pela linha superior visível (Top-Line Anchor)
 * com interpolação linear contínua por trechos (Piecewise Linear Interpolation)
 * para manter o editor e o preview perfeitamente nivelados na mesma linha visual.
 */

/**
 * Obtém a altura da linha em pixels do textarea do editor.
 * @param {HTMLElement} editorEl
 * @returns {number}
 */
export function getEditorLineHeight(editorEl) {
  if (!editorEl || typeof window === "undefined") return 28;
  try {
    const style = window.getComputedStyle(editorEl);
    const lh = parseFloat(style.lineHeight);
    return Number.isFinite(lh) && lh > 0 ? lh : 28;
  } catch (e) {
    return 28;
  }
}

/**
 * Obtém o padding-top calculado de um elemento.
 * @param {HTMLElement} el
 * @returns {number}
 */
export function getPaddingTop(el) {
  if (!el || typeof window === "undefined") return 0;
  try {
    const style = window.getComputedStyle(el);
    const pt = parseFloat(style.paddingTop);
    return Number.isFinite(pt) && pt >= 0 ? pt : 0;
  } catch (e) {
    return 0;
  }
}

/**
 * Escapa strings para uso seguro no elemento mirror.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let mirrorEl = null;

/**
 * Mede as posições verticais reais (Y) de cada linha no editor textarea,
 * compensando quebras de linha automáticas (word wrapping) com exatidão de pixel.
 *
 * @param {HTMLTextAreaElement} editorEl
 * @returns {Float64Array|null} Array indexado por número de linha (1-based) com o offsetTop de cada linha
 */
export function getEditorLineTops(editorEl) {
  if (!editorEl || typeof window === "undefined" || !document.body) {
    return null;
  }

  const text = editorEl.value || "";
  if (!text) return null;

  const clientWidth = editorEl.clientWidth;
  if (!clientWidth || clientWidth <= 0) return null;

  if (!mirrorEl) {
    mirrorEl = document.createElement("div");
    mirrorEl.setAttribute("aria-hidden", "true");
    mirrorEl.style.position = "absolute";
    mirrorEl.style.top = "-99999px";
    mirrorEl.style.left = "-99999px";
    mirrorEl.style.visibility = "hidden";
    mirrorEl.style.pointerEvents = "none";
    mirrorEl.style.overflow = "hidden";
    mirrorEl.style.whiteSpace = "pre-wrap";
    mirrorEl.style.wordBreak = "break-word";
    mirrorEl.style.overflowWrap = "break-word";
    document.body.appendChild(mirrorEl);
  }

  const style = window.getComputedStyle(editorEl);
  mirrorEl.style.fontFamily = style.fontFamily;
  mirrorEl.style.fontSize = style.fontSize;
  mirrorEl.style.fontWeight = style.fontWeight;
  mirrorEl.style.fontStyle = style.fontStyle;
  mirrorEl.style.letterSpacing = style.letterSpacing;
  mirrorEl.style.lineHeight = style.lineHeight;
  mirrorEl.style.boxSizing = "border-box";
  mirrorEl.style.paddingTop = "0px";
  mirrorEl.style.paddingBottom = "0px";
  mirrorEl.style.paddingLeft = style.paddingLeft;
  mirrorEl.style.paddingRight = style.paddingRight;
  mirrorEl.style.borderLeft = style.borderLeft;
  mirrorEl.style.borderRight = style.borderRight;
  mirrorEl.style.width = clientWidth + "px";

  const lines = text.split("\n");
  const count = lines.length;
  mirrorEl.innerHTML = lines
    .map((line) => `<div style="margin:0;padding:0;box-sizing:border-box;">${line ? escapeHtml(line) : "&#8203;"}</div>`)
    .join("");

  const lineTops = new Float64Array(count + 2);
  const containerRect = mirrorEl.getBoundingClientRect();
  const children = mirrorEl.children;

  for (let i = 0; i < count; i++) {
    const child = children[i];
    if (child) {
      const childRect = child.getBoundingClientRect();
      lineTops[i + 1] = childRect.top - containerRect.top;
    }
  }

  if (count > 0 && children[count - 1]) {
    const lastRect = children[count - 1].getBoundingClientRect();
    lineTops[count + 1] = lastRect.bottom - containerRect.top;
  }

  return lineTops;
}

/**
 * Constrói o mapa de mapeamento geométrico entre as linhas do Markdown e os elementos do Preview.
 * Alinha o topo de cada elemento com a linha superior visível de conteúdo.
 *
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
  const previewPaddingTop = getPaddingTop(previewContainer);

  // Mede os offsets verticais reais das linhas do textarea compensando quebras de linha (wrap)
  const lineTops = getEditorLineTops(editorEl);

  const rawMap = [];

  elements.forEach((el) => {
    const startLine = parseInt(el.getAttribute("data-source-line"), 10);
    if (!Number.isFinite(startLine) || startLine < 1) return;

    const rawEnd = el.getAttribute("data-line-end");
    const endLine = rawEnd ? parseInt(rawEnd, 10) : startLine;

    const elRect = el.getBoundingClientRect();
    // Distância do topo do elemento até o topo rolável do container
    const rawTop = elRect.top - containerRect.top + currentScrollTop;
    // Posição de rolagem necessária para posicionar o elemento no topo da área visível de conteúdo
    const previewTop = Math.max(0, rawTop - previewPaddingTop);
    const previewHeight = el.offsetHeight || elRect.height || 20;
    const previewBottom = previewTop + previewHeight;

    let editorTop;
    let editorBottom;

    if (lineTops && startLine < lineTops.length) {
      editorTop = lineTops[startLine];
      const endLineClamped = Math.min(endLine, lineTops.length - 2);
      const nextLineTop = lineTops[endLineClamped + 1];
      if (typeof nextLineTop === "number" && nextLineTop > editorTop) {
        editorBottom = nextLineTop;
      } else {
        editorBottom = editorTop + lineHeight;
      }
    } else {
      editorTop = (startLine - 1) * lineHeight;
      editorBottom = Math.max(editorTop + lineHeight, endLine * lineHeight);
    }

    rawMap.push({
      startLine,
      endLine,
      editorTop,
      editorBottom,
      previewTop,
      previewBottom,
      previewHeight,
    });
  });

  if (rawMap.length === 0) return [];

  // Ordena por posição vertical no editor
  rawMap.sort((a, b) => a.editorTop - b.editorTop || a.previewTop - b.previewTop);

  // Se o primeiro bloco for na linha 1 ou editorTop <= 0, garante que previewTop comece em 0
  // para que o topo inicial de ambos os painéis coincida sem nenhum salto
  if (rawMap[0].editorTop === 0 || rawMap[0].startLine === 1) {
    const initialHeight = rawMap[0].previewHeight || 40;
    rawMap[0].previewTop = 0;
    rawMap[0].previewBottom = initialHeight;
  }

  // Remove redundâncias e garante monotonicidade estrita
  const map = [];
  for (const block of rawMap) {
    if (map.length === 0) {
      map.push(block);
      continue;
    }
    const prev = map[map.length - 1];
    if (block.editorTop === prev.editorTop) {
      // Mesma linha: mantém o mais representativo (maior altura)
      if (block.previewHeight > prev.previewHeight) {
        map[map.length - 1] = block;
      }
      continue;
    }
    if (block.previewTop < prev.previewTop) {
      block.previewTop = prev.previewTop;
      block.previewBottom = Math.max(block.previewBottom, prev.previewBottom);
    }
    map.push(block);
  }

  return map;
}

/**
 * Constrói a lista unificada e estritamente monótona de pontos de interpolação
 * abrangendo de (0, 0) até (editorMaxScroll, previewMaxScroll).
 *
 * @param {Array} map
 * @param {number} editorMaxScroll
 * @param {number} previewMaxScroll
 * @returns {Array<{ editor: number, preview: number }>}
 */
export function buildInterpolationPoints(map, editorMaxScroll, previewMaxScroll) {
  const points = [];
  points.push({ editor: 0, preview: 0 });

  if (map && map.length > 0) {
    for (const b of map) {
      if (typeof b.editorTop === "number" && typeof b.previewTop === "number") {
        points.push({ editor: Math.max(0, b.editorTop), preview: Math.max(0, b.previewTop) });
      }
      if (typeof b.editorBottom === "number" && typeof b.previewBottom === "number") {
        if (b.editorBottom > b.editorTop && b.previewBottom > b.previewTop) {
          points.push({ editor: Math.max(0, b.editorBottom), preview: Math.max(0, b.previewBottom) });
        }
      }
    }
  }

  points.push({ editor: editorMaxScroll, preview: previewMaxScroll });
  points.sort((a, b) => a.editor - b.editor || a.preview - b.preview);

  const clean = [];
  for (const p of points) {
    if (clean.length === 0) {
      clean.push(p);
      continue;
    }
    const prev = clean[clean.length - 1];
    if (p.editor <= prev.editor) {
      if (p.preview > prev.preview) {
        prev.preview = p.preview;
      }
      continue;
    }
    if (p.preview < prev.preview) {
      p.preview = prev.preview;
    }
    clean.push(p);
  }

  return clean;
}

/**
 * Calcula a posição de rolagem ideal do Preview a partir do ScrollTop do Editor,
 * alinhando sempre a linha mais superior visível do markdown com seu correspondente no preview.
 *
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
  if (editorScrollTop <= 0) return 0;
  if (editorScrollTop >= editorMaxScroll) return previewMaxScroll;

  const points = buildInterpolationPoints(map, editorMaxScroll, previewMaxScroll);
  if (points.length < 2) {
    return (editorScrollTop / editorMaxScroll) * previewMaxScroll;
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (editorScrollTop >= p1.editor && editorScrollTop <= p2.editor) {
      const range = p2.editor - p1.editor;
      if (range <= 0) return p1.preview;
      const ratio = (editorScrollTop - p1.editor) / range;
      return p1.preview + ratio * (p2.preview - p1.preview);
    }
  }

  return previewMaxScroll;
}

/**
 * Calcula a posição de rolagem ideal do Editor a partir do ScrollTop do Preview,
 * alinhando sempre o elemento mais superior visível do preview com a linha correspondente no markdown.
 *
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
  if (previewScrollTop <= 0) return 0;
  if (previewScrollTop >= previewMaxScroll) return editorMaxScroll;

  const points = buildInterpolationPoints(map, editorMaxScroll, previewMaxScroll);
  if (points.length < 2) {
    return (previewScrollTop / previewMaxScroll) * editorMaxScroll;
  }

  // Ordena os pontos por preview para a busca inversa
  const previewPoints = [...points].sort((a, b) => a.preview - b.preview || a.editor - b.editor);
  const cleanPreview = [];
  for (const p of previewPoints) {
    if (cleanPreview.length === 0) {
      cleanPreview.push(p);
      continue;
    }
    const prev = cleanPreview[cleanPreview.length - 1];
    if (p.preview <= prev.preview) {
      if (p.editor > prev.editor) prev.editor = p.editor;
      continue;
    }
    if (p.editor < prev.editor) p.editor = prev.editor;
    cleanPreview.push(p);
  }

  for (let i = 0; i < cleanPreview.length - 1; i++) {
    const p1 = cleanPreview[i];
    const p2 = cleanPreview[i + 1];
    if (previewScrollTop >= p1.preview && previewScrollTop <= p2.preview) {
      const range = p2.preview - p1.preview;
      if (range <= 0) return p1.editor;
      const ratio = (previewScrollTop - p1.preview) / range;
      return p1.editor + ratio * (p2.editor - p1.editor);
    }
  }

  return editorMaxScroll;
}
