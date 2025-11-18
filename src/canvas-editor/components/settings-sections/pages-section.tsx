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
import { useCanvasStore } from "../../store/canvas-editor.store";
import { cn } from "@/lib/shadcn/utils";
import { SettingsSection } from "./settings-sections.boilerplate";
import { CopyIcon, Trash2Icon } from "lucide-react";
import { Page } from "@/canvas-editor/canvas-editor.types";

export const PagesSection = () => {
  const { pages, activePage, addPage, setActivePage, duplicatePage, deletePage } = useCanvasStore();
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);

  const handleDuplicatePage = (e: React.MouseEvent, pageId: string) => {
    e.stopPropagation();
    duplicatePage(pageId);
  };

  const handleDeleteClick = (e: React.MouseEvent, page: Page) => {
    e.stopPropagation();
    setPageToDelete(page);
  };

  const handleDeleteConfirm = () => {
    if (pageToDelete) {
      deletePage(pageToDelete.id);
      setPageToDelete(null);
    }
  };

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
          <div
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={cn(
              "group flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 text-left text-xs transition-colors",
              activePage?.id === page.id ? "bg-accent text-accent-foreground" : "hover:bg-muted/80 text-foreground"
            )}
          >
            <span className="me-2 truncate">{page.name}</span>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-[10px] whitespace-nowrap">
                {page.frames.length} frame{page.frames.length === 1 ? "" : "s"}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 opacity-50 transition-opacity group-hover:opacity-100"
                onClick={(e) => handleDuplicatePage(e, page.id)}
                aria-label="Duplicate page"
              >
                <CopyIcon className="size-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive h-5 w-5 transition-opacity group-hover:opacity-100"
                onClick={(e) => handleDeleteClick(e, page)}
                aria-label="Delete page"
              >
                <Trash2Icon className="size-3" />
              </Button>
            </div>
          </div>
        ))}
        {pages.length === 0 && (
          <div className="text-muted-foreground px-2 py-1 text-xs">No pages yet. Create one to start.</div>
        )}
      </div>

      <AlertDialog open={pageToDelete !== null} onOpenChange={(open) => !open && setPageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this page?</AlertDialogTitle>
            <AlertDialogDescription>
              You are going to delete <strong>&quot;{pageToDelete?.name}&quot;</strong> with all its frames and
              elements.
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
