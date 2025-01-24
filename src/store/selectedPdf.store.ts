import { atom } from "jotai";

export const selectedPdfAtom = atom<File | null>(null);
