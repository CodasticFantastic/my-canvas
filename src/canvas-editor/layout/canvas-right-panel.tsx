"use client";
import { useCanvasStore } from "../store/canvas-editor.store";
import { FramePropertiesSection } from "../components/settings-sections/frame-properties-section";
import { PagePropertiesSection } from "../components/settings-sections/page-properties-section";
import { FileExclamationPointIcon } from "lucide-react";

export const CanvasRightPanel = () => {
  const { pages, activePage, activeFrame } = useCanvasStore();

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      {/* No pages info */}
      {pages.length === 0 && (
        <div className="text-muted-foreground flex h-full items-center justify-center py-8 text-sm">
          <div className="flex flex-col items-center justify-center gap-2">
            <FileExclamationPointIcon className="size-10" />
            <p className="text-sm">No Pages, add page</p>
          </div>
        </div>
      )}
      {/* No active page info */}
      {pages.length > 0 && !activePage && (
        <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">No active page</div>
      )}
      {pages.length > 0 && activePage && activeFrame && <FramePropertiesSection />}
      {pages.length > 0 && activePage && !activeFrame && <PagePropertiesSection />}
    </div>
  );
};
