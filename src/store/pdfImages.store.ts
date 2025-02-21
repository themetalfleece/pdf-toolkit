import { PDFImageData } from "@/types/PdfImageData.type";
import { atom } from "jotai";

export const pdfImagesAtom = atom<
  | (PDFImageData & {
      shouldRedact: boolean;
    })[]
  | null
>(null);
