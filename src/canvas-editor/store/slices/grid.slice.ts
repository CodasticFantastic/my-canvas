import Color, { ColorLike } from "color";
import { SliceFactory } from "../../canvas-editor.types";

export type GridSlice = {
  showGrid: boolean;
  gridSize: number;
  gridColor: ColorLike;
  gridStroke: number;
  setGridVisible: (visible: boolean) => void;
  setGridSize: (size: number) => void;
  setGridColor: (color: ColorLike) => void;
  setGridStrokeWidth: (stroke: number) => void;
};

export const createGridSlice: SliceFactory<GridSlice> = (set) => ({
  showGrid: true,
  gridSize: 50,
  gridColor: "rgba(88, 88, 88, 1)",
  gridStroke: 0.5,

  setGridVisible: (visible) => set({ showGrid: visible }),
  setGridSize: (size) => set({ gridSize: Math.max(1, size) }),
  setGridColor: (color) => set({ gridColor: Color(color).rgb().string() }),
  setGridStrokeWidth: (stroke) => set({ gridStroke: Math.max(0.1, stroke) }),
});
