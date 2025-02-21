/// <reference lib="webworker" />
import { PDFImageData } from "@/types/PdfImageData.type";
import * as Comlink from "comlink";
import * as mupdfjs from "mupdf";
import { Document } from "mupdf";
import { PDFDocument, PDFPage, Rect } from "mupdf/mupdfjs";

export const MUPDF_LOADED = "MUPDF_LOADED";

export class MupdfWorker {
  private document?: Document;

  constructor() {
    this.initializeMupdf();
  }

  private initializeMupdf() {
    try {
      postMessage(MUPDF_LOADED);
    } catch (error) {
      console.error("Failed to initialize MuPDF:", error);
    }
  }

  loadDocument(document: ArrayBuffer) {
    this.document = mupdfjs.Document.openDocument(document, "application/pdf");

    return true;
  }

  loadPage(pageIndex: number) {
    if (!this.document) throw new Error("Document not loaded");

    this.document?.destroy();

    const page = this.document.loadPage(pageIndex);
    return page;
  }

  countPages() {
    if (!this.document) throw new Error("Document not loaded");

    return this.document.countPages();
  }

  renderPageAsImage(pageIndex = 0, scale = 1) {
    if (!this.document) throw new Error("Document not loaded");

    const page = this.document.loadPage(pageIndex);
    const pixmap = page.toPixmap(
      [scale, 0, 0, scale, 0, 0],
      mupdfjs.ColorSpace.DeviceRGB
    );

    return pixmap.asPNG() as Uint8Array;
  }

  getDocumentBytes() {
    if (!this.document) throw new Error("Document not loaded");

    return (this.document as PDFDocument)
      .saveToBuffer({
        garbage: true,
      })
      .asUint8Array() as Uint8Array;
  }

  extractImages(): PDFImageData[] {
    if (!this.document) throw new Error("Document not loaded");

    const images: PDFImageData[] = [];

    for (
      let pageIndex = 0;
      pageIndex < this.document.countPages();
      pageIndex++
    ) {
      const page = this.document.loadPage(pageIndex);

      page.toStructuredText("preserve-images").walk({
        onImageBlock: function (bbox, transform, image) {
          images.push({
            bbox,
            transform,
            image,
            pageIndex,
            url: URL.createObjectURL(
              new Blob([image.toPixmap().asPNG() as Uint8Array], {
                type: "image/png",
              })
            ),
          });
        },
      });
    }

    return images;
  }

  redactImagesInPage(bboxes: Rect[], pageIndex: number) {
    if (!this.document) throw new Error("Document not loaded");

    const page = this.document.loadPage(pageIndex) as PDFPage;

    for (const bbox of bboxes) {
      const annotation = page.createAnnotation("Redact");
      annotation.setRect([bbox[0], bbox[1], bbox[0] + 1, bbox[1] + 1]);
    }

    page.applyRedactions(0, mupdfjs.PDFPage.REDACT_IMAGE_REMOVE);
  }
}

Comlink.expose(new MupdfWorker());
