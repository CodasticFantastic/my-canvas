"use client";

import { create } from "zustand";
import { EditorStore } from "../canvas-editor.types";
import { createGridSlice } from "./slices/grid.slice";
import { createRootSlice } from "./slices/root.slice";
import { createPageSlice } from "./slices/page.slice";
import { createFrameSlice } from "./slices/frame.slice";
import { createElementSlice } from "./slices/element.slice";

export const useCanvasStore = create<EditorStore>()((set, get, store) => ({
  ...createRootSlice(set, get, store),
  ...createGridSlice(set, get, store),
  ...createPageSlice(set, get, store),
  ...createFrameSlice(set, get, store),
  ...createElementSlice(set, get, store),
}));
