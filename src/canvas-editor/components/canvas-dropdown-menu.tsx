"use client";

import { Button } from "@/components/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { EllipsisVerticalIcon, FilePlusIcon, DownloadIcon, UploadIcon, Trash2Icon, FolderOpenIcon } from "lucide-react";
import { useCanvasStore } from "../store/canvas-editor.store";
import { useCanvasImportExport } from "../hooks/useCanvasImportExport";

export const CanvasDropdownMenu = () => {
  const { pages, resetProject } = useCanvasStore();
  const { exportProject, importProject } = useCanvasImportExport();

  const handleNewProject = () => {
    if (pages.length > 0) {
      if (confirm("Are you sure you want to create a new project? This will delete all current pages.")) {
        resetProject();
      }
    } else {
      resetProject();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Project menu">
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="start" side="right">
        <DropdownMenuItem onClick={handleNewProject}>
          <FilePlusIcon className="mr-2 size-4" />
          <span>New Project</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNewProject}>
          <FolderOpenIcon className="mr-2 size-4" />
          <span>Open Project</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportProject}>
          <DownloadIcon className="mr-2 size-4" />
          <span>Export Project</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={importProject}>
          <UploadIcon className="mr-2 size-4" />
          <span>Import Project</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log("Delete Project")} className="text-destructive">
          <Trash2Icon className="mr-2 size-4" />
          <span>Delete Project</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
