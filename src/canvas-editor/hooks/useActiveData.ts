import { useMemo } from "react";
import { useCanvasStore } from "../store/canvas-editor.store";
import type { Frame, CanvasElement } from "../canvas-editor.types";

/**
 * Hook to calculate active element and frame data.
 */
export function useActiveData() {
  const activePage = useCanvasStore((state) => state.activePage);
  const activeElement = useCanvasStore((state) => state.activeElement);
  const activeFrame = useCanvasStore((state) => state.activeFrame);

  // Find active element and its dimensions
  const activeElementData = useMemo<{ frame: Frame; element: CanvasElement } | null>(() => {
    if (!activeElement || !activePage) return null;
    const frame = activePage.frames.find((f) => f.id === activeElement.frameId);
    if (!frame) return null;
    const element = frame.elements.find((el) => el.id === activeElement.elementId);
    if (!element) return null;
    return { frame, element };
  }, [activeElement, activePage]);

  // Active frame data
  const activeFrameData = useMemo<Frame | null>(() => {
    return activeFrame && !activeElement ? activeFrame : null;
  }, [activeFrame, activeElement]);

  return {
    activeElementData,
    activeFrameData,
  };
}
