import * as React from "react";
import { cn } from "@/lib/shadcn/utils";

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
