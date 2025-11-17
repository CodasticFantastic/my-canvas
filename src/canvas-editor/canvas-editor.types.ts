import { StateCreator } from "zustand";
import { ColorLike } from "color";
import { GridSlice } from "./store/slices/grid.slice";
import { RootSlice } from "./store/slices/root.slice";
import { PageSlice } from "./store/slices/page.slice";
import { FrameSlice } from "./store/slices/frame.slice";
import { ElementSlice } from "./store/slices/element.slice";

export type EditorStore = RootSlice & GridSlice & PageSlice & FrameSlice & ElementSlice;

export type SliceFactory<T> = StateCreator<EditorStore, [], [], T>;

export type Page = {
  id: string;
  name: string;
  backgroundColor: ColorLike;
  frames: Frame[];
};

export type Frame = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: ColorLike;
  borderColor: ColorLike;
  borderWidth: number;
  borderRadius: number;
  elements: CanvasElement[];
};

export type CanvasElement = {
  id: string;
  type: CanvasElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

export type CanvasElementType = "rect";

export type CanvasPoint = { x: number; y: number };
