"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Group, Layer, Rect, Stage } from "react-konva";
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
    activeFrame,
    setActiveFrame,
    moveFrame,
    moveElement,
    updateFrameSize,
  } = useCanvasStore();

  const [hoveredFrameId, setHoveredFrameId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<"right" | "bottom" | "left" | "top" | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{
    width: number;
    height: number;
    x: number;
    y: number;
    frameX: number;
    frameY: number;
    frameId: string;
  } | null>(null);

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
            setActiveFrame(null);
          }
        }}
        style={{ cursor }}
        {...panHandlers}
      >
        <Grid />

        {activePage && hasFramesOnActivePage && (
          <Layer>
            {activePage.frames.map((frame) => {
              const isHovered = hoveredFrameId === frame.id;
              const isActive = activeFrame?.id === frame.id;
              const baseBorderColor = Color(frame.borderColor).rgb().string();
              const strokeColor = isActive ? "#6366f1" : isHovered ? "#6366f1" : baseBorderColor;
              const baseBorderWidth = frame.borderWidth / zoom;
              const strokeWidth = isActive || isHovered ? Math.max(2 / zoom, baseBorderWidth) : baseBorderWidth;

              return (
                <Group
                  key={frame.id}
                  x={frame.x}
                  y={frame.y}
                  draggable={!isResizing}
                  onClick={() => {
                    if (!isResizing) {
                      setActiveFrame(frame.id);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isResizing) {
                      setHoveredFrameId(frame.id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isResizing) {
                      setHoveredFrameId(null);
                      // Reset cursor only if we're not on a resize handle
                      if (!resizeHandle) {
                        const stage = stageRef.current;
                        if (stage) {
                          stage.container().style.cursor = "default";
                        }
                      }
                    }
                  }}
                  onDragStart={(e) => {
                    if (isResizing) {
                      e.target.stopDrag();
                    }
                  }}
                  onDragEnd={(e) => {
                    // reaguj tylko na drag samej grupy (frame), nie na bubbled eventy z elementów
                    if (e.target !== e.currentTarget || isResizing) return;
                    const node = e.currentTarget as Konva.Group;
                    moveFrame(frame.id, { x: node.x(), y: node.y() });
                  }}
                >
                  <Rect
                    x={0}
                    y={0}
                    width={frame.width}
                    height={frame.height}
                    fill={Color(frame.color).rgb().string()}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    cornerRadius={frame.borderRadius}
                    shadowForStrokeEnabled={false}
                  />

                  {/* Right resize handle */}
                  <Rect
                    x={frame.width - 5 / zoom}
                    y={0}
                    width={10 / zoom}
                    height={frame.height}
                    fill="transparent"
                    draggable
                    listening={true}
                    onClick={(e) => {
                      e.cancelBubble = true;
                    }}
                    onMouseEnter={(e) => {
                      if (isResizing) return;
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "ew-resize";
                      }
                      setResizeHandle("right");
                    }}
                    onMouseLeave={(e) => {
                      if (isResizing) return;
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "default";
                      }
                      setResizeHandle(null);
                    }}
                    onDragStart={(e) => {
                      e.cancelBubble = true;
                      setIsResizing(true);
                      resizeStartRef.current = {
                        width: frame.width,
                        height: frame.height,
                        x: e.target.x(),
                        y: e.target.y(),
                        frameX: frame.x,
                        frameY: frame.y,
                        frameId: frame.id,
                      };
                    }}
                    onDragMove={(e) => {
                      e.cancelBubble = true;
                      if (!resizeStartRef.current || resizeStartRef.current.frameId !== frame.id) return;
                      const stage = e.target.getStage();
                      if (!stage) return;
                      const pointerPos = stage.getPointerPosition();
                      if (!pointerPos) return;
                      const parent = e.target.getParent();
                      if (!parent) return;
                      // Oblicz pozycję kursora w przestrzeni canvas (uwzględniając pan i zoom)
                      const canvasX = (pointerPos.x - panOffsetX) / zoom;
                      const currentFrameX = parent.x();
                      const newWidth = Math.max(50, canvasX - currentFrameX + 5 / zoom);
                      updateFrameSize(frame.id, newWidth, frame.height);
                      // Aktualizuj pozycję handle'a, aby krawędź była pod kursorem
                      const node = e.target;
                      node.x(newWidth - 5 / zoom);
                    }}
                    onDragEnd={(e) => {
                      e.cancelBubble = true;
                      const node = e.target;
                      node.x(frame.width - 5 / zoom);
                      node.y(0);
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "default";
                      }
                      setResizeHandle(null);
                      setIsResizing(false);
                      resizeStartRef.current = null;
                    }}
                  />

                  {/* Bottom resize handle */}
                  <Rect
                    x={0}
                    y={frame.height - 5 / zoom}
                    width={frame.width}
                    height={10 / zoom}
                    fill="transparent"
                    draggable
                    listening={true}
                    onClick={(e) => {
                      e.cancelBubble = true;
                    }}
                    onMouseEnter={(e) => {
                      if (isResizing) return;
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "ns-resize";
                      }
                      setResizeHandle("bottom");
                    }}
                    onMouseLeave={(e) => {
                      if (isResizing) return;
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "default";
                      }
                      setResizeHandle(null);
                    }}
                    onDragStart={(e) => {
                      e.cancelBubble = true;
                      setIsResizing(true);
                      resizeStartRef.current = {
                        width: frame.width,
                        height: frame.height,
                        x: e.target.x(),
                        y: e.target.y(),
                        frameX: frame.x,
                        frameY: frame.y,
                        frameId: frame.id,
                      };
                    }}
                    onDragMove={(e) => {
                      e.cancelBubble = true;
                      if (!resizeStartRef.current || resizeStartRef.current.frameId !== frame.id) return;
                      const stage = e.target.getStage();
                      if (!stage) return;
                      const pointerPos = stage.getPointerPosition();
                      if (!pointerPos) return;
                      const parent = e.target.getParent();
                      if (!parent) return;
                      // Oblicz pozycję kursora w przestrzeni canvas (uwzględniając pan i zoom)
                      const canvasY = (pointerPos.y - panOffsetY) / zoom;
                      const currentFrameY = parent.y();
                      const newHeight = Math.max(50, canvasY - currentFrameY + 5 / zoom);
                      updateFrameSize(frame.id, frame.width, newHeight);
                      // Aktualizuj pozycję handle'a, aby krawędź była pod kursorem
                      const node = e.target;
                      node.y(newHeight - 5 / zoom);
                    }}
                    onDragEnd={(e) => {
                      e.cancelBubble = true;
                      const node = e.target;
                      node.x(0);
                      node.y(frame.height - 5 / zoom);
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "default";
                      }
                      setResizeHandle(null);
                      setIsResizing(false);
                      resizeStartRef.current = null;
                    }}
                  />

                  {/* Left resize handle */}
                  <Rect
                    x={-5 / zoom}
                    y={0}
                    width={10 / zoom}
                    height={frame.height}
                    fill="transparent"
                    draggable
                    listening={true}
                    onClick={(e) => {
                      e.cancelBubble = true;
                    }}
                    onMouseEnter={(e) => {
                      if (isResizing) return;
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "ew-resize";
                      }
                      setResizeHandle("left");
                    }}
                    onMouseLeave={(e) => {
                      if (isResizing) return;
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "default";
                      }
                      setResizeHandle(null);
                    }}
                    onDragStart={(e) => {
                      e.cancelBubble = true;
                      setIsResizing(true);
                      resizeStartRef.current = {
                        width: frame.width,
                        height: frame.height,
                        x: e.target.x(),
                        y: e.target.y(),
                        frameX: frame.x,
                        frameY: frame.y,
                        frameId: frame.id,
                      };
                    }}
                    onDragMove={(e) => {
                      e.cancelBubble = true;
                      if (!resizeStartRef.current || resizeStartRef.current.frameId !== frame.id) return;
                      const stage = e.target.getStage();
                      if (!stage) return;
                      const pointerPos = stage.getPointerPosition();
                      if (!pointerPos) return;
                      // Oblicz pozycję kursora w przestrzeni canvas (uwzględniając pan i zoom)
                      const canvasX = (pointerPos.x - panOffsetX) / zoom;
                      // Lewa krawędź powinna być pod kursorem (handle jest na -5/zoom względem frame'a)
                      const newX = canvasX - 5 / zoom;
                      // Nowa szerokość to odległość od nowej lewej krawędzi do prawej krawędzi (która pozostaje na miejscu)
                      const rightEdgeX = resizeStartRef.current.frameX + resizeStartRef.current.width;
                      const newWidth = Math.max(50, rightEdgeX - newX);
                      updateFrameSize(frame.id, newWidth, frame.height);
                      moveFrame(frame.id, { x: newX, y: resizeStartRef.current.frameY });
                      // Aktualizuj pozycję handle'a, aby krawędź była pod kursorem
                      const node = e.target;
                      node.x(-5 / zoom);
                    }}
                    onDragEnd={(e) => {
                      e.cancelBubble = true;
                      const node = e.target;
                      node.x(-5 / zoom);
                      node.y(0);
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "default";
                      }
                      setResizeHandle(null);
                      setIsResizing(false);
                      resizeStartRef.current = null;
                    }}
                  />

                  {/* Top resize handle */}
                  <Rect
                    x={0}
                    y={-5 / zoom}
                    width={frame.width}
                    height={10 / zoom}
                    fill="transparent"
                    draggable
                    listening={true}
                    onClick={(e) => {
                      e.cancelBubble = true;
                    }}
                    onMouseEnter={(e) => {
                      if (isResizing) return;
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "ns-resize";
                      }
                      setResizeHandle("top");
                    }}
                    onMouseLeave={(e) => {
                      if (isResizing) return;
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "default";
                      }
                      setResizeHandle(null);
                    }}
                    onDragStart={(e) => {
                      e.cancelBubble = true;
                      setIsResizing(true);
                      resizeStartRef.current = {
                        width: frame.width,
                        height: frame.height,
                        x: e.target.x(),
                        y: e.target.y(),
                        frameX: frame.x,
                        frameY: frame.y,
                        frameId: frame.id,
                      };
                    }}
                    onDragMove={(e) => {
                      e.cancelBubble = true;
                      if (!resizeStartRef.current || resizeStartRef.current.frameId !== frame.id) return;
                      const stage = e.target.getStage();
                      if (!stage) return;
                      const pointerPos = stage.getPointerPosition();
                      if (!pointerPos) return;
                      // Oblicz pozycję kursora w przestrzeni canvas (uwzględniając pan i zoom)
                      const canvasY = (pointerPos.y - panOffsetY) / zoom;
                      // Górna krawędź powinna być pod kursorem (handle jest na -5/zoom względem frame'a)
                      const newY = canvasY - 5 / zoom;
                      // Nowa wysokość to odległość od nowej górnej krawędzi do dolnej krawędzi (która pozostaje na miejscu)
                      const bottomEdgeY = resizeStartRef.current.frameY + resizeStartRef.current.height;
                      const newHeight = Math.max(50, bottomEdgeY - newY);
                      updateFrameSize(frame.id, frame.width, newHeight);
                      moveFrame(frame.id, { x: resizeStartRef.current.frameX, y: newY });
                      // Aktualizuj pozycję handle'a, aby krawędź była pod kursorem
                      const node = e.target;
                      node.y(-5 / zoom);
                    }}
                    onDragEnd={(e) => {
                      e.cancelBubble = true;
                      const node = e.target;
                      node.x(0);
                      node.y(-5 / zoom);
                      const stage = e.target.getStage();
                      if (stage) {
                        stage.container().style.cursor = "default";
                      }
                      setResizeHandle(null);
                      setIsResizing(false);
                      resizeStartRef.current = null;
                    }}
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
              );
            })}
          </Layer>
        )}
      </Stage>

      {/* Empty Canvas*/}
      {(!activePage || !hasFramesOnActivePage) && <HelloCanvas />}
    </div>
  );
};
