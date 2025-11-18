import { useRef, useEffect, useMemo } from "react";
import { useCanvasStore } from "../../store/canvas-editor.store";
import { SettingsSection, SettingsInputGroup, SettingsColorRow } from "./settings-sections.boilerplate";
import { SettingsInput } from "../settings-input";
import { Separator } from "@/components/shadcn/ui/separator";
import { ColorLike } from "color";
import { handleNameInputFormat } from "../../helpers/input.helper";

export const FramePropertiesSection = () => {
  const lastValidNameRef = useRef<string>("");
  const activeFrame = useCanvasStore((state) => state.activeFrame);
  const liveFrameDimensions = useCanvasStore((state) => state.liveFrameDimensions);
  const updateFrameName = useCanvasStore((state) => state.updateFrameName);
  const updateFramePosition = useCanvasStore((state) => state.updateFramePosition);
  const updateFrameSize = useCanvasStore((state) => state.updateFrameSize);
  const updateFrameColor = useCanvasStore((state) => state.updateFrameColor);
  const updateFrameBorderColor = useCanvasStore((state) => state.updateFrameBorderColor);
  const updateFrameBorderWidth = useCanvasStore((state) => state.updateFrameBorderWidth);
  const updateFrameBorderRadius = useCanvasStore((state) => state.updateFrameBorderRadius);

  // Store the last valid name when frame changes
  useEffect(() => {
    if (activeFrame) {
      lastValidNameRef.current = activeFrame.name;
    }
  }, [activeFrame?.id]);

  const displayFrame = useMemo(
    () =>
      liveFrameDimensions && activeFrame
        ? {
            ...activeFrame,
            x: liveFrameDimensions.x,
            y: liveFrameDimensions.y,
            width: liveFrameDimensions.width,
            height: liveFrameDimensions.height,
          }
        : activeFrame,
    [liveFrameDimensions, activeFrame]
  );

  const handleNameChange = (name: string) => {
    if (activeFrame) {
      // Allow spaces during typing, but trim on blur
      updateFrameName(activeFrame.id, name);
    }
  };

  const handleNameBlur = (name: string) => {
    if (activeFrame) {
      const formattedName = handleNameInputFormat(name, lastValidNameRef.current);
      updateFrameName(activeFrame.id, formattedName);
      lastValidNameRef.current = formattedName;
    }
  };

  const handleXChange = (value: string) => {
    if (activeFrame) {
      const x = parseFloat(value) || 0;
      updateFramePosition(activeFrame.id, x, activeFrame.y);
    }
  };

  const handleYChange = (value: string) => {
    if (activeFrame) {
      const y = parseFloat(value) || 0;
      updateFramePosition(activeFrame.id, activeFrame.x, y);
    }
  };

  const handleWidthChange = (value: string) => {
    if (activeFrame) {
      const width = parseFloat(value) || 0;
      updateFrameSize(activeFrame.id, width, activeFrame.height);
    }
  };

  const handleHeightChange = (value: string) => {
    if (activeFrame) {
      const height = parseFloat(value) || 0;
      updateFrameSize(activeFrame.id, activeFrame.width, height);
    }
  };

  const handleColorChange = (color: ColorLike) => {
    if (activeFrame) {
      updateFrameColor(activeFrame.id, color);
    }
  };

  const handleBorderColorChange = (color: ColorLike) => {
    if (activeFrame) {
      updateFrameBorderColor(activeFrame.id, color);
    }
  };

  const handleBorderWidthChange = (value: string) => {
    if (activeFrame) {
      const width = parseFloat(value) || 0;
      updateFrameBorderWidth(activeFrame.id, width);
    }
  };

  const handleBorderRadiusChange = (value: string) => {
    if (activeFrame) {
      const radius = parseFloat(value) || 0;
      updateFrameBorderRadius(activeFrame.id, radius);
    }
  };

  if (!activeFrame || !displayFrame) {
    return null;
  }

  return (
    <SettingsSection title="Frame Properties">
      <div className="flex flex-col gap-3">
        <SettingsInput
          label="Frame name"
          value={displayFrame.name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          labelIn
        />
        <Separator />
        <SettingsInputGroup title="Position">
          <SettingsInput
            label="X"
            value={displayFrame.x.toFixed(0)}
            onChange={handleXChange}
            labelIn
            unit="px"
            inputProps={{ type: "number" }}
          />
          <SettingsInput
            label="Y"
            value={displayFrame.y.toFixed(0)}
            onChange={handleYChange}
            labelIn
            unit="px"
            inputProps={{ type: "number" }}
          />
        </SettingsInputGroup>
        <SettingsInputGroup title="Size">
          <SettingsInput
            label="Width"
            value={displayFrame.width.toFixed()}
            onChange={handleWidthChange}
            labelIn
            unit="px"
            inputProps={{ type: "number" }}
          />
          <SettingsInput
            label="Height"
            value={displayFrame.height.toFixed()}
            onChange={handleHeightChange}
            labelIn
            unit="px"
            inputProps={{ type: "number" }}
          />
        </SettingsInputGroup>
        <Separator />
        <SettingsColorRow label="Background color" currentColor={activeFrame.color} onChange={handleColorChange} />
        <SettingsColorRow
          label="Border color"
          currentColor={activeFrame.borderColor}
          onChange={handleBorderColorChange}
        />
        <Separator />
        <SettingsInputGroup title="Border">
          <SettingsInput
            label="Border width"
            value={activeFrame.borderWidth.toFixed(0)}
            onChange={handleBorderWidthChange}
            labelIn
            unit="px"
            inputProps={{ type: "number", min: 0 }}
          />
          <SettingsInput
            label="Border radius"
            value={activeFrame.borderRadius.toFixed(0)}
            onChange={handleBorderRadiusChange}
            labelIn
            unit="px"
            inputProps={{ type: "number", min: 0 }}
          />
        </SettingsInputGroup>
      </div>
    </SettingsSection>
  );
};
