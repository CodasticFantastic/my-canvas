"use client";

import { Button } from "@/components/shadcn/ui/button";
import { cn } from "@/lib/shadcn/utils";
import { useCanvasStore } from "../store/canvas-editor.store";

export const CanvasLeftPanel = () => {
  const { pages, activePageId, activeFrameId, addPage, setActivePage, setActiveFrame } = useCanvasStore();

  const activePage = pages.find((p) => p.id === activePageId) ?? null;
  const activeFrame = activePage?.frames.find((f) => f.id === activeFrameId) ?? null;

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Pages</span>
        <Button size="xs" variant="ghost" onClick={addPage}>
          + Page
        </Button>
      </div>

      <div className="bg-muted/40 flex flex-col gap-1 rounded-md p-1">
        {pages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => setActivePage(page.id)}
            className={cn(
              "flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs transition-colors",
              activePageId === page.id ? "bg-accent text-accent-foreground" : "hover:bg-muted/80 text-foreground"
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

      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Frames</span>
        </div>
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
                    activeFrameId === frame.id
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
      </div>

      <div className="mt-2 flex flex-1 flex-col gap-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Layers</span>
        </div>
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
    </div>
  );
};
