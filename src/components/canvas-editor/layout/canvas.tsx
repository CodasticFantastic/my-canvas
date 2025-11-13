"use client";

import { Stage, Layer, Rect } from "react-konva";
import { useCanvasDimensions } from "@/hooks/canvas-editor/useCanvasDimensions";

export const Canvas = () => {
  const { containerRef, dimensions, isLoading } = useCanvasDimensions();

  // Wymiary kwadratu
  const squareSize = 100;

  // Pozycja kwadratu (wyśrodkowany)
  const squareX = (dimensions.width - squareSize) / 2;
  const squareY = (dimensions.height - squareSize) / 2;

  if (isLoading) {
    return (
      <div ref={containerRef} className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground text-lg">Ładowanie</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full">
      <Stage width={dimensions.width} height={dimensions.height} draggable>
        <Layer>
          <Rect
            x={squareX}
            y={squareY}
            width={squareSize}
            height={squareSize}
            fill="#3b82f6"
            stroke="#1e40af"
            strokeWidth={2}
            draggable
          />
          <Rect
            x={squareX}
            y={squareY}
            width={squareSize}
            height={squareSize}
            fill="#3b82f6"
            stroke="#1e40af"
            strokeWidth={2}
            draggable
          />
        </Layer>
      </Stage>
    </div>
  );
};
