"use client";

import { Button } from "@/components/shadcn/ui/button";
import { useCanvasStore } from "../store/canvas-editor.store";

export const CanvasRightPanel = () => {
  const { pages, activePageId, activeFrameId, addFrameToActivePage } = useCanvasStore();

  const activePage = pages.find((p) => p.id === activePageId) ?? null;
  const activeFrame = activePage?.frames.find((f) => f.id === activeFrameId) ?? null;

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Canvas</p>
          <p className="text-sm font-medium">Right Panel</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => addFrameToActivePage()}>
          + Frame
        </Button>
      </div>

      <div className="bg-muted/40 rounded-md p-3 text-xs">
        <div className="mb-2">
          <p className="text-muted-foreground font-semibold">Current page</p>
          <p>{activePage ? activePage.name : "No page selected"}</p>
        </div>

        <div>
          <p className="text-muted-foreground font-semibold">Current frame</p>
          <p>{activeFrame ? activeFrame.name : "No frame selected"}</p>
        </div>
      </div>
    </div>
  );
};
