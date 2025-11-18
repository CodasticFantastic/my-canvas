import { useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/ui/popover";
import { useCanvasStore } from "../../store/canvas-editor.store";
import { cn } from "@/lib/shadcn/utils";
import { SettingsSection } from "./settings-sections.boilerplate";
import { CopyIcon, Trash2Icon, ChevronRightIcon, LockIcon, UnlockIcon } from "lucide-react";
import { Frame } from "@/canvas-editor/canvas-editor.types";
import { POPULAR_FRAME_SIZES } from "@/canvas-editor/canvas-editor.config";

export const FramesSection = () => {
  const {
    activePage,
    activeFrame,
    addFrameToActivePage,
    setActiveFrame,
    duplicateFrame,
    deleteFrame,
    toggleFrameLock,
  } = useCanvasStore();
  const [frameToDelete, setFrameToDelete] = useState<Frame | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleDuplicateFrame = (e: React.MouseEvent, frameId: string) => {
    e.stopPropagation();
    duplicateFrame(frameId);
  };

  const handleDeleteClick = (e: React.MouseEvent, frame: Frame) => {
    e.stopPropagation();
    setFrameToDelete(frame);
  };

  const handleDeleteConfirm = () => {
    if (frameToDelete) {
      deleteFrame(frameToDelete.id);
      setFrameToDelete(null);
    }
  };

  const handleToggleLock = (e: React.MouseEvent, frameId: string) => {
    e.stopPropagation();
    toggleFrameLock(frameId);
  };

  const handleAddFrameWithSize = (width: number, height: number, name: string) => {
    addFrameToActivePage(width, height, name);
    setPopoverOpen(false);
  };

  return (
    <SettingsSection
      title="Frames"
      action={
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button size="xs" variant="ghost">
              + Frame
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" align="center" className="w-64 p-2">
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">Popular sizes</div>
              {POPULAR_FRAME_SIZES.map((size) => (
                <button
                  key={`${size.width}-${size.height}`}
                  onClick={() => handleAddFrameWithSize(size.width, size.height, size.name)}
                  className="hover:bg-accent hover:text-accent-foreground flex items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{size.name}</span>
                    <span className="text-muted-foreground text-[10px]">
                      {size.width} × {size.height}
                    </span>
                  </div>
                  <ChevronRightIcon className="text-muted-foreground size-3" />
                </button>
              ))}
              <div className="my-1 border-t" />
              <button
                onClick={() => {
                  addFrameToActivePage();
                  setPopoverOpen(false);
                }}
                className="hover:bg-accent hover:text-accent-foreground flex items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-medium">Custom size</span>
                  <span className="text-muted-foreground text-[10px]">800 × 600 (default)</span>
                </div>
                <ChevronRightIcon className="text-muted-foreground size-3" />
              </button>
            </div>
          </PopoverContent>
        </Popover>
      }
    >
      <div className="bg-muted/40 flex flex-col gap-1 rounded-md p-1">
        {activePage ? (
          activePage.frames.length > 0 ? (
            activePage.frames.map((frame) => (
              <div
                key={frame.id}
                onClick={() => setActiveFrame(frame.id, true)}
                className={cn(
                  "group flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 text-left text-xs transition-colors",
                  activeFrame?.id === frame.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted/80 text-foreground"
                )}
              >
                <span className="me-2 truncate">{frame.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground text-[10px] whitespace-nowrap">
                    {frame.elements.length} layer{frame.elements.length === 1 ? "" : "s"}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 opacity-50 transition-opacity group-hover:opacity-100"
                    onClick={(e) => handleDuplicateFrame(e, frame.id)}
                    aria-label="Duplicate frame"
                  >
                    <CopyIcon className="size-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 opacity-50 transition-opacity group-hover:opacity-100"
                    onClick={(e) => handleToggleLock(e, frame.id)}
                    aria-label={frame.locked ? "Unlock frame" : "Lock frame"}
                  >
                    {frame.locked ? <LockIcon className="size-3" /> : <UnlockIcon className="size-3" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive h-5 w-5 transition-opacity group-hover:opacity-100"
                    onClick={(e) => handleDeleteClick(e, frame)}
                    aria-label="Delete frame"
                  >
                    <Trash2Icon className="size-3" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground px-2 py-1 text-xs">No frames on this page.</div>
          )
        ) : (
          <div className="text-muted-foreground px-2 py-1 text-xs">Select a page to see its frames.</div>
        )}
      </div>

      <AlertDialog open={frameToDelete !== null} onOpenChange={(open) => !open && setFrameToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this frame?</AlertDialogTitle>
            <AlertDialogDescription>
              You are going to delete <strong>&quot;{frameToDelete?.name}&quot;</strong> with all its elements.
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsSection>
  );
};
