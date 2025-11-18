import { useCallback } from "react";
import { useCanvasStore } from "../store/canvas-editor.store";
import type { Dimensions } from "./useLiveDimensions";
import { Page } from "../canvas-editor.types";

export function useElementInteractions(
  activePage: Page | null,
  setLiveElementDimensions: (dimensions: Dimensions | null) => void
) {
  const setActiveElement = useCanvasStore((state) => state.setActiveElement);
  const setActiveFrame = useCanvasStore((state) => state.setActiveFrame);
  const moveElement = useCanvasStore((state) => state.moveElement);

  const activateElementAndFrame = useCallback(
    (frameId: string, elementId: string) => {
      setActiveElement(frameId, elementId);
      setActiveFrame(frameId);
    },
    [setActiveElement, setActiveFrame]
  );

  const handleElementClick = useCallback(
    (frameId: string, elementId: string) => {
      activateElementAndFrame(frameId, elementId);
    },
    [activateElementAndFrame]
  );

  const handleElementDragStart = useCallback(
    (frameId: string, elementId: string) => {
      activateElementAndFrame(frameId, elementId);

      // Set initial dimensions - find element in store
      if (activePage) {
        const frame = activePage.frames.find((f) => f.id === frameId);
        if (frame) {
          const element = frame.elements.find((el) => el.id === elementId);
          if (element) {
            // Live dimensions should always use bounding box position (top-left)
            setLiveElementDimensions({
              x: frame.x + element.x,
              y: frame.y + element.y,
              width: element.width,
              height: element.height,
            });
          }
        }
      }
    },
    [activePage, activateElementAndFrame, setLiveElementDimensions]
  );

  const handleElementDragMove = useCallback(
    (frameId: string, elementId: string, position: { x: number; y: number }) => {
      if (!activePage) return;

      const frame = activePage.frames.find((f) => f.id === frameId);
      if (!frame) return;

      const element = frame.elements.find((el) => el.id === elementId);
      if (!element) return;

      // Position is already adjusted in Frame component to be top-left corner
      setLiveElementDimensions({
        x: frame.x + position.x,
        y: frame.y + position.y,
        width: element.width,
        height: element.height,
      });
    },
    [activePage, setLiveElementDimensions]
  );

  const handleElementDragEnd = useCallback(
    (frameId: string, elementId: string, position: { x: number; y: number }) => {
      moveElement(frameId, elementId, position);
      activateElementAndFrame(frameId, elementId);
      setLiveElementDimensions(null);
    },
    [moveElement, activateElementAndFrame, setLiveElementDimensions]
  );

  return {
    handleElementClick,
    handleElementDragStart,
    handleElementDragMove,
    handleElementDragEnd,
  };
}
