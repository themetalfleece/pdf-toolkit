/// <reference lib="webworker" />
import * as Comlink from "comlink";
import * as mupdfjs from "mupdf/mupdfjs";
import { PDFDocument } from "mupdf/mupdfjs";

export const MUPDF_LOADED = "MUPDF_LOADED";

export class MupdfWorker {
  private document?: PDFDocument;

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
    this.document = mupdfjs.PDFDocument.openDocument(
      document,
      "application/pdf"
    );

    return true;
  }

  loadPage(pageIndex: number) {
    if (!this.document) throw new Error("Document not loaded");

    const page = this.document.loadPage(pageIndex);
    return page;
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

    return this.document
      .saveToBuffer({
        garbage: true,
      })
      .asUint8Array() as Uint8Array;
  }

  extractImages() {
    if (!this.document) throw new Error("Document not loaded");

    const images: {
      bbox: mupdfjs.Rect;
      transform: mupdfjs.Matrix;
      image: mupdfjs.Image;
      pageIndex: number;
    }[] = [];

    for (let i = 0; i < this.document.countPages(); i++) {
      const page = this.document.loadPage(i);

      page.toStructuredText("preserve-images").walk({
        onImageBlock: function (bbox, transform, image) {
          images.push({
            bbox,
            transform,
            image,
            pageIndex: i,
          });
        },
      });
    }

    return images;
  }

  redactImagesInPage(bboxes: mupdfjs.Rect[], pageIndex: number) {
    if (!this.document) throw new Error("Document not loaded");

    const page = this.document.loadPage(pageIndex);

    for (const bbox of bboxes) {
      const annotation = page.createAnnotation("Redact");
      annotation.setRect([bbox[0], bbox[1], bbox[0] + 1, bbox[1] + 1]);
    }

    page.applyRedactions(0, mupdfjs.PDFPage.REDACT_IMAGE_REMOVE);
  }
}

Comlink.expose(new MupdfWorker());
