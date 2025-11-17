import { Button } from "@/components/shadcn/ui/button";
import { useCanvasStore } from "../../store/canvas-editor.store";
import { cn } from "@/lib/shadcn/utils";
import { SettingsSection } from "./settings-sections.boillerplate";

export const FramesSection = () => {
  const { activePage, activeFrame, addFrameToActivePage, setActiveFrame } = useCanvasStore();

  return (
    <SettingsSection
      title="Frames"
      action={
        <Button size="xs" variant="ghost" onClick={addFrameToActivePage}>
          + Frame
        </Button>
      }
    >
      <div className="bg-muted/40 flex flex-col gap-1 rounded-md p-1">
        {activePage ? (
          activePage.frames.length > 0 ? (
            activePage.frames.map((frame) => (
              <button
                key={frame.id}
                type="button"
                onClick={() => setActiveFrame(frame.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs transition-colors",
                  activeFrame?.id === frame.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted/80 text-foreground"
                )}
              >
                <span>{frame.name}</span>
                <span className="text-muted-foreground text-[10px]">
                  {frame.elements.length} layer{frame.elements.length === 1 ? "" : "s"}
                </span>
              </button>
            ))
          ) : (
            <div className="text-muted-foreground px-2 py-1 text-xs">No frames on this page.</div>
          )
        ) : (
          <div className="text-muted-foreground px-2 py-1 text-xs">Select a page to see its frames.</div>
        )}
      </div>
    </SettingsSection>
  );
};
