import { useCallback, useState } from "react";
import type Konva from "konva";
import { useCanvasStore } from "../store/canvas-editor.store";
import { Frame } from "../canvas-editor.types";

export function useFrameInteraction() {
  const { setActiveFrame, moveFrame, activeFrame } = useCanvasStore();
  const [hoveredFrameId, setHoveredFrameId] = useState<string | null>(null);

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
    (isResizing: boolean, resizeHandle: string | null, stageRef: React.RefObject<Konva.Stage | null>) => {
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

  const handleFrameDragStart = useCallback((e: Konva.KonvaEventObject<DragEvent>, isResizing: boolean) => {
    if (isResizing) {
      e.target.stopDrag();
    }
  }, []);

  const handleFrameDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, frame: Frame, isResizing: boolean) => {
      if (e.target !== e.currentTarget || isResizing) return;
      const node = e.currentTarget as Konva.Group;
      moveFrame(frame.id, { x: node.x(), y: node.y() });
    },
    [moveFrame]
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
    hoveredFrameId,
    isFrameHovered,
    isFrameActive,
    handleFrameClick,
    handleFrameMouseEnter,
    handleFrameMouseLeave,
    handleFrameDragStart,
    handleFrameDragEnd,
    handleStageClick,
  };
}
