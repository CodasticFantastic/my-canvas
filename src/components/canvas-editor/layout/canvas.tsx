"use client";

import { Stage, Layer, Rect, Text } from "react-konva";
import { useCanvasDimensions } from "@/hooks/canvas-editor/useCanvasDimensions";
import { useEditorStore } from "@/store/canvas-editor/canvas-editor.store";
import { LoadingSpinner } from "@/components/global/loading-spinner";
import { calculateFrameTransform } from "@/lib/canvas-editor/frame-transform";
import { Button } from "@/components/shadcn/ui/button";
import { useEffect, useState, useRef } from "react";
import { useCanvasZoom } from "@/hooks/canvas-editor/useCanvasZoom";
import { useCanvasDrag } from "@/hooks/canvas-editor/useCanvasDrag";

export const Canvas = () => {
  const { containerRef, dimensions, isLoading } = useCanvasDimensions();
  const { activeFrameId, zoom, resetTransform } = useEditorStore();
  const activeFrame = useEditorStore((state) => state.getActiveFrame());

  // Local state for panning - przesuwamy Layer, nie Stage
  const [layerOffset, setLayerOffset] = useState({ x: 0, y: 0 });
  const isPanningRef = useRef(false);

  // Reset transform to fit when frame or canvas size changes
  useEffect(() => {
    // resetTransform();
    // Reset offset asynchronously to avoid React Compiler warning
    setTimeout(() => {
      setLayerOffset({ x: 0, y: 0 });
    }, 0);
  }, [activeFrameId, dimensions.width, dimensions.height, resetTransform]);

  const { handleWheel, handleZoomButtons } = useCanvasZoom(layerOffset, setLayerOffset, dimensions);
  const { onMouseDown, onMouseMove, onMouseUp, onMouseLeave } = useCanvasDrag(setLayerOffset, isPanningRef);

  if (isLoading) {
    return <LoadingSpinner message="Loading canvas..." ref={containerRef} />;
  }

  // Jeśli nie ma aktywnego frame'a, pokaż pusty canvas
  if (!activeFrameId) {
    return (
      <div ref={containerRef} className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground text-lg">Brak aktywnego frame&apos;a</p>
      </div>
    );
  }

  const { scaledWidth, scaledHeight, frameX, frameY } = calculateFrameTransform(dimensions, activeFrame);

  console.log(scaledWidth, scaledHeight, frameX, frameY);

  return (
    <div ref={containerRef} className="bg-muted/30 relative h-full w-full">
      {/* Zoom controls - bottom-left */}
      <div className="bg-background/80 pointer-events-auto absolute bottom-2 left-2 z-10 flex items-center gap-2 rounded-md px-2 py-1 shadow">
        <Button variant="ghost" size="xs" onClick={() => handleZoomButtons(1 / 1.1)}>
          -
        </Button>
        <span className="text-xs select-none">{Math.round(zoom * 100)}%</span>
        <Button variant="ghost" size="xs" onClick={() => handleZoomButtons(1.1)}>
          +
        </Button>
        <Button variant="ghost" size="xs" onClick={() => resetTransform()}>
          Fit
        </Button>
      </div>

      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onWheel={handleWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        scaleX={zoom}
        scaleY={zoom}
        x={0}
        y={0}
      >
        <Layer offsetX={layerOffset.x} offsetY={layerOffset.y}>
          {/* Frame */}
          {activeFrame && (
            <>
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

              <Rect x={0} y={0} width={100} height={100} fill="red" />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};
