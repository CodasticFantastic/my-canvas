import { StateCreator } from "zustand";
import { SaveSlice } from "./slices/save.slice";
import { FrameSlice } from "./slices/frame.slice";

export type EditorStore = FrameSlice & SaveSlice;

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
