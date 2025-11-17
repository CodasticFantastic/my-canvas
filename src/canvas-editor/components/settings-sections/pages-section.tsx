import { Button } from "@/components/shadcn/ui/button";
import { useCanvasStore } from "../../store/canvas-editor.store";
import { cn } from "@/lib/shadcn/utils";
import { SettingsSection } from "./settings-sections.boillerplate";

export const PagesSection = () => {
  const { pages, activePage, addPage, setActivePage } = useCanvasStore();

  return (
    <SettingsSection
      title="Pages"
      action={
        <Button size="xs" variant="ghost" onClick={addPage}>
          + Page
        </Button>
      }
    >
      <div className="flex flex-col gap-1">
        {pages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => setActivePage(page.id)}
            className={cn(
              "flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs transition-colors",
              activePage?.id === page.id ? "bg-accent text-accent-foreground" : "hover:bg-muted/80 text-foreground"
            )}
          >
            <span>{page.name}</span>
            <span className="text-muted-foreground text-[10px]">
              {page.frames.length} frame{page.frames.length === 1 ? "" : "s"}
            </span>
          </button>
        ))}
        {pages.length === 0 && (
          <div className="text-muted-foreground px-2 py-1 text-xs">No pages yet. Create one to start.</div>
        )}
      </div>
    </SettingsSection>
  );
};
