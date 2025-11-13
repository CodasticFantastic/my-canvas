import { useEditorStore } from "@/store/canvas-editor/canvas-editor.store";
import { useState, useEffect, useRef } from "react";

interface Dimensions {
  width: number;
  height: number;
}

export const useCanvasDimensions = () => {
  const { setIsCanvasInitializing, isCanvasInitializing } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        setIsCanvasInitializing(false);
      }
    };

    // Set initial dimensions
    updateDimensions();

    // ResizeObserver to track container size changes
    const resizeObserver = new ResizeObserver(updateDimensions);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return { containerRef, dimensions, isLoading: isCanvasInitializing };
};
