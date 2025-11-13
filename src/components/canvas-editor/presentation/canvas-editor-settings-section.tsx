import { Card, CardContent, CardHeader } from "@/components/shadcn/ui/card";
import { Separator } from "@/components/shadcn/ui/separator";
import { cn } from "@/lib/shadcn/utils";

interface CanvasEditorSettingsSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export const CanvasEditorSettingsSection: React.FC<CanvasEditorSettingsSectionProps> = ({
  title,
  className,
  children,
  ...props
}) => {
  return (
    <Card className={cn("gap-0 border py-3 shadow-sm", className)} {...props}>
      <CardHeader className="mb-0 px-3 font-semibold">{title}</CardHeader>
      <Separator className="mb-3" />
      <CardContent className="px-3">{children}</CardContent>
    </Card>
  );
};
