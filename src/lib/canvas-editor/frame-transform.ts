import { Frame } from "@/store/canvas-editor/canvas-editor.types";

interface CanvasDimensions {
  width: number;
  height: number;
}

interface FrameTransform {
  scale: number;
  scaledWidth: number;
  scaledHeight: number;
  frameX: number;
  frameY: number;
}

export const calculateFrameTransform = (canvasDimensions: CanvasDimensions, frame: Frame): FrameTransform => {
  // Calculate the scale of the frame to fit the canvas
  const scaleX = canvasDimensions.width / frame.width;
  const scaleY = canvasDimensions.height / frame.height;
  const scale = Math.min(scaleX, scaleY, 1); // Shrink the frame if it's too large

  // Calculate the dimensions of the frame after scaling
  const scaledWidth = frame.width * scale;
  const scaledHeight = frame.height * scale;

  // Center the frame on the canvas
  const frameX = (canvasDimensions.width - scaledWidth) / 2;
  const frameY = (canvasDimensions.height - scaledHeight) / 2;

  return {
    scale,
    scaledWidth,
    scaledHeight,
    frameX,
    frameY,
  };
};
