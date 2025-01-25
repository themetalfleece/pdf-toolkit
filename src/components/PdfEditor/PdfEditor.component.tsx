import { useMupdf } from "@/hooks/useMupdf.hook";
import { selectedPdfFileAtom } from "@/store/selectedPdfFile.store";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { pdfStatusAtom } from "../../store/pdfStatus.store";

export interface PdfEditorProps {
  mupdf: ReturnType<typeof useMupdf>;
}

export const PdfEditor = ({ mupdf }: PdfEditorProps) => {
  const [selectedPdfFile] = useAtom(selectedPdfFileAtom);
  const [, setPdfStatus] = useAtom(pdfStatusAtom);

  useEffect(() => {
    if (!selectedPdfFile) {
      return;
    }

    const loadAndProcess = async () => {
      await mupdf.loadDocument(await selectedPdfFile.arrayBuffer());

      setPdfStatus({
        state: "loaded",
        progressCurrent: 0,
        progressTotal: 0,
      });
    };

    loadAndProcess().catch((error) => {
      console.error(error);
      alert("Failed to process the PDF file.");
    });
  }, [selectedPdfFile, mupdf, setPdfStatus]);

  if (!selectedPdfFile) {
    return null;
  }

  return null;
};
