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
import { Separator } from "@/components/shadcn/ui/separator";

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
          <DialogDescription>Learn the details of using the canvas</DialogDescription>
          <div className="flex flex-col gap-1">
            <KbdGroup>
              <Kbd>MMB</Kbd> <span className="text-xs">- Middle Mouse Button</span>
            </KbdGroup>
            <KbdGroup>
              <Kbd>LMB</Kbd> <span className="text-xs">- Left Mouse Button</span>
            </KbdGroup>
          </div>
        </DialogHeader>
        <Separator />
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">Canvas Panning (Move your Canvas)</p>
            <ul className="text-muted-foreground mt-1 list-disc space-y-1 pl-5">
              <li>
                <span className="font-medium">In order to pan the canvas:</span>
                <ul className="text-muted-foreground mt-1 list-disc space-y-1 pl-5">
                  <li>
                    <KbdGroup>
                      <Kbd>MMB</Kbd>
                    </KbdGroup>
                  </li>
                  <li>
                    <KbdGroup>
                      <Kbd>Space</Kbd> + <Kbd>LMB</Kbd>
                    </KbdGroup>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Move elements on the canvas</p>
            <ul className="text-muted-foreground mt-1 list-disc space-y-1 pl-5">
              <li>
                <span className="font-medium">In order to move an element:</span>
                <ul className="text-muted-foreground mt-1 list-disc space-y-1 pl-5">
                  <li>
                    <KbdGroup>
                      Press and hold<Kbd>LMB</Kbd> over the element.
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
