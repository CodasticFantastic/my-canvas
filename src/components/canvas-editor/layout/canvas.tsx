"use client";

import { Stage, Layer, Rect, Text } from "react-konva";
import { useCanvasDimensions } from "@/hooks/canvas-editor/useCanvasDimensions";
import { useEditorStore } from "@/store/canvas-editor/canvas-editor.store";
import { LoadingSpinner } from "@/components/global/loading-spinner";
import { calculateFrameTransform } from "@/lib/canvas-editor/frame-transform";

export const Canvas = () => {
  const { containerRef, dimensions, isLoading } = useCanvasDimensions();
  const { frames, activeFrameId } = useEditorStore();
  const activeFrame = activeFrameId ? frames.find((f) => f.id === activeFrameId) : null;

  if (isLoading) {
    return <LoadingSpinner message="Loading canvas..." ref={containerRef} />;
  }

  // Jeśli nie ma aktywnego frame'a, pokaż pusty canvas
  if (!activeFrame) {
    return (
      <div ref={containerRef} className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground text-lg">Brak aktywnego frame&apos;a</p>
      </div>
    );
  }

  const { scaledWidth, scaledHeight, frameX, frameY } = calculateFrameTransform(dimensions, activeFrame);

  return (
    <div ref={containerRef} className="bg-muted/30 h-full w-full">
      <Stage width={dimensions.width} height={dimensions.height} draggable>
        <Layer>
          {/* Frame */}
          <Rect
            x={frameX}
            y={frameY}
            width={scaledWidth}
            height={scaledHeight}
            fill="#ffffff"
            stroke="#3b82f6"
            strokeWidth={2}
            shadowBlur={10}
            shadowColor="rgba(0, 0, 0, 0.1)"
          />
          {/* Frame dimensions info - Displayed above the frame */}
          <Text
            x={frameX}
            y={frameY - 20}
            text={`${activeFrame.name} - ${activeFrame.width} × ${activeFrame.height}`}
            fontSize={12}
            fontFamily="Arial"
            fill="#64748b"
            align="left"
          />
        </Layer>
      </Stage>
    </div>
  );
};
