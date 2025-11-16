import { useCallback, useRef } from "react";
import type { KonvaEventObject } from "konva/lib/Node";

export const useCanvasDrag = (
  setLayerOffset: (updater: (prev: { x: number; y: number }) => { x: number; y: number }) => void,
  isPanningRef: React.RefObject<boolean>
) => {
  const isDragging = useRef(false);
  const lastPointerPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const isMiddleButton = e.evt.button === 1;

      if (isMiddleButton) {
        e.evt.preventDefault();
        isDragging.current = true;
        isPanningRef.current = true;
        const stage = e.target.getStage();
        const pointerPos = stage?.getPointerPosition();
        if (pointerPos) {
          lastPointerPos.current = pointerPos;
        }
      }
    },
    [isPanningRef]
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isDragging.current || !lastPointerPos.current) return;

      const stage = e.target.getStage();
      const pointerPos = stage?.getPointerPosition();
      if (!pointerPos) return;

      const dx = lastPointerPos.current.x - pointerPos.x;
      const dy = lastPointerPos.current.y - pointerPos.y;

      setLayerOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      lastPointerPos.current = pointerPos;
    },
    [setLayerOffset]
  );

  const finishPan = useCallback(() => {
    isDragging.current = false;
    isPanningRef.current = false;
    lastPointerPos.current = null;
  }, [isPanningRef]);

  const handleMouseUp = useCallback(() => {
    finishPan();
  }, [finishPan]);

  const handleMouseLeave = useCallback(() => {
    finishPan();
  }, [finishPan]);

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  };
};
