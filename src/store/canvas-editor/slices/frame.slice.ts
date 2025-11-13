import { Frame, SliceFactory } from "@/store/canvas-editor/canvas-editor.types";
import { toast } from "sonner";

export type CanvasEditorFrameSlice = {
  frames: Frame[];
  activeFrameId: string | null;
  addFrame: (frame: Omit<Frame, "id" | "createdAt">) => void;
  removeFrame: (id: string) => void;
  updateFrame: (id: string, updates: Partial<Frame>) => void;
  setActiveFrame: (id: string | null) => void;
  duplicateFrame: (id: string) => void;
};

export const createFrameSlice: SliceFactory<CanvasEditorFrameSlice> = (set) => ({
  frames: [],
  activeFrameId: null,

  addFrame: (frameData) => {
    const newFrame: Frame = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...frameData,
    };

    set((state) => {
      const newFrames = [...state.frames, newFrame];
      // If it's the first frame, set it as active
      const newActiveFrameId = state.frames.length === 0 ? newFrame.id : state.activeFrameId;

      return {
        frames: newFrames,
        activeFrameId: newActiveFrameId,
      };
    });
  },

  removeFrame: (id) => {
    set((state) => {
      const newFrames = state.frames.filter((f) => f.id !== id);
      let newActiveFrameId = state.activeFrameId;

      // Jeśli usuwamy aktywny frame, ustaw pierwszy dostępny jako aktywny
      if (state.activeFrameId === id) {
        newActiveFrameId = newFrames.length > 0 ? newFrames[0].id : null;
      }

      console.log(newActiveFrameId);

      toast.success(`Frame "${state.frames.find((f) => f.id === id)?.name}" has been deleted.`);

      return {
        frames: newFrames,
        activeFrameId: newActiveFrameId,
      };
    });
  },

  updateFrame: (id, updates) => {
    set((state) => ({
      frames: state.frames.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
  },

  setActiveFrame: (id) => {
    set({ activeFrameId: id });
  },

  duplicateFrame: (id) => {
    set((state) => {
      const frameToDuplicate = state.frames.find((f) => f.id === id);
      if (!frameToDuplicate) return state;

      const duplicatedFrame: Frame = {
        ...frameToDuplicate,
        id: crypto.randomUUID(),
        name: `${frameToDuplicate.name} (Copy)`,
        createdAt: new Date().toISOString(),
      };

      return {
        frames: [...state.frames, duplicatedFrame],
      };
    });
  },
});
