"use client";

import { Square, Circle, Triangle, Minus, Type } from "lucide-react";
import { Button } from "@/components/shadcn/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/ui/popover";
import { useCanvasStore } from "../store/canvas-editor.store";
import { CanvasElementType } from "../canvas-editor.types";

export const CanvasToolbar = () => {
  const activeFrame = useCanvasStore((state) => state.activeFrame);
  const addElementToFrame = useCanvasStore((state) => state.addElementToFrame);

  const handleAddElement = (type: CanvasElementType) => {
    if (!activeFrame) {
      return;
    }
    addElementToFrame(activeFrame.id, type);
  };

  if (!activeFrame) {
    return (
      <div className="bg-background flex items-center gap-2 rounded-lg border p-2 shadow">
        <p className="text-foreground text-sm">Select a frame to add an element</p>
      </div>
    );
  }

  return (
    <div className="bg-background flex items-center gap-2 rounded-lg border p-2 shadow">
      {/* Shapes Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Square />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="center" side="top">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-2"
              onClick={() => handleAddElement("square")}
            >
              <Square className="h-4 w-4" />
              Square
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-2"
              onClick={() => handleAddElement("circle")}
            >
              <Circle className="h-4 w-4" />
              Circle
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-2"
              onClick={() => handleAddElement("triangle")}
            >
              <Triangle className="h-4 w-4" />
              Triangle
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Lines Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Minus className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="center" side="top">
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={() => handleAddElement("line")}>
              <Minus className="h-4 w-4" />
              Line
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Text Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Type className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="center" side="top">
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={() => handleAddElement("text")}>
              <Type className="h-4 w-4" />
              Text
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
