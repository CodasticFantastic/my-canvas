import { useCallback } from "react";
import type Konva from "konva";
import type { Frame, SideIndicator } from "../canvas-editor.types";
import type { Dimensions } from "./useLiveDimensions";

export function useFrameResizeWithDimensions(
  activeFrameData: Frame | null,
  setLiveFrameDimensions: (dimensions: Dimensions) => void,
  throttledSetStoreLiveFrameDimensions: (dimensions: Dimensions) => void,
  handleResizeMove: (e: Konva.KonvaEventObject<DragEvent>, frame: Frame, handle: SideIndicator) => void
) {
  const handleResizeMoveWithDimensions = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, frame: Frame | null, handle: SideIndicator) => {
      if (!frame) return;
      handleResizeMove(e, frame, handle);

      // Aktualizuj wymiary w czasie rzeczywistym
      if (activeFrameData && activeFrameData.id === frame.id) {
        const parent = e.target.getParent();
        if (!parent) return;
        const frameRect = parent.findOne((node: Konva.Node) => node.name() === "frame-rect");
        if (frameRect) {
          const currentX = parent.x();
          const currentY = parent.y();
          const currentWidth = frameRect.width();
          const currentHeight = frameRect.height();

          const next: Dimensions = {
            x: currentX,
            y: currentY,
            width: currentWidth,
            height: currentHeight,
          };
          setLiveFrameDimensions(next);
          throttledSetStoreLiveFrameDimensions(next);
        }
      }
    },
    [activeFrameData, handleResizeMove, setLiveFrameDimensions, throttledSetStoreLiveFrameDimensions]
  );

  return {
    handleResizeMoveWithDimensions,
  };
}
