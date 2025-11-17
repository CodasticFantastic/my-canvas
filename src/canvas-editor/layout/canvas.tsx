"use client";

import { useLayoutEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import type Konva from "konva";
import Color from "color";
import { useCanvasStore } from "../store/canvas-editor.store";
import { useCanvasZoom } from "../hooks/useCanvasZoom";
import { ZoomControls } from "../components/zoom-controls";
import { useCanvasPan } from "../hooks/useCanvasPan";
import { Grid } from "../components/grid/grid";
import { GridControls } from "../components/grid/grid-controls";
import { HowToUseCanvasButton } from "../components/how-to-use-canvas-button";
import { HelloCanvas } from "../components/hello-canvas";
import { useFrameResize } from "../hooks/useFrameResize";
import { useFrameInteraction } from "../hooks/useFrameInteraction";
import { Frame } from "../components/frame/Frame";

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
    activePage,
    moveElement,
  } = useCanvasStore();

  const {
    isFrameHovered,
    isFrameActive,
    handleFrameClick,
    handleFrameMouseEnter,
    handleFrameMouseLeave,
    handleFrameDragStart,
    handleFrameDragEnd,
    handleStageClick,
  } = useFrameInteraction();

  const {
    resizeHandle,
    isResizing,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    handleResizeMouseEnter,
    handleResizeMouseLeave,
  } = useFrameResize();

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

  const backgroundColor = activePage ? Color(activePage.backgroundColor).rgb().string() : "bg-background";

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      style={{ backgroundColor: backgroundColor ?? "rgb(243, 244, 246)" }}
    >
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
        onClick={(e) => {
          // Jeśli kliknięto na Stage (nie na frame), ustaw activeFrame na null
          const stage = e.target.getStage();
          if (e.target === stage) {
            handleStageClick();
          }
        }}
        style={{ cursor }}
        {...panHandlers}
      >
        <Grid />

        {activePage && hasFramesOnActivePage && (
          <Layer>
            {activePage.frames.map((frame) => (
              <Frame
                key={frame.id}
                frame={frame}
                zoom={zoom}
                isHovered={isFrameHovered(frame.id)}
                isActive={isFrameActive(frame.id)}
                isResizing={isResizing}
                resizeHandle={resizeHandle}
                stageRef={stageRef}
                onFrameClick={handleFrameClick}
                onFrameMouseEnter={handleFrameMouseEnter}
                onFrameMouseLeave={(isResizing, resizeHandle) =>
                  handleFrameMouseLeave(isResizing, resizeHandle, stageRef)
                }
                onFrameDragStart={handleFrameDragStart}
                onFrameDragEnd={handleFrameDragEnd}
                onResizeStart={handleResizeStart}
                onResizeMove={handleResizeMove}
                onResizeEnd={handleResizeEnd}
                onResizeMouseEnter={handleResizeMouseEnter}
                onResizeMouseLeave={handleResizeMouseLeave}
                onElementDragEnd={moveElement}
              />
            ))}
          </Layer>
        )}
      </Stage>

      {/* Empty Canvas*/}
      {(!activePage || !hasFramesOnActivePage) && <HelloCanvas />}
    </div>
  );
};
