import { Rect } from "react-konva";
import type Konva from "konva";
import { Frame } from "../../canvas-editor.types";

type ResizeHandleProps = {
  frame: Frame;
  handle: "right" | "bottom" | "left" | "top";
  zoom: number;
  onResizeStart: (e: Konva.KonvaEventObject<DragEvent>, frame: Frame, handle: "right" | "bottom" | "left" | "top") => void;
  onResizeMove: (e: Konva.KonvaEventObject<DragEvent>, frame: Frame, handle: "right" | "bottom" | "left" | "top") => void;
  onResizeEnd: (e: Konva.KonvaEventObject<DragEvent>, frame: Frame, handle: "right" | "bottom" | "left" | "top") => void;
  onMouseEnter: (e: Konva.KonvaEventObject<MouseEvent>, handle: "right" | "bottom" | "left" | "top") => void;
  onMouseLeave: (e: Konva.KonvaEventObject<MouseEvent>) => void;
};

export function ResizeHandle({
  frame,
  handle,
  zoom,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
  onMouseEnter,
  onMouseLeave,
}: ResizeHandleProps) {
  const getHandleProps = () => {
    const handleSize = 10 / zoom;
    const handleOffset = 5 / zoom;

    switch (handle) {
      case "right":
        return {
          x: frame.width - handleOffset,
          y: 0,
          width: handleSize,
          height: frame.height,
        };
      case "bottom":
        return {
          x: 0,
          y: frame.height - handleOffset,
          width: frame.width,
          height: handleSize,
        };
      case "left":
        return {
          x: -handleOffset,
          y: 0,
          width: handleSize,
          height: frame.height,
        };
      case "top":
        return {
          x: 0,
          y: -handleOffset,
          width: frame.width,
          height: handleSize,
        };
    }
  };

  const props = getHandleProps();

  return (
    <Rect
      {...props}
      fill="transparent"
      draggable
      listening={true}
      onClick={(e) => {
        e.cancelBubble = true;
      }}
      onMouseEnter={(e) => onMouseEnter(e, handle)}
      onMouseLeave={onMouseLeave}
      onDragStart={(e) => onResizeStart(e, frame, handle)}
      onDragMove={(e) => onResizeMove(e, frame, handle)}
      onDragEnd={(e) => onResizeEnd(e, frame, handle)}
    />
  );
}

