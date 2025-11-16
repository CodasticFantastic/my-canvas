import { StateCreator } from "zustand";
import { GridSlice } from "./store/slices/grid.slice";
import { RootSlice } from "./store/slices/root.slice";
import { DocumentSlice } from "./store/slices/document.slice";

export type CanvasPoint = { x: number; y: number };

export type EditorStore = RootSlice & GridSlice & DocumentSlice;

export type SliceFactory<T> = StateCreator<EditorStore, [], [], T>;
