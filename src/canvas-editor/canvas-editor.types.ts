import { StateCreator } from "zustand";
import { ColorLike } from "color";
import { GridSlice } from "./store/slices/grid.slice";
import { RootSlice } from "./store/slices/root.slice";
import { PageSlice } from "./store/slices/page.slice";
import { FrameSlice } from "./store/slices/frame.slice";
import { ElementSlice } from "./store/slices/element.slice";
import Konva from "konva";

export type StageRef = React.RefObject<Konva.Stage | null>;

export type EditorStore = RootSlice & GridSlice & PageSlice & FrameSlice & ElementSlice;

export type SliceFactory<T> = StateCreator<
  EditorStore,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]],
  [],
  T
>;

export type Page = {
  id: string;
  name: string;
  backgroundColor: ColorLike;
  frames: Frame[];
};

export type Frame = {
  id: string;
  name: string;
  isInMove: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  color: ColorLike;
  borderColor: ColorLike;
  borderWidth: number;
  borderRadius: number;
  elements: CanvasElement[];
  locked: boolean;
};

export type CanvasElement = CanvasShapeElement | CanvasTextElement | CanvasLineElement;
export type CanvasElementType = "rect" | "square" | "circle" | "triangle" | "line" | "text";

type CanvasShapeElement = {
  id: string;
  type: Extract<CanvasElementType, "rect" | "square" | "circle" | "triangle">;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

type CanvasTextElement = {
  id: string;
  type: Extract<CanvasElementType, "text">;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  text: string;
  fontSize: number;
  fontFamily: string;
};

type CanvasLineElement = {
  id: string;
  type: Extract<CanvasElementType, "line">;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  points: number[];
};

export type CanvasPoint = { x: number; y: number };
export type SideIndicator = "right" | "bottom" | "left" | "top";
