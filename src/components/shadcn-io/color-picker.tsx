"use client";
import Color from "color";
import { PipetteIcon } from "lucide-react";
import { Slider } from "radix-ui";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select";
import { cn } from "@/lib/shadcn/utils";
interface ColorPickerContextValue {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  mode: string;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setLightness: (lightness: number) => void;
  setAlpha: (alpha: number) => void;
  setMode: (mode: string) => void;
}
const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(undefined);
export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);
  if (!context) {
    throw new Error("useColorPicker must be used within a ColorPickerProvider");
  }
  return context;
};
export type ColorPickerProps = HTMLAttributes<HTMLDivElement> & {
  value?: Parameters<typeof Color>[0];
  defaultValue?: Parameters<typeof Color>[0];
  onChange?: (value: Parameters<typeof Color.rgb>[0]) => void;
};
export const ColorPicker = ({ value, defaultValue = "#000000", onChange, className, ...props }: ColorPickerProps) => {
  // initialize from controlled value if present, otherwise from defaultValue
  const initialColor = Color(value ?? defaultValue);
  const [h, s, l] = initialColor.hsl().array();
  const [hue, setHue] = useState(isNaN(h) ? 0 : h);
  const [saturation, setSaturation] = useState(isNaN(s) ? 0 : Math.max(0, Math.min(100, s)));
  const [lightness, setLightness] = useState(isNaN(l) ? 0 : Math.max(0, Math.min(100, l)));
  const [alpha, setAlpha] = useState(initialColor.alpha() * 100);
  const [mode, setMode] = useState("hex");
  const isInitialMount = useRef(true);
  const onChangeRef = useRef(onChange);
  const previousValueRef = useRef(value);
  const isInternalUpdateRef = useRef(false);
  const lastOnChangeColorRef = useRef<string | null>(null);

  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Update color when controlled value changes (only if value actually changed externally)
  useEffect(() => {
    if (value == null) return;
    // Skip if this is an internal update (to prevent loops)
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }

    // Compare colors instead of string values (handles different formats)
    const newColor = Color(value);
    const prevColor = previousValueRef.current != null ? Color(previousValueRef.current) : null;

    // Skip if colors are the same (with tolerance for floating point precision)
    if (prevColor) {
      if (
        Math.abs(newColor.red() - prevColor.red()) < 1 &&
        Math.abs(newColor.green() - prevColor.green()) < 1 &&
        Math.abs(newColor.blue() - prevColor.blue()) < 1 &&
        Math.abs(newColor.alpha() - prevColor.alpha()) < 0.01
      ) {
        return;
      }
    }

    const [h, s, l] = newColor.hsl().array();
    // Handle achromatic colors (white, black, gray) where hue might be NaN
    setHue(isNaN(h) ? 0 : h);
    setSaturation(isNaN(s) ? 0 : Math.max(0, Math.min(100, s)));
    setLightness(isNaN(l) ? 0 : Math.max(0, Math.min(100, l)));
    setAlpha(newColor.alpha() * 100);
    previousValueRef.current = value;
    // Reset last onChange color when value changes externally
    lastOnChangeColorRef.current = null;
  }, [value]);

  // Notify parent of changes
  useEffect(() => {
    if (onChangeRef.current) {
      // Skip onChange on initial mount
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      // Skip onChange if value is controlled and matches current color
      if (value != null) {
        const currentColor = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
        const valueColor = Color(value);
        // Compare colors (with small tolerance for floating point precision)
        if (
          Math.abs(currentColor.red() - valueColor.red()) < 1 &&
          Math.abs(currentColor.green() - valueColor.green()) < 1 &&
          Math.abs(currentColor.blue() - valueColor.blue()) < 1 &&
          Math.abs(currentColor.alpha() - valueColor.alpha()) < 0.01
        ) {
          return;
        }
      }
      const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
      const rgba = color.rgb().array();
      const colorString = color.rgb().string();

      // Skip if we just called onChange with the same color
      if (lastOnChangeColorRef.current === colorString) {
        return;
      }

      // Mark as internal update to prevent feedback loop
      isInternalUpdateRef.current = true;
      lastOnChangeColorRef.current = colorString;
      onChangeRef.current([rgba[0], rgba[1], rgba[2], alpha / 100]);
    }
  }, [hue, saturation, lightness, alpha, value]);
  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        alpha,
        mode,
        setHue,
        setSaturation,
        setLightness,
        setAlpha,
        setMode,
      }}
    >
      <div className={cn("flex size-full flex-col gap-4", className)} {...props} />
    </ColorPickerContext.Provider>
  );
};
export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;
export const ColorPickerSelection = memo(({ className, ...props }: ColorPickerSelectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const { hue, saturation, lightness, setSaturation, setLightness } = useColorPicker();

  // Calculate pin position from saturation/lightness
  const position = useMemo(() => {
    // Use drag position if dragging, otherwise calculate from saturation/lightness
    if (isDragging && dragPosition) {
      return dragPosition;
    }
    const sat = Math.max(0, Math.min(100, saturation));
    const light = Math.max(0, Math.min(100, lightness));
    const x = sat / 100;
    const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x);
    const y = 1 - light / topLightness;
    return {
      x,
      y: Math.max(0, Math.min(1, y)),
    };
  }, [saturation, lightness, isDragging, dragPosition]);

  const backgroundGradient = useMemo(() => {
    return `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${hue}, 100%, 50%)`;
  }, [hue]);
  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!(isDragging && containerRef.current)) {
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      setDragPosition({ x, y });
      setSaturation(x * 100);
      const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x);
      const lightness = topLightness * (1 - y);
      setLightness(lightness);
    },
    [isDragging, setSaturation, setLightness]
  );
  useEffect(() => {
    const handlePointerUp = () => {
      setIsDragging(false);
      setDragPosition(null);
    };
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, handlePointerMove]);
  return (
    <div
      className={cn("relative size-full cursor-crosshair rounded", className)}
      onPointerDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
        handlePointerMove(e.nativeEvent);
      }}
      ref={containerRef}
      style={{
        background: backgroundGradient,
      }}
      {...props}
    >
      <div
        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
        style={{
          left: `${position.x * 100}%`,
          top: `${position.y * 100}%`,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
});
ColorPickerSelection.displayName = "ColorPickerSelection";
export type ColorPickerHueProps = ComponentProps<typeof Slider.Root>;
export const ColorPickerHue = ({ className, ...props }: ColorPickerHueProps) => {
  const { hue, setHue } = useColorPicker();
  return (
    <Slider.Root
      className={cn("relative flex h-4 w-full touch-none", className)}
      max={360}
      onValueChange={([hue]) => setHue(hue)}
      step={1}
      value={[hue]}
      {...props}
    >
      <Slider.Track className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
        <Slider.Range className="absolute h-full" />
      </Slider.Track>
      <Slider.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
};
export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>;
export const ColorPickerAlpha = ({ className, ...props }: ColorPickerAlphaProps) => {
  const { alpha, setAlpha } = useColorPicker();
  return (
    <Slider.Root
      className={cn("relative flex h-4 w-full touch-none", className)}
      max={100}
      onValueChange={([alpha]) => setAlpha(alpha)}
      step={1}
      value={[alpha]}
      {...props}
    >
      <Slider.Track
        className="relative my-0.5 h-3 w-full grow rounded-full"
        style={{
          background:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-black/50" />
        <Slider.Range className="absolute h-full rounded-full bg-transparent" />
      </Slider.Track>
      <Slider.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
};
export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>;
export const ColorPickerEyeDropper = ({ className, ...props }: ColorPickerEyeDropperProps) => {
  const { setHue, setSaturation, setLightness, setAlpha } = useColorPicker();
  const handleEyeDropper = async () => {
    try {
      // @ts-expect-error - EyeDropper API is experimental
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      const color = Color(result.sRGBHex);
      const [h, s, l] = color.hsl().array();
      setHue(h);
      setSaturation(s);
      setLightness(l);
      setAlpha(100);
    } catch (error) {
      console.error("EyeDropper failed:", error);
    }
  };
  return (
    <Button
      className={cn("text-muted-foreground shrink-0", className)}
      onClick={handleEyeDropper}
      size="icon"
      variant="outline"
      type="button"
      {...props}
    >
      <PipetteIcon size={16} />
    </Button>
  );
};
export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>;
const formats = ["hex", "rgb", "css", "hsl"];
export const ColorPickerOutput = ({ className, ...props }: ColorPickerOutputProps) => {
  const { mode, setMode } = useColorPicker();
  return (
    <Select onValueChange={setMode} value={mode}>
      <SelectTrigger className="h-8 w-20 shrink-0 text-xs" {...props}>
        <SelectValue placeholder="Mode" />
      </SelectTrigger>
      <SelectContent>
        {formats.map((format) => (
          <SelectItem className="text-xs" key={format} value={format}>
            {format.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
type PercentageInputProps = ComponentProps<typeof Input>;
const PercentageInput = ({ className, ...props }: PercentageInputProps) => {
  return (
    <div className="relative">
      <Input
        readOnly
        type="text"
        {...props}
        className={cn("bg-background h-8 w-[3.25rem] rounded-l-none px-2 text-xs shadow-none", className)}
      />
      <span className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 text-xs">%</span>
    </div>
  );
};
export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;
export const ColorPickerFormat = ({ className, ...props }: ColorPickerFormatProps) => {
  const { hue, saturation, lightness, alpha, mode } = useColorPicker();
  const color = Color.hsl(hue, saturation, lightness, alpha / 100);
  if (mode === "hex") {
    const hex = color.hex();
    return (
      <div className={cn("relative flex w-full items-center -space-x-px rounded-md shadow-sm", className)} {...props}>
        <Input className="bg-background h-8 rounded-r-none px-2 text-xs shadow-none" readOnly type="text" value={hex} />
        <PercentageInput value={alpha} />
      </div>
    );
  }
  if (mode === "rgb") {
    const rgb = color
      .rgb()
      .array()
      .map((value) => Math.round(value));
    return (
      <div className={cn("flex items-center -space-x-px rounded-md shadow-sm", className)} {...props}>
        {rgb.map((value, index) => (
          <Input
            className={cn(
              "bg-backgroundry h-8 rounded-r-none px-2 text-xs shadow-none",
              index && "rounded-l-none",
              className
            )}
            key={index}
            readOnly
            type="text"
            value={value}
          />
        ))}
        <PercentageInput value={alpha} />
      </div>
    );
  }
  if (mode === "css") {
    const rgb = color
      .rgb()
      .array()
      .map((value) => Math.round(value));
    return (
      <div className={cn("w-full rounded-md shadow-sm", className)} {...props}>
        <Input
          className="bg-backgroundry h-8 w-full px-2 text-xs shadow-none"
          readOnly
          type="text"
          value={`rgba(${rgb.join(", ")}, ${alpha}%)`}
          {...props}
        />
      </div>
    );
  }
  if (mode === "hsl") {
    const hsl = color
      .hsl()
      .array()
      .map((value) => Math.round(value));
    return (
      <div className={cn("flex items-center -space-x-px rounded-md shadow-sm", className)} {...props}>
        {hsl.map((value, index) => (
          <Input
            className={cn(
              "bg-backgroundry h-8 rounded-r-none px-2 text-xs shadow-none",
              index && "rounded-l-none",
              className
            )}
            key={index}
            readOnly
            type="text"
            value={value}
          />
        ))}
        <PercentageInput value={alpha} />
      </div>
    );
  }
  return null;
};
