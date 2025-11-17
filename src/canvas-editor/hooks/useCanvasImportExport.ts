import { useCallback } from "react";
import { useCanvasStore } from "../store/canvas-editor.store";
import { toast } from "sonner";

export function useCanvasImportExport() {
  const { pages } = useCanvasStore();

  const exportProject = useCallback(() => {
    try {
      const projectData = {
        pages,
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
      };
      const json = JSON.stringify(projectData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `canvas-project-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Project exported successfully");
    } catch (error) {
      toast.error("Failed to export project");
      console.error(error);
    }
  }, [pages]);

  const importProject = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = event.target?.result as string;
          const projectData = JSON.parse(json);

          if (!projectData.pages || !Array.isArray(projectData.pages)) {
            toast.error("Invalid project file");
            return;
          }

          // Import pages
          useCanvasStore.setState({
            pages: projectData.pages,
            activePage: projectData.pages[0] ?? null,
            activeFrame: projectData.pages[0]?.frames[0] ?? null,
          });

          toast.success(`Project imported: ${projectData.pages.length} page(s)`);
        } catch (error) {
          toast.error("Failed to import project");
          console.error(error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  return {
    exportProject,
    importProject,
  };
}
