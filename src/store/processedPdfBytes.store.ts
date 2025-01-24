import { atom } from "jotai";

export const processedPdfBytes = atom<Uint8Array | null>(null);
