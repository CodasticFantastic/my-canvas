import { useCanvasStore } from "../../store/canvas-editor.store";
import { SettingsSection } from "./settings-sections.boilerplate";

export const LayersSection = () => {
  const { activeFrame } = useCanvasStore();

  return (
    <SettingsSection title="Layers">
      <div className="mt-2 flex flex-1 flex-col gap-2 overflow-hidden">
        <div className="bg-muted/40 flex-1 overflow-auto rounded-md p-1">
          {activeFrame ? (
            activeFrame.elements.length > 0 ? (
              <div className="flex flex-col gap-1">
                {activeFrame.elements.map((el) => (
                  <div
                    key={el.id}
                    className="hover:bg-muted/80 flex items-center justify-between rounded px-2 py-1 text-xs"
                  >
                    <span>{el.name}</span>
                    <span className="text-muted-foreground text-[10px]">{el.type}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground px-2 py-1 text-xs">No layers in this frame.</div>
            )
          ) : (
            <div className="text-muted-foreground px-2 py-1 text-xs">Select a frame to see its layers.</div>
          )}
        </div>
      </div>
    </SettingsSection>
  );
};
