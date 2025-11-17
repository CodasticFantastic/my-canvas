import { useLayoutEffect } from "react";
import { useCanvasStore } from "../store/canvas-editor.store";
import { useStoreHydration } from "./useStoreHydration";

/**
 * Hook do zarządzania rozmiarem canvas - używa ResizeObserver do automatycznego dopasowania.
 */
export function useCanvasSize(containerRef: React.RefObject<HTMLDivElement | null>) {
  const isStoreHydrated = useStoreHydration();
  const setSize = useCanvasStore((state) => state.setCanvasSize);

  useLayoutEffect(() => {
    if (!isStoreHydrated || !containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setSize(Math.floor(cr.width), Math.floor(cr.height));
      }
    });
    ro.observe(el);

    const rect = el.getBoundingClientRect();
    setSize(Math.floor(rect.width), Math.floor(rect.height));
    return () => ro.disconnect();
  }, [setSize, isStoreHydrated, containerRef]);
}
