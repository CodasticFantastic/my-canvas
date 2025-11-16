import { Button } from "@/components/shadcn/ui/button";
import { useCanvasZoom } from "../hooks/useCanvasZoom";
import Konva from "konva";
import { useCanvasStore } from "../store/canvas-editor.store";

export const ZoomControls = ({ stageRef }: { stageRef: React.RefObject<Konva.Stage | null> }) => {
  const { onButtonZoom } = useCanvasZoom(stageRef);
  const { zoom } = useCanvasStore();

  return (
    <div className="bg-background/90 pointer-events-auto flex items-center gap-2 rounded-md px-2 py-1 shadow">
      <Button variant="ghost" size="xs" onClick={() => onButtonZoom("-")}>
        -
      </Button>
      <span className="text-xs select-none">{Math.round(zoom * 100)}%</span>
      <Button variant="ghost" size="xs" onClick={() => onButtonZoom("+")}>
        +
      </Button>
    </div>
  );
};
