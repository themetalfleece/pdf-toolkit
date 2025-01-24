import { atom } from "jotai";

export const selectedPdfFileAtom = atom<File | null>(null);
