import { EditorStore } from "@/store/canvas-editor/canvas-editor.types";

export const createFrameUpdateAction = (
  activeFrameId: string | null,
  updateFrame: EditorStore["updateFrame"],
  field: "width" | "height"
): ((value: string | number) => void) => {
  return (value: string | number) => {
    if (activeFrameId && typeof value === "number") {
      updateFrame(activeFrameId, { [field]: value });
    }
  };
};
