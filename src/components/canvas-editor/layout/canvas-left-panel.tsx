import { AddFrameButton } from "../actions/add-frame-button";
import { FramesTilesList } from "../presentation/frames-tiles-list";

export const CanvasLeftPanel = () => {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4">
        <AddFrameButton size="sm" className="w-full" />
      </div>
      <FramesTilesList />
    </div>
  );
};
