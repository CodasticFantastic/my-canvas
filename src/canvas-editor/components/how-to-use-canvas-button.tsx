import { Button } from "@/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { Kbd, KbdGroup } from "@/components/shadcn/ui/kbd";

export const HowToUseCanvasButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-xs" variant="ghost" className="bg-background/90 border-border rounded-full border shadow">
          ?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to use MyCanvas</DialogTitle>
          <DialogDescription>Learn the details of using MyCanvas</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">Canvas Panning (Move your Canvas)</p>
            <ul className="text-muted-foreground mt-1 list-disc space-y-1 pl-5">
              <li>
                <span className="font-medium">In order to pan the canvas:</span>
                <ul className="text-muted-foreground mt-1 list-disc space-y-1 pl-5">
                  <li>
                    <KbdGroup>
                      <Kbd>MMB</Kbd> - Middle Mouse Button
                    </KbdGroup>
                  </li>
                  <li>
                    <KbdGroup>
                      <Kbd>Space + LMB</Kbd> Space + Left Mouse Button
                    </KbdGroup>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
