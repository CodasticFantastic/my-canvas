"use client";

import { PagesSection } from "../components/settings-sections/pages-section";
import { FramesSection } from "../components/settings-sections/frames-section";
import { LayersSection } from "../components/settings-sections/layers-section";
import { Separator } from "@/components/shadcn/ui/separator";
import { CanvasDropdownMenu } from "../components/canvas-dropdown-menu";

export const CanvasLeftPanel = () => {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <p className="text-primary text-lg font-bold">MyCanvas</p>
        <CanvasDropdownMenu />
      </div>
      <Separator />
      <PagesSection />
      <FramesSection />
      <LayersSection />
    </div>
  );
};
