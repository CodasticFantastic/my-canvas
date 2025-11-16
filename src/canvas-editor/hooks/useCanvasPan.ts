import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Konva from "konva";
import { useCanvasStore } from "../store/canvas-editor.store";

type StageRef = React.RefObject<Konva.Stage | null>;

export function useCanvasPan(stageRef: StageRef) {
  const { setPan } = useCanvasStore();
  const [isPanning, setIsPanning] = useState(false);
  const [isSpaceHeld, setIsSpaceHeld] = useState(false);
  const spaceActiveRef = useRef(false);
  const middleActiveRef = useRef(false);

  // Global listeners for Space key to toggle panning mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !spaceActiveRef.current) {
        e.preventDefault();
        spaceActiveRef.current = true;
        setIsSpaceHeld(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
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
      if (!isPanning) {
        e.target.stopDrag();
      }
    },
    [isPanning]
  );

  const onDragEnd = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    setPan(stage.x(), stage.y());
  }, [setPan, stageRef]);

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
