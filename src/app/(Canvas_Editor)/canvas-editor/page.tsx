"use client";

import { Canvas } from "@/canvas-editor/layout/canvas";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/ui/resizable";
import { CanvasRightPanel } from "@/canvas-editor/layout/canvas-right-panel";
import { CanvasLeftPanel } from "@/canvas-editor/layout/canvas-left-panel";

export default function CanvasEditorPage() {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <CanvasLeftPanel />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={40}>
          <Canvas />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={15}>
          <CanvasRightPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
