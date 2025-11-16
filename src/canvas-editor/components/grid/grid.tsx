"use client";

import { useMemo } from "react";
import { FastLayer, Shape } from "react-konva";
import { useCanvasStore } from "../../store/canvas-editor.store";
import Color from "color";

export const Grid = () => {
  const { width, height, zoom, showGrid, gridSize, gridColor, gridStroke } = useCanvasStore();

  const gridBounds = useMemo(() => {
    const worldW = width / zoom;
    const worldH = height / zoom;

    const margin = 4;
    const startX = Math.floor(-(worldW * margin) / gridSize) * gridSize;
    const startY = Math.floor(-(worldH * margin) / gridSize) * gridSize;
    const endX = Math.floor((worldW * (1 + margin)) / gridSize) * gridSize;
    const endY = Math.floor((worldH * (1 + margin)) / gridSize) * gridSize;

    return { startX, startY, endX, endY };
  }, [width, height, zoom, gridSize]);

  if (!showGrid) return null;

  return (
    <FastLayer listening={false} perfectDrawEnabled={false}>
      <Shape
        listening={false}
        perfectDrawEnabled={false}
        sceneFunc={(ctx) => {
          const { startX, startY, endX, endY } = gridBounds;
          const strokeWidth = gridStroke / zoom;
          ctx.save();
          ctx.beginPath();
          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = Color(gridColor).rgb().string();

          // vertical lines
          for (let x = startX; x <= endX; x += gridSize) {
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
          }
          // horizontal lines
          for (let y = startY; y <= endY; y += gridSize) {
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
          }

          ctx.stroke();
          ctx.restore();
        }}
      />
    </FastLayer>
  );
};
