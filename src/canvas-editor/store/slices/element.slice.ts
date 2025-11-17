import { CanvasPoint, SliceFactory } from "@/canvas-editor/canvas-editor.types";
export type ElementSlice = {
  moveElement: (frameId: string, elementId: string, position: CanvasPoint) => void;
};

export const createElementSlice: SliceFactory<ElementSlice> = (set) => {
  return {
    moveElement: (frameId, elementId, position) => {
      set((state) => {
        const nextPages = state.pages.map((page) => ({
          ...page,
          frames: page.frames.map((frame) => {
            if (frame.id !== frameId) return frame;
            return {
              ...frame,
              elements: frame.elements.map((el) =>
                el.id === elementId
                  ? {
                      ...el,
                      x: position.x,
                      y: position.y,
                    }
                  : el
              ),
            };
          }),
        }));

        return { pages: nextPages };
      });
    },
  };
};
