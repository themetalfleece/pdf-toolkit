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
    (
      images: {
        bbox: Rect;
        pageIndex: number;
      }[],
      onProgress: (image: { bbox: Rect; pageIndex: number }) => void
    ) => {
      return Promise.all(
        images.map((image) =>
          mupdfWorker.current!.redactImage(image).then(() => onProgress(image))
        )
      );
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
