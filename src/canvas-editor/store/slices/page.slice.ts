import { nanoid } from "nanoid";
import { SliceFactory } from "@/canvas-editor/canvas-editor.types";
import { Page } from "@/canvas-editor/canvas-editor.types";
import { ColorLike } from "color";

export type PageSlice = {
  pages: Page[];
  activePage: Page | null;
  addPage: () => void;
  setActivePage: (pageId: string) => void;
  updatePageName: (pageId: string, name: string) => void;
  updatePageBackgroundColor: (pageId: string, color: ColorLike) => void;
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

    updatePageName: (pageId, name) => {
      set((state) => {
        const nextPages = state.pages.map((page) => (page.id === pageId ? { ...page, name } : page));

        const updatedActivePage =
          state.activePage?.id === pageId ? (nextPages.find((p) => p.id === pageId) ?? null) : state.activePage;

        return {
          pages: nextPages,
          activePage: updatedActivePage,
        };
      });
    },

    updatePageBackgroundColor: (pageId, color) => {
      set((state) => {
        const nextPages = state.pages.map((page) => (page.id === pageId ? { ...page, backgroundColor: color } : page));

        const updatedActivePage =
          state.activePage?.id === pageId ? (nextPages.find((p) => p.id === pageId) ?? null) : state.activePage;

        return {
          pages: nextPages,
          activePage: updatedActivePage,
        };
      });
    },
  };
};
