import { useCanvasStore } from "../../store/canvas-editor.store";
import { SettingsSection, SettingsColorRow } from "./settings-sections.boillerplate";
import { SettingsInput } from "../settings-input";
import { Separator } from "@/components/shadcn/ui/separator";
import { ColorLike } from "color";

export const PagePropertiesSection = () => {
  const { activePage, updatePageName, updatePageBackgroundColor } = useCanvasStore();

  const handleNameChange = (name: string) => {
    if (activePage) {
      updatePageName(activePage.id, name);
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
        <SettingsInput label="Page name" value={activePage.name} onChange={handleNameChange} labelIn />
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
