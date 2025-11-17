"use client";

import { useRef } from "react";
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
import { useStoreHydration } from "../hooks/useStoreHydration";
import { LoadingSpinner } from "@/components/global/loading-spinner";
import { ElementDimensionsLabel } from "../components/settings-sections/element-dimensions-label";
import { useLiveDimensions } from "../hooks/useLiveDimensions";
import { useElementInteractions } from "../hooks/useElementInteractions";
import { useFrameResizeWithDimensions } from "../hooks/useFrameResizeWithDimensions";
import { useActiveData } from "../hooks/useActiveData";
import { useCanvasSize } from "../hooks/useCanvasSize";

export const Canvas = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const isStoreHydrated = useStoreHydration();
  const { onWheelZoom } = useCanvasZoom(stageRef);
  const { stageProps: panHandlers, cursor } = useCanvasPan(stageRef);

  // Store selectors - selektywne pobieranie pól, aby uniknąć niepotrzebnych re-renderów
  const width = useCanvasStore((state) => state.width);
  const height = useCanvasStore((state) => state.height);
  const panOffsetX = useCanvasStore((state) => state.panOffsetX);
  const panOffsetY = useCanvasStore((state) => state.panOffsetY);
  const zoom = useCanvasStore((state) => state.zoom);
  const activePage = useCanvasStore((state) => state.activePage);
  const setActiveElement = useCanvasStore((state) => state.setActiveElement);

  // Live dimensions management
  const {
    liveElementDimensions,
    setLiveElementDimensions,
    liveFrameDimensions,
    setLiveFrameDimensions,
    throttledSetStoreLiveFrameDimensions,
    clearLiveFrameDimensions,
  } = useLiveDimensions();

  // Active data calculations
  const { activeElementData, activeFrameData } = useActiveData();

  // Frame interactions (click, hover, drag + live dimensions)
  const {
    isFrameHovered,
    isFrameActive,
    handleFrameClick,
    handleFrameMouseEnter,
    handleFrameMouseLeave,
    handleFrameDragStart,
    handleFrameDragMove,
    handleFrameDragEnd,
    handleStageClick,
  } = useFrameInteraction({
    activeFrameData,
    setLiveFrameDimensions,
    throttledSetStoreLiveFrameDimensions,
  });

  // Frame resize
  const {
    resizeHandle,
    isResizing,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    handleResizeMouseEnter,
    handleResizeMouseLeave,
  } = useFrameResize();

  // Element interactions
  const { handleElementClick, handleElementDragStart, handleElementDragMove, handleElementDragEnd } =
    useElementInteractions(activePage, setLiveElementDimensions);

  // Frame resize with live dimensions
  const { handleResizeMoveWithDimensions } = useFrameResizeWithDimensions(
    activeFrameData,
    setLiveFrameDimensions,
    throttledSetStoreLiveFrameDimensions,
    handleResizeMove
  );

  // Canvas size management
  useCanvasSize(containerRef);

  // Computed values
  const hasFramesOnActivePage = !!activePage && activePage.frames.length > 0;
  const backgroundColor = activePage ? Color(activePage.backgroundColor).rgb().string() : "bg-background";

  // Loading spinner while store is hydrating
  if (!isStoreHydrated) {
    return (
      <div className="relative h-full w-full">
        <LoadingSpinner message="Loading canvas..." />
      </div>
    );
  }

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
          const stage = e.target.getStage();
          if (e.target === stage) {
            handleStageClick();
            setActiveElement(null, null);
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
                onFrameDragMove={handleFrameDragMove}
                onFrameDragEnd={(e, frame, isResizing) => {
                  handleFrameDragEnd(e, frame, isResizing);
                  clearLiveFrameDimensions();
                }}
                onResizeStart={(e, frame, handle) => {
                  handleResizeStart(e, frame, handle);
                  if (activeFrameData && activeFrameData.id === frame.id) {
                    const next = {
                      x: frame.x,
                      y: frame.y,
                      width: frame.width,
                      height: frame.height,
                    };
                    setLiveFrameDimensions(next);
                    throttledSetStoreLiveFrameDimensions(next);
                  }
                }}
                onResizeMove={handleResizeMoveWithDimensions}
                onResizeEnd={(e, frame, handle) => {
                  handleResizeEnd(e, frame, handle);
                  clearLiveFrameDimensions();
                }}
                onResizeMouseEnter={handleResizeMouseEnter}
                onResizeMouseLeave={handleResizeMouseLeave}
                onElementClick={handleElementClick}
                onElementDragStart={handleElementDragStart}
                onElementDragMove={handleElementDragMove}
                onElementDragEnd={handleElementDragEnd}
              />
            ))}
            {/* Element dimensions label */}
            {activeElementData && (
              <ElementDimensionsLabel
                x={liveElementDimensions?.x ?? activeElementData.frame.x + activeElementData.element.x}
                y={liveElementDimensions?.y ?? activeElementData.frame.y + activeElementData.element.y}
                width={liveElementDimensions?.width ?? activeElementData.element.width}
                height={liveElementDimensions?.height ?? activeElementData.element.height}
                zoom={zoom}
              />
            )}
            {/* Frame dimensions label (if no active element) */}
            {activeFrameData && !activeElementData && (
              <ElementDimensionsLabel
                x={liveFrameDimensions?.x ?? activeFrameData.x}
                y={liveFrameDimensions?.y ?? activeFrameData.y}
                width={liveFrameDimensions?.width ?? activeFrameData.width}
                height={liveFrameDimensions?.height ?? activeFrameData.height}
                zoom={zoom}
              />
            )}
          </Layer>
        )}
      </Stage>

      {/* Empty Canvas*/}
      {(!activePage || !hasFramesOnActivePage) && <HelloCanvas />}
    </div>
  );
};
