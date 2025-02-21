import { useMupdf } from "@/hooks/useMupdf.hook";
import { pdfImagesAtom } from "@/store/pdfImages.store";
import { pdfStatusAtom } from "@/store/pdfStatus.store";
import { selectedPdfFileAtom } from "@/store/selectedPdfFile.store";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useAtom } from "jotai";

export interface PdfDownloaderProps {
  mupdf: ReturnType<typeof useMupdf>;
}

export const PdfDownloader = ({ mupdf }: PdfDownloaderProps) => {
  const [selectedPdfFile, setSelectedPdfFile] = useAtom(selectedPdfFileAtom);
  const [pdfImages] = useAtom(pdfImagesAtom);
  const [pdfStatus, setPdfStatus] = useAtom(pdfStatusAtom);

  const downloadProcessedPdf = async () => {
    if (!selectedPdfFile || !pdfImages) {
      return;
    }

    setPdfStatus({
      state: "processing",
      progressCurrent: 1,
      progressTotal: 100,
    });

    const imagesToRemove = pdfImages.filter((image) => image.shouldRedact);

    await mupdf.redactImages(imagesToRemove, ({ pageIndex, totalPages }) =>
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
      state: "downloading",
      progressCurrent: 0,
      progressTotal: 0,
    });
  };

  if (pdfStatus.state === "loaded") {
    return (
      <Button
        variant="contained"
        size="large"
        sx={{ position: "sticky", bottom: "12px" }}
        onClick={() => {
          downloadProcessedPdf().catch(console.error);
        }}
      >
        Download PDF without selected images
      </Button>
    );
  }

  if (pdfStatus.state === "processing") {
    return (
      <>
        <Typography variant="h6">
          Processing your PDF! Please be patient on large files.
        </Typography>
        <CircularProgress
          variant="determinate"
          value={(pdfStatus.progressCurrent / pdfStatus.progressTotal) * 100}
        />
      </>
    );
  }

  if (pdfStatus.state === "downloading") {
    return <Typography variant="h6">Your PDF download has started!</Typography>;
  }

  return null;
};
