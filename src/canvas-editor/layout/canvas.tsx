"use client";

import { useLayoutEffect, useRef } from "react";
import { Group, Layer, Rect, Stage } from "react-konva";
import type Konva from "konva";
import { useCanvasStore } from "../store/canvas-editor.store";
import { useCanvasZoom } from "../hooks/useCanvasZoom";
import { ZoomControls } from "../components/zoom-controls";
import { useCanvasPan } from "../hooks/useCanvasPan";
import { Grid } from "../components/grid/grid";
import { GridControls } from "../components/grid/grid-controls";
import { HowToUseCanvasButton } from "../components/how-to-use-canvas-button";
import { HelloCanvas } from "../components/hello-canvas";

export const Canvas = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const { onWheelZoom } = useCanvasZoom(stageRef);
  const { stageProps: panHandlers, cursor } = useCanvasPan(stageRef);

  const {
    width,
    height,
    panOffsetX,
    panOffsetY,
    zoom,
    setCanvasSize: setSize,
    pages,
    activePage,
    activeFrame,
    setActiveFrame,
    moveFrame,
    moveElement,
  } = useCanvasStore();

  // Fit canvas to its container
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

    const rect = el.getBoundingClientRect();
    setSize(Math.floor(rect.width), Math.floor(rect.height));
    return () => ro.disconnect();
  }, [setSize]);

  const hasFramesOnActivePage = !!activePage && activePage.frames.length > 0;

  return (
    <div ref={containerRef} className="bg-muted/30 relative h-full w-full">
      <div className="absolute top-2 right-2 z-10">
        <GridControls />
      </div>
      <div className="absolute bottom-2 left-2 z-10">
        <ZoomControls stageRef={stageRef} />
      </div>
      <div className="absolute right-2 bottom-2 z-10">
        <HowToUseCanvasButton />
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

        {activePage && hasFramesOnActivePage && (
          <Layer>
            {activePage.frames.map((frame) => (
              <Group
                key={frame.id}
                x={frame.x}
                y={frame.y}
                draggable
                onClick={() => setActiveFrame(frame.id)}
                onDragEnd={(e) => {
                  // reaguj tylko na drag samej grupy (frame), nie na bubbled eventy z elementów
                  if (e.target !== e.currentTarget) return;
                  const node = e.currentTarget as Konva.Group;
                  moveFrame(frame.id, { x: node.x(), y: node.y() });
                }}
              >
                <Rect
                  x={0}
                  y={0}
                  width={frame.width}
                  height={frame.height}
                  fill="#ffffff"
                  stroke={activeFrame?.id === frame.id ? "#6366f1" : "#e5e7eb"}
                  strokeWidth={1 / zoom}
                  cornerRadius={8}
                  shadowForStrokeEnabled={false}
                />

                {frame.elements.map((el) => {
                  if (el.type === "rect") {
                    return (
                      <Rect
                        key={el.id}
                        x={el.x}
                        y={el.y}
                        width={el.width}
                        height={el.height}
                        fill={el.fill}
                        draggable
                        onDragEnd={(e) => {
                          const node = e.target;
                          moveElement(frame.id, el.id, { x: node.x(), y: node.y() });
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </Group>
            ))}
          </Layer>
        )}
      </Stage>

      {/* Empty Canvas*/}
      {(!activePage || !hasFramesOnActivePage) && <HelloCanvas />}
    </div>
  );
};
