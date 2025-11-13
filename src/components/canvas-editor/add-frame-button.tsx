import { useEditorStore } from "@/store/canvas-editor/canvas-editor.store";
import { Button } from "../shadcn/ui/button";
import { PlusIcon } from "lucide-react";

export type AddFrameButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

export const AddFrameButton: React.FC<AddFrameButtonProps> = ({ ...props }) => {
  const { addFrame } = useEditorStore();

  const handleAddFrame = () => {
    addFrame({
      name: `Frame ${frames.length + 1}`,
      width: 1920,
      height: 1080,
      elements: [],
    });
  };

  return (
    <Button onClick={handleAddFrame} {...props}>
      <PlusIcon />
      Add Frame
    </Button>
  );
};
