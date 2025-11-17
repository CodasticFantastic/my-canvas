import * as React from "react";
import { cn } from "@/lib/shadcn/utils";
import { ColorSwitcher } from "../color-switcher";
import { ColorLike } from "color";

type SettingsSectionProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  sectionClassName?: React.CSSProperties;
  bodyClassName?: React.CSSProperties;
};

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  action,
  children,
  sectionClassName,
  bodyClassName,
}) => {
  return (
    <section className={cn("flex flex-col gap-2", sectionClassName)}>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">{title}</span>
        <div>{action}</div>
      </div>

      <div className={cn(bodyClassName)}>{children}</div>
    </section>
  );
};

type SettingsInputGroupProps = {
  title: string;
  children: React.ReactNode;
};

export const SettingsInputGroup: React.FC<SettingsInputGroupProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground text-[11px] font-medium tracking-tight">{title}</div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
};

type SettingsColorRowProps = {
  label: string;
  currentColor: ColorLike;
  onChange: (color: ColorLike) => void;
  size?: "xs" | "sm" | "md" | "lg";
};

export const SettingsColorRow: React.FC<SettingsColorRowProps> = ({ label, currentColor, onChange, size = "xs" }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-muted-foreground text-[11px] font-medium tracking-tight">{label}</div>
      <ColorSwitcher currentColor={currentColor} onChange={onChange} size={size} />
    </div>
  );
};

type SettingsSubsectionProps = {
  title: string;
  children: React.ReactNode;
};

export const SettingsSubsection: React.FC<SettingsSubsectionProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground text-[11px] font-medium tracking-tight">{title}</div>
      {children}
    </div>
  );
};
