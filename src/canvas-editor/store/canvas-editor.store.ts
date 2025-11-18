"use client";

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { EditorStore } from "../canvas-editor.types";
import { createGridSlice } from "./slices/grid.slice";
import { createRootSlice } from "./slices/root.slice";
import { createPageSlice } from "./slices/page.slice";
import { createFrameSlice } from "./slices/frame.slice";
import { createElementSlice } from "./slices/element.slice";

export const useCanvasStore = create<EditorStore>()(
  devtools(
    persist(
      (set, get, store) => ({
        ...createRootSlice(set, get, store),
        ...createGridSlice(set, get, store),
        ...createPageSlice(set, get, store),
        ...createFrameSlice(set, get, store),
        ...createElementSlice(set, get, store),
      }),
      {
        name: "mc-canvas-editor-storage-state",
        partialize: (state) => ({
          ...state,
          liveFrameDimensions: undefined,
        }),
      }
    ),
    {
      name: "CanvasEditorStore",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// Eksportuj store API dla dostępu do persist API
export const canvasStoreApi = useCanvasStore;
