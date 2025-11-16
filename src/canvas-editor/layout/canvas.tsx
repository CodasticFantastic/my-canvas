"use client";

import { useLayoutEffect, useRef } from "react";
import { Layer, Rect, Stage } from "react-konva";
import type Konva from "konva";
import { useCanvasStore } from "../store/canvas-editor.store";
import { useCanvasZoom } from "../hooks/useCanvasZoom";
import { ZoomControls } from "../components/zoom-controls";
import { useCanvasPan } from "../hooks/useCanvasPan";
import { Grid } from "../components/grid/grid";
import { GridControls } from "../components/grid/grid-controls";

export const Canvas = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const { onWheelZoom } = useCanvasZoom(stageRef);
  const { stageProps: panHandlers, cursor } = useCanvasPan(stageRef);

  const { width, height, panOffsetX, panOffsetY, zoom, setCanvasSize: setSize } = useCanvasStore();

  // ResizeObserver: dopasowanie Stage do kontenera
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setSize(Math.floor(cr.width), Math.floor(cr.height));
      }
    });
    ro.observe(el);
    // init
    const rect = el.getBoundingClientRect();
    setSize(Math.floor(rect.width), Math.floor(rect.height));
    return () => ro.disconnect();
  }, [setSize]);

  return (
    <div ref={containerRef} className="bg-muted/30 relative h-full w-full">
      <div className="absolute top-2 right-2 z-10">
        <GridControls />
      </div>
      <div className="absolute bottom-2 left-2 z-10">
        <ZoomControls stageRef={stageRef} />
      </div>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        x={panOffsetX}
        y={panOffsetY}
        scaleX={zoom}
        scaleY={zoom}
        onWheel={onWheelZoom}
        style={{ cursor }}
        {...panHandlers}
      >
        <Grid />

        {/* Tu dodawaj swoje warstwy i figury */}
        <Layer>
          <Rect x={0} y={0} width={100} height={100} fill="red" />
        </Layer>
      </Stage>
    </div>
  );
};
