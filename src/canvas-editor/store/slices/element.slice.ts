import { nanoid } from "nanoid";
import { CanvasPoint, CanvasElement, CanvasElementType, SliceFactory } from "@/canvas-editor/canvas-editor.types";
import { toast } from "sonner";

export type ElementSlice = {
  activeElement: { frameId: string; elementId: string } | null;
  setActiveElement: (frameId: string | null, elementId: string | null) => void;
  moveElement: (frameId: string, elementId: string, position: CanvasPoint) => void;
  addElementToFrame: (frameId: string, type: CanvasElementType, position?: CanvasPoint) => void;
};

export const createElementSlice: SliceFactory<ElementSlice> = (set, get) => {
  return {
    activeElement: null,

    setActiveElement: (frameId, elementId) => {
      if (frameId === null || elementId === null) {
        set({ activeElement: null });
        return;
      }
      set({ activeElement: { frameId, elementId } });
    },

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

    addElementToFrame: (frameId, type, position) => {
      const { activePage, activeFrame } = get();
      if (!activePage) {
        toast.error("No active page");
        return;
      }

      const frame = activePage.frames.find((f) => f.id === frameId);
      if (!frame) {
        toast.error("Frame not found");
        return;
      }

      const elementId = nanoid();
      const defaultSize = 100;
      const defaultPosition = position || {
        x: frame.width / 2 - defaultSize / 2,
        y: frame.height / 2 - defaultSize / 2,
      };

      let newElement: CanvasElement;

      switch (type) {
        case "square":
        case "rect":
          newElement = {
            id: elementId,
            type: type === "square" ? "square" : "rect",
            name: type === "square" ? "Square" : "Rectangle",
            x: defaultPosition.x,
            y: defaultPosition.y,
            width: defaultSize,
            height: defaultSize,
            fill: "#6366f1",
          };
          break;
        case "circle":
          newElement = {
            id: elementId,
            type: "circle",
            name: "Circle",
            x: defaultPosition.x,
            y: defaultPosition.y,
            width: defaultSize,
            height: defaultSize,
            fill: "#6366f1",
          };
          break;
        case "triangle":
          newElement = {
            id: elementId,
            type: "triangle",
            name: "Triangle",
            x: defaultPosition.x,
            y: defaultPosition.y,
            width: defaultSize,
            height: defaultSize,
            fill: "#6366f1",
          };
          break;
        case "line":
          newElement = {
            id: elementId,
            type: "line",
            name: "Line",
            x: defaultPosition.x,
            y: defaultPosition.y,
            width: 100,
            height: 0,
            fill: "#000000",
            points: [0, 0, 100, 0],
          };
          break;
        case "text":
          newElement = {
            id: elementId,
            type: "text",
            name: "Text",
            x: defaultPosition.x,
            y: defaultPosition.y,
            width: 200,
            height: 30,
            fill: "#000000",
            text: "Text",
            fontSize: 16,
            fontFamily: "Arial",
          };
          break;
        default:
          return;
      }

      set((state) => {
        const nextPages = state.pages.map((page) => ({
          ...page,
          frames: page.frames.map((f) =>
            f.id === frameId
              ? {
                  ...f,
                  elements: [...f.elements, newElement],
                }
              : f
          ),
        }));

        const updatedPage = nextPages.find((p) => p.id === activePage.id);
        return {
          pages: nextPages,
          activePage: updatedPage || activePage,
          activeFrame:
            frame.id === activeFrame?.id ? { ...frame, elements: [...frame.elements, newElement] } : activeFrame,
        };
      });

      set({ activeElement: { frameId, elementId } });
      toast.success(`${newElement.name} added`);
    },
  };
};
