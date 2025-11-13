import { useEditorStore } from "@/store/canvas-editor/canvas-editor.store";
import { AddFrameButton } from "../add-frame-button";

export const CanvasRightPanel = () => {
  const { frames, activeFrameId, setActiveFrame } = useEditorStore();

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4">
        <AddFrameButton size="sm" className="w-full" />
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {frames.length === 0 ? (
          <p className="text-muted-foreground text-sm">No frames yet. Add your first frame!</p>
        ) : (
          frames.map((frame) => (
            <div
              key={frame.id}
              onClick={() => setActiveFrame(frame.id)}
              className={`cursor-pointer rounded-md border p-3 transition-colors ${
                activeFrameId === frame.id ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
              }`}
            >
              <div className="text-sm font-medium">{frame.name}</div>
              <div className="text-muted-foreground text-xs">
                {frame.width} × {frame.height}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
