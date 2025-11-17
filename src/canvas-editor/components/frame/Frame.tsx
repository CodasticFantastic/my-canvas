import { Group, Rect } from "react-konva";
import type Konva from "konva";
import Color from "color";
import { Frame as FrameType } from "../../canvas-editor.types";
import { ResizeHandle } from "./ResizeHandle";

type FrameProps = {
  frame: FrameType;
  zoom: number;
  isHovered: boolean;
  isActive: boolean;
  isResizing: boolean;
  resizeHandle: "right" | "bottom" | "left" | "top" | null;
  stageRef: React.RefObject<Konva.Stage | null>;
  onFrameClick: (frameId: string, isResizing: boolean) => void;
  onFrameMouseEnter: (frameId: string, isResizing: boolean) => void;
  onFrameMouseLeave: (isResizing: boolean, resizeHandle: string | null) => void;
  onFrameDragStart: (e: Konva.KonvaEventObject<DragEvent>, isResizing: boolean) => void;
  onFrameDragEnd: (e: Konva.KonvaEventObject<DragEvent>, frame: FrameType, isResizing: boolean) => void;
  onResizeStart: (
    e: Konva.KonvaEventObject<DragEvent>,
    frame: FrameType,
    handle: "right" | "bottom" | "left" | "top"
  ) => void;
  onResizeMove: (
    e: Konva.KonvaEventObject<DragEvent>,
    frame: FrameType,
    handle: "right" | "bottom" | "left" | "top"
  ) => void;
  onResizeEnd: (
    e: Konva.KonvaEventObject<DragEvent>,
    frame: FrameType,
    handle: "right" | "bottom" | "left" | "top"
  ) => void;
  onResizeMouseEnter: (e: Konva.KonvaEventObject<MouseEvent>, handle: "right" | "bottom" | "left" | "top") => void;
  onResizeMouseLeave: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onElementDragEnd: (frameId: string, elementId: string, position: { x: number; y: number }) => void;
};

export function Frame({
  frame,
  zoom,
  isHovered,
  isActive,
  isResizing,
  resizeHandle,
  onFrameClick,
  onFrameMouseEnter,
  onFrameMouseLeave,
  onFrameDragStart,
  onFrameDragEnd,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
  onResizeMouseEnter,
  onResizeMouseLeave,
  onElementDragEnd,
}: FrameProps) {
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
      onClick={() => onFrameClick(frame.id, isResizing)}
      onMouseEnter={() => onFrameMouseEnter(frame.id, isResizing)}
      onMouseLeave={() => onFrameMouseLeave(isResizing, resizeHandle)}
      onDragStart={(e) => onFrameDragStart(e, isResizing)}
      onDragEnd={(e) => onFrameDragEnd(e, frame, isResizing)}
    >
      <Rect
        name="frame-rect"
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

      <ResizeHandle
        frame={frame}
        handle="right"
        zoom={zoom}
        onResizeStart={onResizeStart}
        onResizeMove={onResizeMove}
        onResizeEnd={onResizeEnd}
        onMouseEnter={onResizeMouseEnter}
        onMouseLeave={onResizeMouseLeave}
      />

      <ResizeHandle
        frame={frame}
        handle="bottom"
        zoom={zoom}
        onResizeStart={onResizeStart}
        onResizeMove={onResizeMove}
        onResizeEnd={onResizeEnd}
        onMouseEnter={onResizeMouseEnter}
        onMouseLeave={onResizeMouseLeave}
      />

      <ResizeHandle
        frame={frame}
        handle="left"
        zoom={zoom}
        onResizeStart={onResizeStart}
        onResizeMove={onResizeMove}
        onResizeEnd={onResizeEnd}
        onMouseEnter={onResizeMouseEnter}
        onMouseLeave={onResizeMouseLeave}
      />

      <ResizeHandle
        frame={frame}
        handle="top"
        zoom={zoom}
        onResizeStart={onResizeStart}
        onResizeMove={onResizeMove}
        onResizeEnd={onResizeEnd}
        onMouseEnter={onResizeMouseEnter}
        onMouseLeave={onResizeMouseLeave}
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
                onElementDragEnd(frame.id, el.id, { x: node.x(), y: node.y() });
              }}
            />
          );
        }
        return null;
      })}
    </Group>
  );
}
