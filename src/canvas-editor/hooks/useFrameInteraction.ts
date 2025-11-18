import { useCallback, useState } from "react";
import type Konva from "konva";
import { useCanvasStore } from "../store/canvas-editor.store";
import type { Frame, SideIndicator, StageRef } from "../canvas-editor.types";
import type { Dimensions } from "./useLiveDimensions";

type UseFrameInteractionOptions = {
  activeFrameData?: Frame | null;
  setLiveFrameDimensions?: (dimensions: Dimensions) => void;
  throttledSetStoreLiveFrameDimensions?: (dimensions: Dimensions) => void;
};

/**
 * Hook to handle frame interactions (click, hover, drag + live dimensions).
 */

export function useFrameInteraction(options?: UseFrameInteractionOptions) {
  const { setActiveFrame, moveFrame, activeFrame } = useCanvasStore();
  const [hoveredFrameId, setHoveredFrameId] = useState<string | null>(null);

  const { activeFrameData, setLiveFrameDimensions, throttledSetStoreLiveFrameDimensions } = options ?? {};

  const handleStageClick = useCallback(() => {
    setActiveFrame(null);
  }, [setActiveFrame]);

  const handleFrameClick = useCallback(
    (frameId: string, isResizing: boolean) => {
      if (!isResizing) {
        setActiveFrame(frameId);
      }
    },
    [setActiveFrame]
  );

  const handleFrameMouseEnter = useCallback((frameId: string, isResizing: boolean) => {
    if (!isResizing) {
      setHoveredFrameId(frameId);
    }
  }, []);

  const handleFrameMouseLeave = useCallback(
    (isResizing: boolean, resizeHandle: SideIndicator | null, stageRef: StageRef) => {
      if (!isResizing) {
        setHoveredFrameId(null);
        if (!resizeHandle) {
          const stage = stageRef.current;
          if (stage) {
            stage.container().style.cursor = "default";
          }
        }
      }
    },
    []
  );

  const handleFrameDragStart = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, frame: Frame, isResizing: boolean) => {
      // Only stop drag if the event target is the frame Group itself, not its children
      // This allows elements inside the frame to be draggable even when frame is locked
      if (e.target !== e.currentTarget) {
        // Event is from a child element, let it handle its own drag
        return;
      }

      if (isResizing || frame.locked) {
        e.target.stopDrag();
        return;
      }
      setActiveFrame(frame.id);
    },
    [setActiveFrame]
  );

  const handleFrameDragMove = useCallback(
    (frameId: string, position: { x: number; y: number }) => {
      if (!activeFrameData || !setLiveFrameDimensions || !throttledSetStoreLiveFrameDimensions) return;
      if (activeFrameData.id !== frameId) return;
      if (activeFrameData.locked) return;

      const next: Dimensions = {
        x: position.x,
        y: position.y,
        width: activeFrameData.width,
        height: activeFrameData.height,
      };
      setLiveFrameDimensions(next);
      throttledSetStoreLiveFrameDimensions(next);
    },
    [activeFrameData, setLiveFrameDimensions, throttledSetStoreLiveFrameDimensions]
  );

  const handleFrameDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, frame: Frame, isResizing: boolean) => {
      if (e.target !== e.currentTarget || isResizing || frame.locked) return;
      const node = e.currentTarget as Konva.Group;
      moveFrame(frame.id, { x: node.x(), y: node.y() });
      setActiveFrame(frame.id);
    },
    [moveFrame, setActiveFrame]
  );

  const isFrameHovered = useCallback(
    (frameId: string) => {
      return hoveredFrameId === frameId;
    },
    [hoveredFrameId]
  );

  const isFrameActive = useCallback(
    (frameId: string) => {
      return activeFrame?.id === frameId;
    },
    [activeFrame]
  );

  return {
    isFrameHovered,
    isFrameActive,
    handleFrameClick,
    handleFrameMouseEnter,
    handleFrameMouseLeave,
    handleFrameDragStart,
    handleFrameDragMove,
    handleFrameDragEnd,
    handleStageClick,
  };
}
