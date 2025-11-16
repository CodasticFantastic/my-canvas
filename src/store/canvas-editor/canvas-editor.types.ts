import { StateCreator } from "zustand";
import { CanvasEditorSaveSlice } from "./slices/save.slice";
import { CanvasEditorFrameSlice } from "./slices/frame.slice";
import { CanvasEditorGlobalSlice } from "./slices/global.slice";
import { CanvasEditorStageSlice } from "./slices/stage.slice";

export type EditorStore = CanvasEditorFrameSlice & CanvasEditorSaveSlice & CanvasEditorGlobalSlice & CanvasEditorStageSlice;

export type SliceFactory<T> = StateCreator<
  EditorStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  T
>;

// Canvas Objects
export type Frame = {
  id: string;
  name: string;
  width: number;
  height: number;
  elements?: unknown[];
  createdAt: string;
};

// Input Actions
export const CanvasEditorInputActions = {
  FrameWidthUpdate: "frame-width-update",
  FrameHeightUpdate: "frame-height-update",
} as const;

export type CanvasEditorInputActionType = (typeof CanvasEditorInputActions)[keyof typeof CanvasEditorInputActions];
