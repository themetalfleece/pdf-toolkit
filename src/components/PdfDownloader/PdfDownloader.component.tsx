import { useMupdf } from "@/hooks/useMupdf.hook";
import { pdfStatusAtom } from "@/store/pdfStatus.store";
import { selectedPdfFileAtom } from "@/store/selectedPdfFile.store";
import { Button, CircularProgress } from "@mui/material";
import { useAtom } from "jotai";

export interface PdfDownloaderProps {
  mupdf: ReturnType<typeof useMupdf>;
}

export const PdfDownloader = ({ mupdf }: PdfDownloaderProps) => {
  const [selectedPdfFile, setSelectedPdfFile] = useAtom(selectedPdfFileAtom);
  const [pdfStatus, setPdfStatus] = useAtom(pdfStatusAtom);

  if (!selectedPdfFile) {
    return null;
  }

  const downloadProcessedPdf = async () => {
    setPdfStatus({
      state: "processing",
      progressCurrent: 1,
      progressTotal: 100,
    });

    const allImages = await mupdf.extractImages();

    await mupdf.redactImages(allImages, ({ pageIndex, totalPages }) =>
      setPdfStatus({
        state: "processing",
        progressCurrent: pageIndex + 1,
        progressTotal: totalPages,
      })
    );

    const processedBytes = await mupdf.getDocumentBytes();
    const blob = new Blob([processedBytes], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedPdfFile.name;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();

    setSelectedPdfFile(null);

    setPdfStatus({
      state: "unselected",
      progressCurrent: 0,
      progressTotal: 0,
    });
  };

  if (pdfStatus.state === "loaded") {
    return (
      <Button
        variant="contained"
        onClick={() => {
          downloadProcessedPdf().catch(console.error);
        }}
      >
        Download processed PDF
      </Button>
    );
  }

  if (pdfStatus.state === "selected") {
    return <CircularProgress />;
  }

  if (pdfStatus.state === "processing") {
    return (
      <>
        Processing your PDF! Please be patient on large files.
        <CircularProgress
          variant="determinate"
          value={(pdfStatus.progressCurrent / pdfStatus.progressTotal) * 100}
        />
      </>
    );
  }

  return null;
};
