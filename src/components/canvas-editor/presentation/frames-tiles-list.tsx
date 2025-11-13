import React from "react";
import { LoadingSpinner } from "@/components/global/loading-spinner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn/ui/alert-dialog";
import { Button } from "@/components/shadcn/ui/button";
import { Card, CardContent } from "@/components/shadcn/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/shadcn/ui/tooltip";
import { useEditorStore } from "@/store/canvas-editor/canvas-editor.store";
import { Frame } from "@/store/canvas-editor/canvas-editor.types";
import { TrashIcon } from "lucide-react";
import { CanvasEditorSettingsSection } from "./canvas-editor-settings-section";

export const FramesTilesList = () => {
  const { frames, isCanvasInitializing } = useEditorStore();

  return (
    <CanvasEditorSettingsSection title="Frame Properties" className="scrollbar-thin h-1/3 overflow-y-auto">
      {isCanvasInitializing && <LoadingSpinner message="Loading frames..." className="text-sm" />}

      {!isCanvasInitializing && frames.length === 0 && (
        <p className="text-muted-foreground text-sm">No frames yet. Add your first frame!</p>
      )}

      {!isCanvasInitializing && frames.length > 0 && (
        <div className="space-y-1">
          {frames.map((frame) => (
            <FrameTile key={frame.id} frame={frame} />
          ))}
        </div>
      )}
    </CanvasEditorSettingsSection>
  );
};

const FrameTile = ({ frame }: { frame: Frame }) => {
  const { activeFrameId, setActiveFrame, removeFrame } = useEditorStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    removeFrame(frame.id);
    setIsOpen(false);
  };

  return (
    <>
      <Card
        onClick={() => setActiveFrame(frame.id)}
        className={`group cursor-pointer rounded-md border p-2 transition-colors ${
          activeFrameId === frame.id ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
        }`}
      >
        <CardContent className="flex flex-row items-center justify-between gap-2 p-0">
          <Tooltip>
            <TooltipTrigger className="cursor-help truncate text-sm font-medium">{frame.name}</TooltipTrigger>
            <TooltipContent>{frame.name}</TooltipContent>
          </Tooltip>
          <div className="text-muted-foreground flex items-center justify-end text-center text-xs text-nowrap">
            <span>
              {frame.width} × {frame.height}
            </span>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                <span className="group-hover:animate-in group-hover:fade-in group-hover:slide-in-from-right ml-1 hidden items-center justify-center group-hover:inline-block group-hover:duration-200">
                  <TrashIcon className="text-destructive hover:text-destructive/80 size-3 cursor-pointer transition-colors" />
                </span>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogTitle>Delete Frame</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <strong>&quot;{frame.name}&quot;</strong>?
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      handleDelete(e);
                    }}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
