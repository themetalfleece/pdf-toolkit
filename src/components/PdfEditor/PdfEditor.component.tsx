import { useMupdf } from "@/hooks/useMupdf.hook";
import { processedPdfBytes } from "@/store/processedPdfBytes.store";
import { selectedPdfFileAtom } from "@/store/selectedPdfFile.store";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const PdfEditor = () => {
  const [selectedPdfFile] = useAtom(selectedPdfFileAtom);
  const [, setProcessedPdfBytes] = useAtom(processedPdfBytes);
  const { loadDocument, getDocumentBytes } = useMupdf();

  useEffect(() => {
    if (!selectedPdfFile) {
      return;
    }

    const loadAndProcess = async () => {
      await loadDocument(await selectedPdfFile.arrayBuffer());
      const processedBytes = await getDocumentBytes();

      if (processedBytes) {
        setProcessedPdfBytes(processedBytes);
        console.log("Processed PDF bytes:", processedBytes);
      }
    };

    loadAndProcess().catch((error) => {
      console.error(error);
      alert("Failed to process the PDF file.");
    });
  }, [selectedPdfFile, loadDocument, getDocumentBytes, setProcessedPdfBytes]);

  if (!selectedPdfFile) {
    return null;
  }

  return null;
};
