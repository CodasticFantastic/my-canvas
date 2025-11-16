"use client";

import { create } from "zustand";
import { EditorStore } from "../canvas-editor.types";
import { createGridSlice } from "./slices/grid.slice";
import { createRootSlice } from "./slices/root.slice";
import { createDocumentSlice } from "./slices/document.slice";

export const useCanvasStore = create<EditorStore>()((set, get, store) => ({
  ...createRootSlice(set, get, store),
  ...createGridSlice(set, get, store),
  ...createDocumentSlice(set, get, store),
}));
