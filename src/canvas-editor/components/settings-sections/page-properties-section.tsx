import { useRef, useEffect } from "react";
import { useCanvasStore } from "../../store/canvas-editor.store";
import { SettingsSection, SettingsColorRow } from "./settings-sections.boilerplate";
import { SettingsInput } from "../settings-input";
import { Separator } from "@/components/shadcn/ui/separator";
import { ColorLike } from "color";
import { handleNameInputFormat } from "../../helpers/input.helper";

export const PagePropertiesSection = () => {
  const { activePage, updatePageName, updatePageBackgroundColor } = useCanvasStore();
  const lastValidNameRef = useRef<string>("");

  // Store the last valid name when page changes
  useEffect(() => {
    if (activePage) {
      lastValidNameRef.current = activePage.name;
    }
  }, [activePage?.id]);

  const handleNameChange = (name: string) => {
    if (activePage) {
      // Allow spaces during typing, but trim on blur
      updatePageName(activePage.id, name);
    }
  };

  const handleNameBlur = (name: string) => {
    if (activePage) {
      const formattedName = handleNameInputFormat(name, lastValidNameRef.current);
      updatePageName(activePage.id, formattedName);
      lastValidNameRef.current = formattedName;
    }
  };

  const handleBackgroundColorChange = (color: ColorLike) => {
    if (activePage) {
      updatePageBackgroundColor(activePage.id, color);
    }
  };

  if (!activePage) {
    return null;
  }

  return (
    <SettingsSection title="Page Properties">
      <div className="flex flex-col gap-3">
        <SettingsInput
          label="Page name"
          value={activePage.name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          labelIn
        />
        <Separator />
        <SettingsColorRow
          label="Background color"
          currentColor={activePage.backgroundColor}
          onChange={handleBackgroundColorChange}
        />
      </div>
    </SettingsSection>
  );
};
