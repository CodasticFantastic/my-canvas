import { nanoid } from "nanoid";
import { CanvasPoint, SliceFactory } from "@/canvas-editor/canvas-editor.types";
import { toast } from "sonner";

export type CanvasElementType = "rect";

export type CanvasElement = {
  id: string;
  type: CanvasElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

export type Frame = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  elements: CanvasElement[];
};

export type Page = {
  id: string;
  name: string;
  frames: Frame[];
};

export type DocumentSlice = {
  pages: Page[];
  activeFrame: Frame | null;
  activePage: Page | null;
  addPage: () => void;
  setActivePage: (pageId: string) => void;
  addFrameToActivePage: () => void;
  setActiveFrame: (frameId: string | null) => void;
  moveFrame: (frameId: string, position: CanvasPoint) => void;
  moveElement: (frameId: string, elementId: string, position: CanvasPoint) => void;
};

export const createDocumentSlice: SliceFactory<DocumentSlice> = (set, get) => {
  return {
    pages: [],
    activePage: null,
    activeFrame: null,

    addPage: () => {
      set((state) => {
        const pages = state.pages ?? [];
        const index = pages.length + 1;
        const pageId = nanoid();

        const newPage: Page = {
          id: pageId,
          name: `Page ${index}`,
          frames: [],
        };

        return {
          pages: [...pages, newPage],
          activePage: newPage,
          activeFrame: null,
        };
      });
    },

    setActivePage: (pageId) => {
      const { pages } = get();
      const page = pages.find((p) => p.id === pageId) ?? null;
      set({
        activePage: page,
        activeFrame: page?.frames[0] ?? null,
      });
    },

    addFrameToActivePage: () => {
      const { activePage } = get();
      if (!activePage) {
        toast.error("Lack of active page. Add a page first.");

        return;
      }

      set((state) => {
        const { pages: currentPages } = state;
        const pageIndex = currentPages.findIndex((p) => p.id === activePage.id);
        if (pageIndex === -1) return {};

        const page = currentPages[pageIndex];
        const frameIndex = page.frames.length + 1;

        const frameId = nanoid();
        const newFrame: Frame = {
          id: frameId,
          name: `Frame ${frameIndex}`,
          x: 100,
          y: 100,
          width: 800,
          height: 600,
          elements: [],
        };

        const nextPages = [...currentPages];
        const updatedPage = {
          ...page,
          frames: [...page.frames, newFrame],
        };
        nextPages[pageIndex] = updatedPage;

        return {
          pages: nextPages,
          activePage: updatedPage,
          activeFrame: newFrame,
        };
      });
    },

    setActiveFrame: (frameId) => {
      const { activePage } = get();
      if (!activePage) return;

      const frame = activePage.frames.find((f) => f.id === frameId) ?? null;
      set({ activeFrame: frame });
    },

    moveFrame: (frameId, position) => {
      set((state) => {
        const nextPages = state.pages.map((page) => ({
          ...page,
          frames: page.frames.map((frame) =>
            frame.id === frameId
              ? {
                  ...frame,
                  x: position.x,
                  y: position.y,
                }
              : frame
          ),
        }));

        return { pages: nextPages };
      });
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
  };
};
