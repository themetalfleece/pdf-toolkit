import { MUPDF_LOADED, type MupdfWorker } from "@/workers/mupdf.worker";
import * as Comlink from "comlink";
import { Remote } from "comlink";
import { Rect } from "mupdf/mupdfjs";
import { useCallback, useEffect, useRef, useState } from "react";

export function useMupdf() {
  const [isWorkerInitialized, setIsWorkerInitialized] = useState(false);
  const document = useRef<ArrayBuffer | null>(null);
  const mupdfWorker = useRef<Remote<MupdfWorker>>();

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/mupdf.worker", import.meta.url),
      {
        type: "module",
      }
    );
    mupdfWorker.current = Comlink.wrap<MupdfWorker>(worker);

    worker.addEventListener("message", (event) => {
      if (event.data === MUPDF_LOADED) {
        setIsWorkerInitialized(true);
      }
    });

    return () => {
      worker.terminate();
    };
  }, []);

  const loadDocument = useCallback((arrayBuffer: ArrayBuffer) => {
    document.current = arrayBuffer;
    return mupdfWorker.current!.loadDocument(arrayBuffer);
  }, []);

  const getDocumentBytes = useCallback(() => {
    return mupdfWorker.current!.getDocumentBytes();
  }, []);

  const extractImages = useCallback(() => {
    return mupdfWorker.current!.extractImages();
  }, []);

  const redactImages = useCallback(
    async (
      images: {
        bbox: Rect;
        pageIndex: number;
      }[],
      onPageProgress: (p: { pageIndex: number; totalPages: number }) => void
    ) => {
      const imagesBboxByPage = images.reduce((acc, image) => {
        if (!acc[image.pageIndex]) {
          acc[image.pageIndex] = [];
        }
        acc[image.pageIndex].push(image.bbox);
        return acc;
      }, {} as Record<number, Rect[]>);

      for (const [pageIndex, bboxes] of Object.entries(imagesBboxByPage)) {
        try {
          await mupdfWorker.current!.redactImagesInPage(bboxes, +pageIndex);
        } catch (error) {
          console.error("Failed to redact image of page:", error);
        } finally {
          onPageProgress({
            pageIndex: +pageIndex,
            totalPages: Object.keys(imagesBboxByPage).length,
          });
        }
      }
    },
    []
  );

  return {
    isWorkerInitialized,
    loadDocument,
    getDocumentBytes,
    extractImages,
    redactImages,
  };
}
