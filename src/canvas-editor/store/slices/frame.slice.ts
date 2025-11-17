import { nanoid } from "nanoid";
import { CanvasPoint, SliceFactory } from "@/canvas-editor/canvas-editor.types";
import { toast } from "sonner";
import { ColorLike } from "color";
import { Frame, Page } from "@/canvas-editor/canvas-editor.types";

export type FrameSlice = {
  activeFrame: Frame | null;
  addFrameToActivePage: () => void;
  setActiveFrame: (frameId: string | null) => void;
  moveFrame: (frameId: string, position: CanvasPoint) => void;
  updateFrameName: (frameId: string, name: string) => void;
  updateFramePosition: (frameId: string, x: number, y: number) => void;
  updateFrameSize: (frameId: string, width: number, height: number) => void;
  updateFrameColor: (frameId: string, color: ColorLike) => void;
  updateFrameBorderColor: (frameId: string, color: ColorLike) => void;
  updateFrameBorderWidth: (frameId: string, width: number) => void;
  updateFrameBorderRadius: (frameId: string, radius: number) => void;
  duplicateFrame: (frameId: string) => void;
  deleteFrame: (frameId: string) => void;
};

const updatePagesAndActiveState = (
  state: { pages: Page[]; activePage: Page | null; activeFrame: Frame | null },
  nextPages: Page[],
  frameId?: string
) => {
  const updatedFrame = frameId ? nextPages.flatMap((p) => p.frames).find((f) => f.id === frameId) : null;

  const updatedActivePage = state.activePage ? (nextPages.find((p) => p.id === state.activePage?.id) ?? null) : null;

  return {
    pages: nextPages,
    activePage: updatedActivePage,
    activeFrame: frameId && state.activeFrame?.id === frameId ? (updatedFrame ?? state.activeFrame) : state.activeFrame,
  };
};

export const createFrameSlice: SliceFactory<FrameSlice> = (set, get) => {
  return {
    activeFrame: null,

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
          color: "#ffffff",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          borderRadius: 8,
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
      const { pages, activePage } = get();
      if (!activePage) return;

      const updatedPage = pages.find((p) => p.id === activePage.id);
      if (!updatedPage) return;

      const frame = updatedPage.frames.find((f) => f.id === frameId) ?? null;
      set({
        activeFrame: frame,
        activePage: updatedPage,
      });
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

        return updatePagesAndActiveState(state, nextPages, frameId);
      });
    },

    updateFrameName: (frameId, name) => {
      set((state) => {
        const nextPages = state.pages.map((page) => ({
          ...page,
          frames: page.frames.map((frame) => (frame.id === frameId ? { ...frame, name } : frame)),
        }));

        return updatePagesAndActiveState(state, nextPages, frameId);
      });
    },

    updateFramePosition: (frameId, x, y) => {
      set((state) => {
        const nextPages = state.pages.map((page) => ({
          ...page,
          frames: page.frames.map((frame) => (frame.id === frameId ? { ...frame, x, y } : frame)),
        }));

        return updatePagesAndActiveState(state, nextPages, frameId);
      });
    },

    updateFrameSize: (frameId, width, height) => {
      set((state) => {
        const nextPages = state.pages.map((page) => ({
          ...page,
          frames: page.frames.map((frame) => (frame.id === frameId ? { ...frame, width, height } : frame)),
        }));

        return updatePagesAndActiveState(state, nextPages, frameId);
      });
    },

    updateFrameColor: (frameId, color) => {
      set((state) => {
        const nextPages = state.pages.map((page) => ({
          ...page,
          frames: page.frames.map((frame) => (frame.id === frameId ? { ...frame, color } : frame)),
        }));

        return updatePagesAndActiveState(state, nextPages, frameId);
      });
    },

    updateFrameBorderColor: (frameId, color) => {
      set((state) => {
        const nextPages = state.pages.map((page) => ({
          ...page,
          frames: page.frames.map((frame) => (frame.id === frameId ? { ...frame, borderColor: color } : frame)),
        }));

        return updatePagesAndActiveState(state, nextPages, frameId);
      });
    },

    updateFrameBorderWidth: (frameId, width) => {
      set((state) => {
        const nextPages = state.pages.map((page) => ({
          ...page,
          frames: page.frames.map((frame) => (frame.id === frameId ? { ...frame, borderWidth: width } : frame)),
        }));

        return updatePagesAndActiveState(state, nextPages, frameId);
      });
    },

    updateFrameBorderRadius: (frameId, radius) => {
      set((state) => {
        const nextPages = state.pages.map((page) => ({
          ...page,
          frames: page.frames.map((frame) => (frame.id === frameId ? { ...frame, borderRadius: radius } : frame)),
        }));

        return updatePagesAndActiveState(state, nextPages, frameId);
      });
    },

    duplicateFrame: (frameId) => {
      const { activePage } = get();
      if (!activePage) {
        toast.error("No active page");
        return;
      }

      set((state) => {
        const pageIndex = state.pages.findIndex((p) => p.id === activePage.id);
        if (pageIndex === -1) return {};

        const page = state.pages[pageIndex];
        const frameToDuplicate = page.frames.find((f) => f.id === frameId);
        if (!frameToDuplicate) return {};

        const newFrameId = nanoid();
        const duplicatedFrame: Frame = {
          ...frameToDuplicate,
          id: newFrameId,
          name: `${frameToDuplicate.name} (Copy)`,
          x: frameToDuplicate.x + 20,
          y: frameToDuplicate.y + 20,
          elements: frameToDuplicate.elements.map((el) => ({
            ...el,
            id: nanoid(),
          })),
        };

        const nextPages = [...state.pages];
        const updatedPage = {
          ...page,
          frames: [...page.frames, duplicatedFrame],
        };
        nextPages[pageIndex] = updatedPage;

        return {
          pages: nextPages,
          activePage: updatedPage,
          activeFrame: duplicatedFrame,
        };
      });
      toast.success("Frame duplicated");
    },

    deleteFrame: (frameId) => {
      const { activePage } = get();
      if (!activePage) {
        toast.error("No active page");
        return;
      }

      set((state) => {
        const pageIndex = state.pages.findIndex((p) => p.id === activePage.id);
        if (pageIndex === -1) return {};

        const page = state.pages[pageIndex];
        const frameToDelete = page.frames.find((f) => f.id === frameId);
        if (!frameToDelete) return {};

        const nextFrames = page.frames.filter((f) => f.id !== frameId);
        const wasActive = state.activeFrame?.id === frameId;

        const nextPages = [...state.pages];
        const updatedPage = {
          ...page,
          frames: nextFrames,
        };
        nextPages[pageIndex] = updatedPage;

        // If we are deleting the active frame, we need to set the new active frame
        let newActiveFrame = null;
        if (wasActive) {
          if (nextFrames.length > 0) {
            newActiveFrame = nextFrames[0];
          }
        } else {
          // If we are not deleting the active frame, we need to keep the active frame
          newActiveFrame = state.activeFrame;
        }

        return {
          pages: nextPages,
          activePage: updatedPage,
          activeFrame: newActiveFrame,
        };
      });
      toast.success("Frame deleted");
    },
  };
};
