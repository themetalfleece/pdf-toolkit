import { useMupdf } from "@/hooks/useMupdf.hook";
import { pdfImagesAtom } from "@/store/pdfImages.store";
import { pdfStatusAtom } from "@/store/pdfStatus.store";
import { selectedPdfFileAtom } from "@/store/selectedPdfFile.store";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { PdfImage } from "./PdfEditor.styles";

export interface PdfEditorProps {
  mupdf: ReturnType<typeof useMupdf>;
}

export const PdfEditor = ({ mupdf }: PdfEditorProps) => {
  const [selectedPdfFile] = useAtom(selectedPdfFileAtom);
  const [pdfImages, setPdfImages] = useAtom(pdfImagesAtom);
  const [pdfStatus, setPdfStatus] = useAtom(pdfStatusAtom);

  useEffect(() => {
    if (!selectedPdfFile) {
      return;
    }

    const loadAndProcess = async () => {
      await mupdf.loadDocument(await selectedPdfFile.arrayBuffer());

      const images = await mupdf.extractImages();

      setPdfImages(images.map((image) => ({ ...image, shouldRedact: true })));

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
  }, [selectedPdfFile, mupdf, setPdfStatus, setPdfImages]);

  const pdfImagesByPage = useMemo(() => {
    return pdfImages?.reduce((acc, image) => {
      if (!acc[image.pageIndex]) {
        acc[image.pageIndex] = [];
      }
      acc[image.pageIndex].push(image);
      return acc;
    }, {} as Record<number, typeof pdfImages>);
  }, [pdfImages]);

  const onToggleImage = useCallback(
    (imageUrl: string) => {
      setPdfImages((prev) => {
        if (!prev) return prev;
        const updatedImages = prev.map((image) =>
          image.url === imageUrl
            ? { ...image, shouldRedact: !image.shouldRedact }
            : image
        );
        return updatedImages;
      });

      if (pdfStatus.state === "downloading") {
        setPdfStatus({
          state: "loaded",
          progressCurrent: 0,
          progressTotal: 0,
        });
      }
    },
    [pdfStatus.state, setPdfImages, setPdfStatus]
  );

  const onToggleAllImagesOfPage = useCallback(
    (pageIndex: number) => {
      setPdfImages((prev) => {
        if (!prev) return prev;
        const firstImageOfPage = prev.find(
          (image) => image.pageIndex === pageIndex
        );
        if (!firstImageOfPage) return prev;

        const shouldRedact = !firstImageOfPage.shouldRedact;
        const updatedImages = prev.map((image) =>
          image.pageIndex === pageIndex ? { ...image, shouldRedact } : image
        );
        return updatedImages;
      });

      if (pdfStatus.state === "downloading") {
        setPdfStatus({
          state: "loaded",
          progressCurrent: 0,
          progressTotal: 0,
        });
      }
    },
    [pdfStatus.state, setPdfImages, setPdfStatus]
  );

  useEffect(() => {
    if (!selectedPdfFile) {
      return;
    }

    document
      .getElementById("pdf-editor")
      ?.scrollIntoView({ behavior: "smooth" });
  }, [selectedPdfFile]);

  if (pdfStatus.state === "selected") {
    return (
      <Box id="pdf-editor">
        <Typography variant="h6">
          Extracting images. This may take a while...
        </Typography>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={3} id="pdf-editor">
      {pdfImages?.length && (
        <Typography>
          Selected images will be kelp. Unselected images will be removed from
          the PDF.
        </Typography>
      )}

      {Object.entries(pdfImagesByPage ?? {}).map(([pageIndex, images]) => (
        <Box key={pageIndex} display="flex" flexDirection="column" gap={1}>
          <Box>
            <Typography variant="h5" fontWeight={500}>
              Page {Number(pageIndex) + 1}
            </Typography>
            <Button onClick={() => onToggleAllImagesOfPage(+pageIndex)}>
              Select / Unselect
            </Button>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            {images.map(({ url, shouldRedact }, i) => (
              <PdfImage
                isHighlighted={!shouldRedact}
                key={i}
                src={url}
                alt={`Image ${i + 1}`}
                onClick={() => onToggleImage(url)}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
