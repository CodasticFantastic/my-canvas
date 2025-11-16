import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerSelection,
} from "@/components/shadcn-io/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/ui/popover";
import { cn } from "@/lib/shadcn/utils";
import Color, { ColorLike } from "color";

interface ColorSwitcherProps {
  currentColor: ColorLike;
  onChange: (color: ColorLike) => void;
  size?: "xs" | "sm" | "md" | "lg";
}

export const ColorSwitcher: React.FC<ColorSwitcherProps> = ({ currentColor, onChange, size = "xs" }) => {
  const sizeClass = {
    xs: "size-4",
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="border-border flex cursor-pointer items-center gap-2 rounded-md border p-1">
          <div
            className={cn(sizeClass[size], "rounded")}
            style={{ backgroundColor: Color(currentColor).rgb().string() }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="mt-3 w-72">
        <ColorPicker defaultValue={Color(currentColor).rgb().string()} onChange={onChange}>
          <ColorPickerSelection className="h-64 w-full" />
          <div className="flex items-center gap-4">
            <ColorPickerEyeDropper />
            <div className="grid w-full gap-1">
              <ColorPickerHue />
              <ColorPickerAlpha />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerFormat />
          </div>
        </ColorPicker>
      </PopoverContent>
    </Popover>
  );
};
