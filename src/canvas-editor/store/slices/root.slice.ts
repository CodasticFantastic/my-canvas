import { CanvasPoint, SliceFactory } from "@/canvas-editor/canvas-editor.types";

export type RootSlice = {
  width: number;
  height: number;
  panOffsetX: number;
  panOffsetY: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  setCanvasSize: (w: number, h: number) => void;
  setPan: (x: number, y: number) => void;
  setZoom: (nextZoom: number, anchor?: CanvasPoint) => void;
  resetView: () => void;
  toWorld: (p: CanvasPoint) => CanvasPoint;
  toScreen: (p: CanvasPoint) => CanvasPoint;
};

export const createRootSlice: SliceFactory<RootSlice> = (set, get) => ({
  width: 0,
  height: 0,
  panOffsetX: 0,
  panOffsetY: 0,
  zoom: 1,
  minZoom: 0.1,
  maxZoom: 4,

  setCanvasSize: (w, h) => set({ width: w, height: h }),
  setPan: (x, y) => set({ panOffsetX: x, panOffsetY: y }),

  setZoom: (nextZoom, anchor) => {
    const { zoom, panOffsetX: x, panOffsetY: y, minZoom, maxZoom } = get();
    const clamped = Math.min(maxZoom, Math.max(minZoom, nextZoom));
    if (!anchor) {
      set({ zoom: clamped });
      return;
    }

    const worldX = (anchor.x - x) / zoom;
    const worldY = (anchor.y - y) / zoom;
    const nx = anchor.x - worldX * clamped;
    const ny = anchor.y - worldY * clamped;
    set({ zoom: clamped, panOffsetX: nx, panOffsetY: ny });
  },

  resetView: () => set({ panOffsetX: 0, panOffsetY: 0, zoom: 1 }),

  toWorld: (p) => {
    const { panOffsetX: x, panOffsetY: y, zoom } = get();
    return { x: (p.x - x) / zoom, y: (p.y - y) / zoom };
  },

  toScreen: (p) => {
    const { panOffsetX: x, panOffsetY: y, zoom } = get();
    return { x: p.x * zoom + x, y: p.y * zoom + y };
  },
});
