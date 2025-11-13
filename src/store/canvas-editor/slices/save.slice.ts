import { SliceFactory } from "@/store/canvas-editor/canvas-editor.types";
import { LOCAL_STORAGE_CANVAS_EDITOR_KEY } from "../canvas-editor.store";

export type CanvasEditorSaveSlice = {
  clearSavedState: () => void;
};

export const createSaveSlice: SliceFactory<CanvasEditorSaveSlice> = () => ({
  clearSavedState: () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(LOCAL_STORAGE_CANVAS_EDITOR_KEY);
    } catch (error) {
      console.error("Failed to clear saved state:", error);
    }
  },
});
