import { useEditorStore } from "@/store/canvas-editor/canvas-editor.store";
import { AddFrameButton } from "../actions/add-frame-button";
import { ActionInput } from "../actions/action-input";
import { CanvasEditorInputActions } from "@/store/canvas-editor/canvas-editor.types";
import { useMemo } from "react";
import { CanvasEditorSettingsSection } from "../presentation/canvas-editor-settings-section";

export const CanvasRightPanel = () => {
  const { frames, activeFrameId } = useEditorStore();

  const activeFrame = useMemo(() => {
    return activeFrameId ? frames.find((f) => f.id === activeFrameId) : null;
  }, [frames, activeFrameId]);

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4">
        <AddFrameButton size="sm" className="w-full" />
      </div>

      {activeFrame && (
        <CanvasEditorSettingsSection title="Frame Properties">
          <div className="flex gap-3">
            <ActionInput variant={CanvasEditorInputActions.FrameWidthUpdate} />
            <ActionInput variant={CanvasEditorInputActions.FrameHeightUpdate} />
          </div>
        </CanvasEditorSettingsSection>
      )}
    </div>
  );
};
