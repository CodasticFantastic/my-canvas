import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { useEditorStore } from "@/store/canvas-editor/canvas-editor.store";
import { createFrameUpdateAction } from "@/lib/canvas-editor/inputs-helpers";
import {
  CanvasEditorInputActionType,
  CanvasEditorInputActions,
  EditorStore,
} from "@/store/canvas-editor/canvas-editor.types";
import { useMemo } from "react";
import * as React from "react";

// Inputs Configs Type
interface ActionInputConfig {
  label: string;
  type: React.HTMLInputTypeAttribute;
  min?: number;
  max?: number;
  getValue: (activeFrame: { width: number; height: number } | null) => string | number;
}

// Inputs Configs
const actionInputConfigs: Record<CanvasEditorInputActionType, ActionInputConfig> = {
  [CanvasEditorInputActions.FrameWidthUpdate]: {
    label: "Width",
    type: "number",
    min: 1,
    getValue: (activeFrame) => activeFrame?.width ?? 0,
  },
  [CanvasEditorInputActions.FrameHeightUpdate]: {
    label: "Height",
    type: "number",
    min: 1,
    getValue: (activeFrame) => activeFrame?.height ?? 0,
  },
};

// Input Actions
function ChangeFrameWidth(activeFrameId: string | null, updateFrame: EditorStore["updateFrame"]) {
  return createFrameUpdateAction(activeFrameId, updateFrame, "width");
}

function ChangeFrameHeight(activeFrameId: string | null, updateFrame: EditorStore["updateFrame"]) {
  return createFrameUpdateAction(activeFrameId, updateFrame, "height");
}

// Action Input Props Type
interface ActionInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange" | "type" | "min" | "max" | "size"> {
  variant: CanvasEditorInputActionType;
}

// Action Input Component
export function ActionInput({ variant, id, className, ...props }: ActionInputProps) {
  const { activeFrameId, updateFrame, frames } = useEditorStore();

  const activeFrame = useMemo(() => {
    return activeFrameId ? (frames.find((f) => f.id === activeFrameId) ?? null) : null;
  }, [frames, activeFrameId]);

  const config = actionInputConfigs[variant];
  const inputId = id || `action-input-${variant}`;
  const value = config.getValue(activeFrame);

  const action = useMemo(() => {
    switch (variant) {
      case CanvasEditorInputActions.FrameWidthUpdate:
        return ChangeFrameWidth(activeFrameId, updateFrame);
      case CanvasEditorInputActions.FrameHeightUpdate:
        return ChangeFrameHeight(activeFrameId, updateFrame);
      default:
        return () => {};
    }
  }, [variant, activeFrameId, updateFrame]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = config.type === "number" ? Number(e.target.value) : e.target.value;
    action(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="mb-1 text-xs">
        {config.label}
      </Label>
      <Input
        id={inputId}
        size="xs"
        type={config.type}
        value={value}
        onChange={handleChange}
        min={config.min}
        max={config.max}
        className={className}
        {...props}
      />
    </div>
  );
}
