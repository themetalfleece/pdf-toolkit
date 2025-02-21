import { atom } from "jotai";

export const pdfStatusAtom = atom<{
  state: "unselected" | "selected" | "loaded" | "processing" | "downloading";
  progressCurrent?: number;
  progressTotal?: number;
}>({
  state: "unselected",
});
