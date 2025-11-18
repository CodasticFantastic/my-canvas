import { useCallback } from "react";
import type Konva from "konva";
import { useCanvasStore } from "../store/canvas-editor.store";
import { CanvasPoint, StageRef } from "../canvas-editor.types";

/**
 * Hook to handle canvas zooming.
 */

export function useCanvasZoom(stageRef: StageRef) {
  const { zoom, setZoom } = useCanvasStore();
  const scaleBy = 1.06;

  const onWheelZoom = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;

      const direction = e.evt.deltaY > 0 ? 1 : -1;
      const newZoom = zoom * (direction > 0 ? 1 / scaleBy : scaleBy);

      const pointer = stage.getPointerPosition();
      if (!pointer) {
        setZoom(newZoom);
        return;
      }
      setZoom(newZoom, { x: pointer.x, y: pointer.y });
    },
    [zoom, setZoom, stageRef]
  );

  const onButtonZoom = useCallback(
    (direction: "+" | "-") => {
      const stage = stageRef.current;
      const newZoom = zoom * (direction === "+" ? scaleBy : 1 / scaleBy);

      if (!stage) {
        setZoom(newZoom);
        return;
      }

      const zoomAnchor: CanvasPoint = { x: stage.width() / 2, y: stage.height() / 2 };

      setZoom(newZoom, zoomAnchor);
    },
    [zoom, setZoom, stageRef]
  );

  return { onWheelZoom, onButtonZoom };
}
