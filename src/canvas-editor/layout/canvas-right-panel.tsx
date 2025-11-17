"use client";
import { useCanvasStore } from "../store/canvas-editor.store";
import { Separator } from "@/components/shadcn/ui/separator";
import { FramePropertiesSection } from "../components/settings-sections/frame-properties-section";
import { PagePropertiesSection } from "../components/settings-sections/page-properties-section";

export const CanvasRightPanel = () => {
  const { pages, activePage, activeFrame } = useCanvasStore();

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-foreground text-xs font-semibold tracking-wide uppercase">Selected Element Properties</p>
        </div>
      </div>
      <Separator />
      {/* No pages info */}
      {pages.length === 0 && (
        <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">No Pages, add page</div>
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
