import { useCallback } from "react";
import { useEditorStore } from "@/store/canvas-editor/canvas-editor.store";
import type { KonvaEventObject } from "konva/lib/Node";

type Dimensions = { width: number; height: number };

export const useCanvasZoom = (
  layerOffset: { x: number; y: number },
  setLayerOffset: (offset: { x: number; y: number }) => void,
  dimensions?: Dimensions
) => {
  const { zoom, setZoom } = useEditorStore();

  // Helper function to zoom at a specific point (zoom to cursor)
  const zoomByFactorAtPoint = useCallback(
    (factor: number, point: { x: number; y: number }) => {
      const oldScale = zoom;
      const newScale = oldScale * factor;

      // point jest pozycją kursora w przestrzeni Stage (przed zoomem Stage)
      // Przeliczamy pozycję kursora do przestrzeni Layer
      const pointInLayerX = point.x / oldScale - layerOffset.x;
      const pointInLayerY = point.y / oldScale - layerOffset.y;

      // Obliczamy nowy offset Layer, aby punkt pod kursorem pozostał w tym samym miejscu
      // Po zoomie, punkt w Layer powinien być w tym samym miejscu względem Stage
      const newOffsetX = point.x / newScale - pointInLayerX;
      const newOffsetY = point.y / newScale - pointInLayerY;

      setZoom(newScale);
      setLayerOffset({ x: newOffsetX, y: newOffsetY });
    },
    [zoom, layerOffset.x, layerOffset.y, setZoom, setLayerOffset]
  );

  // Zoom at mouse pointer position (for wheel)
  const handleWheel = useCallback(
    (e: KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = e.target.getStage();
      if (!stage) return;

      const scaleBy = 1.05;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const direction = e.evt.deltaY > 0 ? "out" : "in";
      const factor = direction === "out" ? 1 / scaleBy : scaleBy;
      zoomByFactorAtPoint(factor, pointer);
    },
    [zoomByFactorAtPoint]
  );

  // Zoom at center (for +/- buttons)
  const handleZoomButtons = useCallback(
    (factor: number) => {
      if (!dimensions) return;
      const stageCenter = { x: dimensions.width / 2, y: dimensions.height / 2 };
      zoomByFactorAtPoint(factor, stageCenter);
    },
    [dimensions, zoomByFactorAtPoint]
  );

  return { handleWheel, handleZoomButtons };
};
