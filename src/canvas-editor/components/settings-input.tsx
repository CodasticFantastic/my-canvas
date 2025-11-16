import { useId } from "react";
import { Label } from "@/components/shadcn/ui/label";
import { Input } from "@/components/shadcn/ui/input";

interface SettingsInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  labelIn?: boolean;
}

export const SettingsInput: React.FC<SettingsInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  labelIn = false,
}) => {
  const inputId = useId();

  if (labelIn) {
    return (
      <div className="flex flex-col gap-1 text-xs">
        <div className="border-border/60 bg-background/70 focus-within:border-ring focus-within:ring-ring flex h-8 items-center rounded-md border px-2 text-xs shadow-sm focus-within:ring-1">
          <span className="text-muted-foreground mr-2 shrink-0 text-[11px] font-medium tracking-tight">{label}</span>
          <Input
            id={inputId}
            size="sm"
            value={value}
            aria-label={label}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="h-7 border-none bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 text-xs">
      <div className="flex items-center justify-between">
        <Label htmlFor={inputId} className="text-muted-foreground text-[11px] font-medium tracking-tight">
          {label}
        </Label>
      </div>
      <Input
        id={inputId}
        size="sm"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border-border/60 bg-background/70 focus-visible:ring-ring h-8 rounded-md text-xs shadow-sm focus-visible:ring-1"
      />
    </div>
  );
};
