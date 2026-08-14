import { useEffect, useRef, useState, useCallback } from "react";
import {
  buildElementMap,
  calculatePreviewScrollTop,
  calculateEditorScrollTop,
} from "../../application/scrollSyncService.js";

/**
 * Hook que orquestra a sincronização bidirecional de rolagem entre o editor de texto
 * e o painel de visualização formatada, com suporte a diagramas Mermaid e ResizeObserver.
 *
 * @param {{
 *   editorRef: React.RefObject<HTMLTextAreaElement>,
 *   previewContainerRef: React.RefObject<HTMLDivElement>,
 *   mermaidVersion?: number
 * }} params
 * @returns {{
 *   syncEnabled: boolean,
 *   setSyncEnabled: React.Dispatch<React.SetStateAction<boolean>>,
 *   toggleSync: () => void,
 *   rebuildMap: () => void
 * }}
 */
export function useScrollSync({ editorRef, previewContainerRef, mermaidVersion = 0 }) {
  const [syncEnabled, setSyncEnabled] = useState(true);
  const activeDriverRef = useRef(null); // 'editor' | 'preview' | null
  const resetDriverTimeoutRef = useRef(null);
  const mapRef = useRef([]);
  const isScrollingProgrammaticallyRef = useRef(false);
  const rafIdRef = useRef(null);

  const rebuildMap = useCallback(() => {
    if (!editorRef.current || !previewContainerRef.current) return;
    mapRef.current = buildElementMap(previewContainerRef.current, editorRef.current);
  }, [editorRef, previewContainerRef]);

  // Recalcula o mapa sempre que o Mermaid terminar de renderizar ou o preview mudar
  useEffect(() => {
    const timer = setTimeout(() => {
      rebuildMap();
    }, 120);
    return () => clearTimeout(timer);
  }, [mermaidVersion, rebuildMap]);

  // Observa mudanças de dimensão no container e documento para manter o mapa atualizado
  useEffect(() => {
    const previewContainer = previewContainerRef.current;
    if (!previewContainer || typeof ResizeObserver === "undefined") return;

    let resizeTimer = null;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        rebuildMap();
      }, 80);
    });

    observer.observe(previewContainer);
    const article = previewContainer.querySelector("article");
    if (article) observer.observe(article);

    return () => {
      clearTimeout(resizeTimer);
      observer.disconnect();
    };
  }, [previewContainerRef, rebuildMap, mermaidVersion]);

  // Configura os listeners de rolagem e prevenção de loops
  useEffect(() => {
    const editorEl = editorRef.current;
    const previewEl = previewContainerRef.current;
    if (!editorEl || !previewEl || !syncEnabled) return;

    const setDriver = (driver) => {
      activeDriverRef.current = driver;
      if (resetDriverTimeoutRef.current) {
        clearTimeout(resetDriverTimeoutRef.current);
      }
      resetDriverTimeoutRef.current = setTimeout(() => {
        activeDriverRef.current = null;
      }, 150);
    };

    // Eventos de entrada para identificar qual painel o usuário está interagindo
    const handleEditorPointer = () => setDriver("editor");
    const handlePreviewPointer = () => setDriver("preview");

    editorEl.addEventListener("wheel", handleEditorPointer, { passive: true });
    editorEl.addEventListener("pointerdown", handleEditorPointer, { passive: true });
    editorEl.addEventListener("touchstart", handleEditorPointer, { passive: true });
    editorEl.addEventListener("keydown", handleEditorPointer, { passive: true });

    previewEl.addEventListener("wheel", handlePreviewPointer, { passive: true });
    previewEl.addEventListener("pointerdown", handlePreviewPointer, { passive: true });
    previewEl.addEventListener("touchstart", handlePreviewPointer, { passive: true });

    // Listener de rolagem do Editor
    const handleEditorScroll = () => {
      if (!syncEnabled) return;
      if (activeDriverRef.current === "preview") return;
      if (isScrollingProgrammaticallyRef.current) return;

      activeDriverRef.current = "editor";

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        if (!mapRef.current || mapRef.current.length === 0) {
          rebuildMap();
        }

        const targetTop = calculatePreviewScrollTop(
          editorEl.scrollTop,
          editorEl,
          previewEl,
          mapRef.current
        );

        if (Math.abs(previewEl.scrollTop - targetTop) > 1) {
          isScrollingProgrammaticallyRef.current = true;
          previewEl.scrollTop = targetTop;
          setTimeout(() => {
            isScrollingProgrammaticallyRef.current = false;
          }, 30);
        }
      });
    };

    // Listener de rolagem do Preview
    const handlePreviewScroll = () => {
      if (!syncEnabled) return;
      if (activeDriverRef.current === "editor") return;
      if (isScrollingProgrammaticallyRef.current) return;

      activeDriverRef.current = "preview";

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        if (!mapRef.current || mapRef.current.length === 0) {
          rebuildMap();
        }

        const targetTop = calculateEditorScrollTop(
          previewEl.scrollTop,
          editorEl,
          previewEl,
          mapRef.current
        );

        if (Math.abs(editorEl.scrollTop - targetTop) > 1) {
          isScrollingProgrammaticallyRef.current = true;
          editorEl.scrollTop = targetTop;
          setTimeout(() => {
            isScrollingProgrammaticallyRef.current = false;
          }, 30);
        }
      });
    };

    editorEl.addEventListener("scroll", handleEditorScroll, { passive: true });
    previewEl.addEventListener("scroll", handlePreviewScroll, { passive: true });

    return () => {
      editorEl.removeEventListener("wheel", handleEditorPointer);
      editorEl.removeEventListener("pointerdown", handleEditorPointer);
      editorEl.removeEventListener("touchstart", handleEditorPointer);
      editorEl.removeEventListener("keydown", handleEditorPointer);

      previewEl.removeEventListener("wheel", handlePreviewPointer);
      previewEl.removeEventListener("pointerdown", handlePreviewPointer);
      previewEl.removeEventListener("touchstart", handlePreviewPointer);

      editorEl.removeEventListener("scroll", handleEditorScroll);
      previewEl.removeEventListener("scroll", handlePreviewScroll);

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (resetDriverTimeoutRef.current) clearTimeout(resetDriverTimeoutRef.current);
    };
  }, [editorRef, previewContainerRef, syncEnabled, rebuildMap]);

  const toggleSync = useCallback(() => {
    setSyncEnabled((prev) => !prev);
  }, []);

  return {
    syncEnabled,
    setSyncEnabled,
    toggleSync,
    rebuildMap,
  };
}
