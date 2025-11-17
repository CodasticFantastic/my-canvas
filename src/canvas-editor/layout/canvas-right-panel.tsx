"use client";
import { useCanvasStore } from "../store/canvas-editor.store";
import { Separator } from "@/components/shadcn/ui/separator";
import { SettingsInput } from "../components/settings-input";

export const CanvasRightPanel = () => {
  const { activeFrame } = useCanvasStore();

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Canvas</p>
          <p className="text-sm font-medium">Right Panel</p>
        </div>
      </div>

      <Separator />

      <SettingsInput
        label="Frame name"
        value={activeFrame?.name ?? ""}
        onChange={(value) => console.log(value)}
        labelIn
      />
    </div>
  );
};
