import { useState, useRef, useCallback } from "react";
import { useCanvasStore } from "../store/canvas-editor.store";

export type Dimensions = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Hook do zarządzania live dimensions dla elementów i frame podczas drag/resize.
 * Używa lokalnego stanu dla płynności i throttling dla aktualizacji store (dla panelu właściwości).
 */
export function useLiveDimensions() {
  const setStoreLiveFrameDimensions = useCanvasStore((state) => state.setLiveFrameDimensions);

  // Lokalny stan dla wymiarów elementów podczas przeciągania
  const [liveElementDimensions, setLiveElementDimensions] = useState<Dimensions | null>(null);

  // Lokalny stan dla wymiarów frame podczas przeciągania / resize
  const [liveFrameDimensions, setLiveFrameDimensions] = useState<Dimensions | null>(null);

  // Throttling dla aktualizacji store - aktualizujemy tylko co 50ms
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStoreUpdateRef = useRef<Dimensions | null>(null);

  const throttledSetStoreLiveFrameDimensions = useCallback(
    (dimensions: Dimensions) => {
      pendingStoreUpdateRef.current = dimensions;

      if (!throttleTimeoutRef.current) {
        throttleTimeoutRef.current = setTimeout(() => {
          if (pendingStoreUpdateRef.current) {
            setStoreLiveFrameDimensions(pendingStoreUpdateRef.current);
            pendingStoreUpdateRef.current = null;
          }
          throttleTimeoutRef.current = null;
        }, 50); // Aktualizuj store co 50ms (20 FPS dla panelu)
      }
    },
    [setStoreLiveFrameDimensions]
  );

  const clearThrottleAndUpdateStore = useCallback(() => {
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current);
      throttleTimeoutRef.current = null;
    }
    if (pendingStoreUpdateRef.current) {
      setStoreLiveFrameDimensions(pendingStoreUpdateRef.current);
      pendingStoreUpdateRef.current = null;
    }
    setStoreLiveFrameDimensions(null);
  }, [setStoreLiveFrameDimensions]);

  const clearLiveFrameDimensions = useCallback(() => {
    setLiveFrameDimensions(null);
    clearThrottleAndUpdateStore();
  }, [clearThrottleAndUpdateStore]);

  return {
    liveElementDimensions,
    setLiveElementDimensions,
    liveFrameDimensions,
    setLiveFrameDimensions,
    throttledSetStoreLiveFrameDimensions,
    clearLiveFrameDimensions,
  };
}
