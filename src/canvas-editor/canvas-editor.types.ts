import { StateCreator } from "zustand";
import { GridSlice } from "./store/slices/grid.slice";
import { RootSlice } from "./store/slices/root.slice";

export type CanvasPoint = { x: number; y: number };

export type EditorStore = RootSlice & GridSlice;

export type SliceFactory<T> = StateCreator<EditorStore, [], [], T>;
