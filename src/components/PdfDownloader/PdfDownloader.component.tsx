import { useMupdf } from "@/hooks/useMupdf.hook";
import { pdfImagesAtom } from "@/store/pdfImages.store";
import { pdfStatusAtom } from "@/store/pdfStatus.store";
import { selectedPdfFileAtom } from "@/store/selectedPdfFile.store";
import { Button, CircularProgress } from "@mui/material";
import { useAtom } from "jotai";

export interface PdfDownloaderProps {
  mupdf: ReturnType<typeof useMupdf>;
}

export const PdfDownloader = ({ mupdf }: PdfDownloaderProps) => {
  const [selectedPdfFile] = useAtom(selectedPdfFileAtom);
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

    setPdfStatus({
      state: "downloading",
    });
  };

  if (
    pdfStatus.state !== "loaded" &&
    pdfStatus.state !== "processing" &&
    pdfStatus.state !== "downloading"
  ) {
    return null;
  }

  return (
    <Button
      variant="contained"
      size="large"
      sx={{
        position: "fixed",
        bottom: "12px",
        pointerEvents: pdfStatus.state === "loaded" ? "auto" : "none",
        cursor: pdfStatus.state === "loaded" ? "pointer" : "default",
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: "8px",
        width: "86%",
      }}
      onClick={() => {
        downloadProcessedPdf().catch(console.error);
      }}
    >
      {pdfStatus.state === "loaded" && "Download PDF"}
      {pdfStatus.state === "processing" &&
        "Processing your PDF! Please be patient on large files."}
      {pdfStatus.state === "downloading" && "Your PDF download has started!"}
      {pdfStatus.state === "processing" && (
        <CircularProgress
          variant="determinate"
          color="warning"
          size={18}
          value={
            ((pdfStatus.progressCurrent ?? 0) /
              (pdfStatus.progressTotal ?? 1)) *
            100
          }
        />
      )}
    </Button>
  );
};
