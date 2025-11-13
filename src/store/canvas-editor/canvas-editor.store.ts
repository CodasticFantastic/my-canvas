import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { EditorStore } from "@/store/canvas-editor/canvas-editor.types";
import { createFrameSlice } from "@/store/canvas-editor/slices/frame.slice";
import { createSaveSlice } from "@/store/canvas-editor/slices/save.slice";

export const LOCAL_STORAGE_CANVAS_EDITOR_KEY = "canvas-editor-state";

export const useEditorStore = create<EditorStore>()(
  devtools(
    persist(
      (...args) => ({
        ...createFrameSlice(...args),
        ...createSaveSlice(...args),
      }),
      {
        name: LOCAL_STORAGE_CANVAS_EDITOR_KEY,
        partialize: (state) => ({
          frames: state.frames,
          activeFrameId: state.activeFrameId,
        }),
      }
    ),
    { name: "CanvasEditorStore" }
  )
);
