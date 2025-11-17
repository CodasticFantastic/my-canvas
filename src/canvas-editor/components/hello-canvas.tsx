import { Button } from "@/components/shadcn/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/shadcn/ui/empty";
import { LayoutTemplateIcon } from "lucide-react";
import { useCanvasStore } from "../store/canvas-editor.store";

export const HelloCanvas = () => {
  const { activePage, activeFrame, addPage, addFrameToActivePage } = useCanvasStore();

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <Empty className="bg-background/90 pointer-events-auto max-w-md border border-dashed shadow-sm">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LayoutTemplateIcon className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>Nothing on this canvas yet</EmptyTitle>
          <EmptyDescription>Create a new page and add a frame to start working.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            {!activePage && (
              <Button size="sm" onClick={() => addPage()}>
                Create a page
              </Button>
            )}
            {activePage && !activeFrame && (
              <Button size="sm" onClick={() => addFrameToActivePage()}>
                Add a frame
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                console.log("Import project");
              }}
            >
              Import a project
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
};
