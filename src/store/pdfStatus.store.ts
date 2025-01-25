import { atom } from "jotai";

export const pdfStatusAtom = atom<{
  state: "unselected" | "selected" | "loaded" | "processing";
  progressCurrent: number;
  progressTotal: number;
}>({
  state: "unselected",
  progressCurrent: 0,
  progressTotal: 0,
});
