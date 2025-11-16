"use client";

import { useLayoutEffect, useRef } from "react";
import { Group, Layer, Rect, Stage } from "react-konva";
import type Konva from "konva";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/shadcn/ui/empty";
import { Button } from "@/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { Kbd, KbdGroup } from "@/components/shadcn/ui/kbd";
import { LayoutTemplate } from "lucide-react";
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

  const {
    width,
    height,
    panOffsetX,
    panOffsetY,
    zoom,
    setCanvasSize: setSize,
    pages,
    activePageId,
    activeFrameId,
    setActiveFrame,
    moveFrame,
    moveElement,
    addPage,
    addFrameToActivePage,
  } = useCanvasStore();

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

  const activePage = pages.find((p) => p.id === activePageId);
  const hasFramesOnActivePage = !!activePage && activePage.frames.length > 0;

  return (
    <div ref={containerRef} className="bg-muted/30 relative h-full w-full">
      <div className="absolute top-2 right-2 z-10">
        <GridControls />
      </div>
      <div className="absolute bottom-2 left-2 z-10">
        <ZoomControls stageRef={stageRef} />
      </div>
      <div className="absolute bottom-2 right-2 z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon-xs"
              variant="ghost"
              className="bg-background/90 border border-border shadow rounded-full"
            >
              ?
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sterowanie canvasem</DialogTitle>
              <DialogDescription>
                Krótki opis jak poruszać się po obszarze roboczym.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Panowanie (przesuwanie widoku)</p>
                <ul className="mt-1 list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>
                    <span className="font-medium">Środkowy przycisk myszy</span> – przytrzymaj i przeciągnij.
                  </li>
                  <li className="flex flex-wrap items-center gap-1">
                    <span className="font-medium">Spacja</span>
                    <span className="text-muted-foreground">+</span>
                    <KbdGroup>
                      <Kbd>Space</Kbd>
                    </KbdGroup>
                    <span className="text-muted-foreground">i przytrzymaj lewy przycisk myszy, aby przeciągnąć widok.</span>
                  </li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                  stroke={activeFrameId === frame.id ? "#6366f1" : "#e5e7eb"}
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

      {/* Empty state when nie ma jeszcze żadnych frame'ów / stron */}
      {(!activePage || !hasFramesOnActivePage) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          <Empty className="pointer-events-auto max-w-md border border-dashed bg-background/90 shadow-sm">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LayoutTemplate className="text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>Nic jeszcze nie ma na tym canvasie</EmptyTitle>
              <EmptyDescription>
                Utwórz nową stronę i dodaj do niej frame, aby rozpocząć pracę – dokładnie tak jak w Figma.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                {!activePage && (
                  <Button size="sm" onClick={() => addPage()}>
                    Utwórz stronę
                  </Button>
                )}
                {activePage && !hasFramesOnActivePage && (
                  <Button size="sm" onClick={() => addFrameToActivePage()}>
                    Dodaj frame
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    console.log("Import project");
                  }}
                >
                  Import project
                </Button>
              </div>
            </EmptyContent>
          </Empty>
        </div>
      )}
    </div>
  );
};
