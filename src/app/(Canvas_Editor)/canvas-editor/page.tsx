"use client";

import { Canvas } from "@/components/canvas-editor/layout/canvas";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/ui/resizable";
import { CanvasRightPanel } from "@/components/canvas-editor/layout/canvas-right-panel";

export default function CanvasEditorPage() {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={20}>
          <div>One</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={40}>
          <Canvas />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={20}>
          <CanvasRightPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
