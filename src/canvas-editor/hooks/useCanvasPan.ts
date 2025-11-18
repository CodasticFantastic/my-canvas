import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Konva from "konva";
import { useCanvasStore } from "../store/canvas-editor.store";
import { StageRef } from "../canvas-editor.types";

/**
 * Hook to handle canvas panning.
 */

export function useCanvasPan(stageRef: StageRef) {
  const { setPan } = useCanvasStore();
  const [isPanning, setIsPanning] = useState(false);
  const [isSpaceHeld, setIsSpaceHeld] = useState(false);
  const spaceActiveRef = useRef(false);
  const middleActiveRef = useRef(false);

  // Global listeners for Space key to toggle panning mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't intercept Space if user is typing in an input, textarea, or contenteditable element
      const target = e.target as HTMLElement;
      const isInputElement =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("input, textarea, [contenteditable]");

      if (e.code === "Space" && !spaceActiveRef.current) {
        // Only prevent default if not in an input element
        if (!isInputElement) {
          e.preventDefault();
          spaceActiveRef.current = true;
          setIsSpaceHeld(true);
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      // Don't intercept Space if user is typing in an input, textarea, or contenteditable element
      const target = e.target as HTMLElement;
      const isInputElement =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("input, textarea, [contenteditable]");

      if (e.code === "Space") {
        // Only prevent default if not in an input element
        if (!isInputElement) {
          e.preventDefault();
        }
        spaceActiveRef.current = false;
        setIsPanning(false);
        setIsSpaceHeld(false);
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp, { passive: false });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const onMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;
      const isMiddle = e.evt.button === 1;
      const shouldPan = isMiddle || spaceActiveRef.current;
      if (!shouldPan) return;

      if (isMiddle) {
        // prevent browser autoscroll on Windows
        e.evt.preventDefault();
      }

      middleActiveRef.current = isMiddle;
      setIsPanning(true);
      stage.draggable(true);
      stage.startDrag();
    },
    [stageRef]
  );

  const onMouseUp = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (middleActiveRef.current || spaceActiveRef.current) {
      middleActiveRef.current = false;
      setIsPanning(false);
      stage.stopDrag();
      stage.draggable(false);
    }
  }, [stageRef]);

  const onDragMove = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
  }, [stageRef]);

  const onDragStart = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;

      // If the target is the stage, stop dragging if panning is not active
      if (e.target === stage) {
        if (!isPanning) {
          e.target.stopDrag();
        }
        return;
      }
    },
    [isPanning, stageRef]
  );

  const onDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;

      // Update pan only if the drag ended on the stage
      if (e.target === stage) {
        setPan(stage.x(), stage.y());
      }
    },
    [setPan, stageRef]
  );

  const onMouseLeave = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (isPanning) {
      stage.stopDrag();
      setIsPanning(false);
      stage.draggable(false);
    }
  }, [isPanning, stageRef]);

  const stageProps = useMemo(
    () => ({
      draggable: false,
      onMouseDown,
      onMouseUp,
      onDragMove,
      onDragStart,
      onDragEnd,
      onMouseLeave,
    }),
    [onMouseDown, onMouseUp, onDragMove, onDragStart, onDragEnd, onMouseLeave]
  );

  const cursor = isPanning ? "grabbing" : isSpaceHeld ? "grab" : "default";

  return { stageProps, cursor, isPanning };
}
