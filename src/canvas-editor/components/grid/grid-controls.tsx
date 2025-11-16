"use client";

import { Button } from "@/components/shadcn/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/ui/popover";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { useCanvasStore } from "../../store/canvas-editor.store";
import { useState } from "react";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { Separator } from "@/components/shadcn/ui/separator";
import { GridIcon } from "lucide-react";
import { ColorSwitcher } from "../color-switcher";

export const GridControls = () => {
  const {
    showGrid,
    gridSize,
    gridColor,
    gridStroke,
    setGridVisible,
    setGridSize,
    setGridColor,
    setGridStrokeWidth: setGridStroke,
  } = useCanvasStore();

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="xs" variant="ghost" className="bg-background border-border pointer-events-auto border shadow">
          <GridIcon className="mr-1" />
          {showGrid ? "Grid: On" : "Grid: Off"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="flex items-center justify-between">
          <Label htmlFor="grid-visible">Show grid</Label>
          <Checkbox
            id="grid-visible"
            className="h-4 w-4"
            checked={showGrid}
            onCheckedChange={(value) => setGridVisible(value === "indeterminate" ? false : value)}
          />
        </div>
        <Separator className="my-3" />

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="grid-size">
              Grid size <div className="text-muted-foreground text-xs">px</div>
            </Label>
            <Input
              id="grid-size"
              type="number"
              min={1}
              step={1}
              value={gridSize}
              size="xs"
              className="w-16"
              onChange={(e) => setGridSize(Number(e.target.value || 1))}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="grid-stroke">
              Stroke width <div className="text-muted-foreground text-xs">px</div>
            </Label>
            <Input
              id="grid-stroke"
              type="number"
              min={0.1}
              step={0.1}
              value={gridStroke}
              size="xs"
              className="w-16"
              onChange={(e) => setGridStroke(Number(e.target.value || 0.1))}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="grid-color">Grid color</Label>
            <ColorSwitcher
              currentColor={gridColor}
              onChange={(color) => {
                setGridColor(color);
                console.log(color);
                console.log(gridColor);
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
