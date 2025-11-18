import { nanoid } from "nanoid";
import { SliceFactory } from "@/canvas-editor/canvas-editor.types";
import { Page } from "@/canvas-editor/canvas-editor.types";
import { ColorLike } from "color";
import { toast } from "sonner";

const updateSinglePage =
  (pageId: string, updater: (page: Page) => Page) => (state: { pages: Page[]; activePage: Page | null }) => {
    const nextPages = state.pages.map((page) => (page.id === pageId ? updater(page) : page));

    const updatedActivePage =
      state.activePage?.id === pageId ? (nextPages.find((p) => p.id === pageId) ?? null) : state.activePage;

    return {
      pages: nextPages,
      activePage: updatedActivePage,
    };
  };

export type PageSlice = {
  pages: Page[];
  activePage: Page | null;
  addPage: () => void;
  setActivePage: (pageId: string) => void;
  updatePageName: (pageId: string, name: string) => void;
  updatePageBackgroundColor: (pageId: string, color: ColorLike) => void;
  duplicatePage: (pageId: string) => void;
  deletePage: (pageId: string) => void;
};

export const createPageSlice: SliceFactory<PageSlice> = (set, get) => {
  return {
    pages: [],
    activePage: null,

    addPage: () => {
      set((state) => {
        const pages = state.pages ?? [];
        const index = pages.length + 1;
        const pageId = nanoid();

        const newPage: Page = {
          id: pageId,
          name: `Page ${index}`,
          backgroundColor: "#eeeeee00",
          frames: [],
        };

        return {
          pages: [...pages, newPage],
          activePage: newPage,
          activeFrame: null,
          activeElement: null,
        };
      });
    },

    setActivePage: (pageId) => {
      const { pages } = get();
      const page = pages.find((p) => p.id === pageId) ?? null;

      set({
        activePage: page,
        activeFrame: null,
        activeElement: null,
      });
    },

    updatePageName: (pageId, name) => {
      set((state) => updateSinglePage(pageId, (page) => ({ ...page, name }))(state));
    },

    updatePageBackgroundColor: (pageId, color) => {
      set((state) => updateSinglePage(pageId, (page) => ({ ...page, backgroundColor: color }))(state));
    },

    duplicatePage: (pageId) => {
      set((state) => {
        const pageToDuplicate = state.pages.find((p) => p.id === pageId);
        if (!pageToDuplicate) return {};

        const newPageId = nanoid();
        const duplicatedPage: Page = {
          ...pageToDuplicate,
          id: newPageId,
          name: `${pageToDuplicate.name} (Copy)`,
          frames: pageToDuplicate.frames.map((frame) => ({
            ...frame,
            id: nanoid(),
            elements: frame.elements.map((el) => ({
              ...el,
              id: nanoid(),
            })),
          })),
        };

        return {
          pages: [...state.pages, duplicatedPage],
          activePage: duplicatedPage,
          activeFrame: duplicatedPage.frames[0] ?? null,
          activeElement: null,
        };
      });
      toast.success("Page duplicated");
    },

    deletePage: (pageId) => {
      set((state) => {
        const pageToDelete = state.pages.find((p) => p.id === pageId);
        if (!pageToDelete) return {};

        const nextPages = state.pages.filter((p) => p.id !== pageId);
        const wasActive = state.activePage?.id === pageId;

        // If we are deleting the active page, we need to set the new active page and frame
        let newActivePage = null;
        let newActiveFrame = null;

        if (wasActive) {
          if (nextPages.length > 0) {
            newActivePage = nextPages[0];
            newActiveFrame = nextPages[0].frames[0] ?? null;
          }
        } else {
          // If we are not deleting the active page, we need to keep the active page and frame
          newActivePage = state.activePage;
          newActiveFrame = state.activeFrame;
        }

        return {
          pages: nextPages,
          activePage: newActivePage,
          activeFrame: newActiveFrame,
          activeElement: null,
        };
      });
      toast.success("Page deleted");
    },
  };
};
