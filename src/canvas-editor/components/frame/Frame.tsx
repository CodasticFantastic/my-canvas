import { Group, Rect, Circle, RegularPolygon, Line, Text } from "react-konva";
import type Konva from "konva";
import Color from "color";
import { Frame as FrameType, SideIndicator, StageRef } from "../../canvas-editor.types";
import { ResizeHandle } from "./ResizeHandle";

type FrameProps = {
  frame: FrameType;
  zoom: number;
  isHovered: boolean;
  isActive: boolean;
  isResizing: boolean;
  resizeHandle: SideIndicator | null;
  stageRef: StageRef;
  onFrameClick: (frameId: string, isResizing: boolean) => void;
  onFrameMouseEnter: (frameId: string, isResizing: boolean) => void;
  onFrameMouseLeave: (isResizing: boolean, resizeHandle: SideIndicator | null) => void;
  onFrameDragStart: (e: Konva.KonvaEventObject<DragEvent>, frame: FrameType, isResizing: boolean) => void;
  onFrameDragMove?: (frameId: string, position: { x: number; y: number }) => void;
  onFrameDragEnd: (e: Konva.KonvaEventObject<DragEvent>, frame: FrameType, isResizing: boolean) => void;
  onResizeStart: (e: Konva.KonvaEventObject<DragEvent>, frame: FrameType, handle: SideIndicator) => void;
  onResizeMove: (e: Konva.KonvaEventObject<DragEvent>, frame: FrameType, handle: SideIndicator) => void;
  onResizeEnd: (e: Konva.KonvaEventObject<DragEvent>, frame: FrameType, handle: SideIndicator) => void;
  onResizeMouseEnter: (e: Konva.KonvaEventObject<MouseEvent>, handle: SideIndicator) => void;
  onResizeMouseLeave: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onElementClick: (frameId: string, elementId: string) => void;
  onElementDragStart: (frameId: string, elementId: string) => void;
  onElementDragMove: (frameId: string, elementId: string, position: { x: number; y: number }) => void;
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
  onFrameDragMove,
  onFrameDragEnd,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
  onResizeMouseEnter,
  onResizeMouseLeave,
  onElementClick,
  onElementDragStart,
  onElementDragMove,
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
      draggable={!isResizing && !frame.locked}
      onClick={() => onFrameClick(frame.id, isResizing)}
      onMouseEnter={() => onFrameMouseEnter(frame.id, isResizing)}
      onMouseLeave={() => onFrameMouseLeave(isResizing, resizeHandle)}
      onDragStart={(e) => {
        // Only handle drag if it's the Group itself, not child elements
        if (e.target === e.currentTarget) {
          onFrameDragStart(e, frame, isResizing);
        }
      }}
      onDragMove={(e) => {
        // Only handle drag if it's the Group itself, not child elements
        if (e.target === e.currentTarget && !isResizing && !frame.locked && onFrameDragMove) {
          const node = e.currentTarget as Konva.Group;
          onFrameDragMove(frame.id, { x: node.x(), y: node.y() });
        }
      }}
      onDragEnd={(e) => {
        // Only handle drag if it's the Group itself, not child elements
        if (e.target === e.currentTarget) {
          onFrameDragEnd(e, frame, isResizing);
        }
      }}
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

      {!frame.locked && (
        <>
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
        </>
      )}

      {frame.elements.map((el) => {
        const commonProps = {
          draggable: true,
          onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
            e.cancelBubble = true;
            onElementClick(frame.id, el.id);
          },
          onDragStart: () => {
            onElementDragStart(frame.id, el.id);
          },
          onDrag: (e: Konva.KonvaEventObject<DragEvent>) => {
            const node = e.target;
            let x = node.x();
            let y = node.y();

            // For circle and triangle, adjust position since they use center coordinates
            if (el.type === "circle" || el.type === "triangle") {
              x = x - el.width / 2;
              y = y - el.height / 2;
            }

            onElementDragMove(frame.id, el.id, { x, y });
          },
          onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
            const node = e.target;
            let x = node.x();
            let y = node.y();

            // For circle and triangle, adjust position since they use center coordinates
            if (el.type === "circle" || el.type === "triangle") {
              x = x - el.width / 2;
              y = y - el.height / 2;
            }

            onElementDragEnd(frame.id, el.id, { x, y });
          },
        };

        switch (el.type) {
          case "rect":
          case "square":
            return (
              <Rect key={el.id} {...commonProps} x={el.x} y={el.y} width={el.width} height={el.height} fill={el.fill} />
            );
          case "circle":
            return (
              <Circle
                key={el.id}
                {...commonProps}
                x={el.x + el.width / 2}
                y={el.y + el.height / 2}
                radius={Math.min(el.width, el.height) / 2}
                fill={el.fill}
              />
            );
          case "triangle":
            return (
              <RegularPolygon
                key={el.id}
                {...commonProps}
                x={el.x + el.width / 2}
                y={el.y + el.height / 2}
                sides={3}
                radius={Math.min(el.width, el.height) / 2}
                fill={el.fill}
              />
            );
          case "line":
            return (
              <Line
                key={el.id}
                {...commonProps}
                x={el.x}
                y={el.y}
                points={el.points || [0, 0, el.width, 0]}
                stroke={el.fill}
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
              />
            );
          case "text":
            return (
              <Text
                key={el.id}
                {...commonProps}
                x={el.x}
                y={el.y}
                text={el.text || "Text"}
                fontSize={el.fontSize || 16}
                fontFamily={el.fontFamily || "Arial"}
                fill={el.fill}
                width={el.width}
                height={el.height}
              />
            );
          default:
            return null;
        }
      })}
    </Group>
  );
}
