import { Image, Matrix, Rect } from "mupdf/mupdfjs";

export interface PDFImageData {
  bbox: Rect;
  transform: Matrix;
  image: Image;
  pageIndex: number;
  url: string;
}
