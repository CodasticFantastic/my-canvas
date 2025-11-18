import { useCallback, useRef, useState } from "react";
import type Konva from "konva";
import { useCanvasStore } from "../store/canvas-editor.store";
import { Frame, SideIndicator } from "../canvas-editor.types";

type ResizeStartState = {
  width: number;
  height: number;
  x: number;
  y: number;
  frameX: number;
  frameY: number;
  frameId: string;
};

export function useFrameResize() {
  const { zoom, panOffsetX, panOffsetY, updateFrameSize, moveFrame, setActiveFrame } = useCanvasStore();
  const [resizeHandle, setResizeHandle] = useState<SideIndicator | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<ResizeStartState | null>(null);

  const handleResizeStart = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, frame: Frame, handle: SideIndicator) => {
      e.cancelBubble = true;
      setIsResizing(true);
      setResizeHandle(handle);
      setActiveFrame(frame.id);
      resizeStartRef.current = {
        width: frame.width,
        height: frame.height,
        x: e.target.x(),
        y: e.target.y(),
        frameX: frame.x,
        frameY: frame.y,
        frameId: frame.id,
      };
    },
    [setActiveFrame]
  );

  const handleResizeMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, frame: Frame, handle: SideIndicator) => {
      e.cancelBubble = true;
      if (!resizeStartRef.current || resizeStartRef.current.frameId !== frame.id) return;

      const stage = e.target.getStage();
      if (!stage) return;
      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;
      const parent = e.target.getParent();
      if (!parent) return;

      const canvasX = (pointerPos.x - panOffsetX) / zoom;
      const canvasY = (pointerPos.y - panOffsetY) / zoom;
      const currentFrameX = parent.x();
      const currentFrameY = parent.y();

      const frameRect = parent.findOne((node: Konva.Node) => node.name() === "frame-rect");

      switch (handle) {
        case "right": {
          const newWidth = Math.max(50, canvasX - currentFrameX + 5 / zoom);

          if (frameRect) {
            frameRect.width(newWidth);
          }
          const node = e.target;
          node.x(newWidth - 5 / zoom);

          resizeStartRef.current.width = newWidth;
          break;
        }
        case "bottom": {
          const newHeight = Math.max(50, canvasY - currentFrameY + 5 / zoom);
          if (frameRect) {
            frameRect.height(newHeight);
          }
          const node = e.target;
          node.y(newHeight - 5 / zoom);
          resizeStartRef.current.height = newHeight;
          break;
        }
        case "left": {
          const newX = canvasX - 5 / zoom;
          const rightEdgeX = resizeStartRef.current.frameX + resizeStartRef.current.width;
          const newWidth = Math.max(50, rightEdgeX - newX);
          if (frameRect) {
            frameRect.width(newWidth);
          }
          parent.x(newX);
          const node = e.target;
          node.x(-5 / zoom);
          resizeStartRef.current.width = newWidth;
          resizeStartRef.current.frameX = newX;
          break;
        }
        case "top": {
          const newY = canvasY - 5 / zoom;
          const bottomEdgeY = resizeStartRef.current.frameY + resizeStartRef.current.height;
          const newHeight = Math.max(50, bottomEdgeY - newY);
          if (frameRect) {
            frameRect.height(newHeight);
          }
          parent.y(newY);
          const node = e.target;
          node.y(-5 / zoom);
          resizeStartRef.current.height = newHeight;
          resizeStartRef.current.frameY = newY;
          break;
        }
      }
    },
    [zoom, panOffsetX, panOffsetY]
  );

  const handleResizeEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, frame: Frame, handle: SideIndicator) => {
      e.cancelBubble = true;
      if (!resizeStartRef.current || resizeStartRef.current.frameId !== frame.id) return;

      const node = e.target;
      const stage = e.target.getStage();
      const parent = e.target.getParent();
      if (!parent) return;

      const frameRect = parent.findOne((node: Konva.Node) => node.name() === "frame-rect");
      let finalWidth = resizeStartRef.current.width;
      let finalHeight = resizeStartRef.current.height;
      let finalX = resizeStartRef.current.frameX;
      let finalY = resizeStartRef.current.frameY;

      if (frameRect) {
        finalWidth = frameRect.width();
        finalHeight = frameRect.height();
        finalX = parent.x();
        finalY = parent.y();
      }

      updateFrameSize(frame.id, finalWidth, finalHeight);
      if (handle === "left" || handle === "top") {
        moveFrame(frame.id, { x: finalX, y: finalY });
      }

      switch (handle) {
        case "right":
          node.x(finalWidth - 5 / zoom);
          node.y(0);
          break;
        case "bottom":
          node.x(0);
          node.y(finalHeight - 5 / zoom);
          break;
        case "left":
          node.x(-5 / zoom);
          node.y(0);
          break;
        case "top":
          node.x(0);
          node.y(-5 / zoom);
          break;
      }

      if (stage) {
        stage.container().style.cursor = "default";
      }
      setResizeHandle(null);
      setIsResizing(false);
      resizeStartRef.current = null;
      setActiveFrame(frame.id);
    },
    [zoom, updateFrameSize, moveFrame, setActiveFrame]
  );

  const handleResizeMouseEnter = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>, handle: SideIndicator) => {
      if (isResizing) return;
      const stage = e.target.getStage();
      if (stage) {
        const cursor = handle === "right" || handle === "left" ? "ew-resize" : "ns-resize";
        stage.container().style.cursor = cursor;
      }
      setResizeHandle(handle);
    },
    [isResizing]
  );

  const handleResizeMouseLeave = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (isResizing) return;
      const stage = e.target.getStage();
      if (stage) {
        stage.container().style.cursor = "default";
      }
      setResizeHandle(null);
    },
    [isResizing]
  );

  return {
    resizeHandle,
    isResizing,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    handleResizeMouseEnter,
    handleResizeMouseLeave,
  };
}
