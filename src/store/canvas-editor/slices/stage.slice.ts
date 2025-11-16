import { SliceFactory } from "../canvas-editor.types";

export type CanvasEditorStageSlice = {
  zoom: number;
  setZoom: (zoom: number) => void;
  resetTransform: () => void;
};

export const createStageSlice: SliceFactory<CanvasEditorStageSlice> = (set) => ({
  zoom: 1,

  setZoom: (zoom) => {
    set((state) => ({ ...state, zoom }));
  },

  resetTransform: () => {
    set((state) => ({ ...state, zoom: 1 }));
  },
});
