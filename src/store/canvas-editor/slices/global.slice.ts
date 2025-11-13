import { SliceFactory } from "../canvas-editor.types";

export type CanvasEditorGlobalSlice = {
  isCanvasInitializing: boolean;
  setIsCanvasInitializing: (isLoading: boolean) => void;
};

export const createGlobalSlice: SliceFactory<CanvasEditorGlobalSlice> = (set) => ({
  isCanvasInitializing: true,

  setIsCanvasInitializing: (isInitializing: boolean) => {
    set((state) => ({ ...state, isCanvasInitializing: isInitializing }));
  },
});
