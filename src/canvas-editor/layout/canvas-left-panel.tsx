"use client";

import { PagesSection } from "../components/settings-sections/pages-section";
import { FramesSection } from "../components/settings-sections/frames-section";
import { LayersSection } from "../components/settings-sections/layers-section";

export const CanvasLeftPanel = () => {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PagesSection />
      <FramesSection />
      <LayersSection />
    </div>
  );
};
