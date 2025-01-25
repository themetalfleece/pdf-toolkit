import { PdfDownloader } from "@/components/PdfDownloader/PdfDownloader.component";
import { PdfEditor } from "@/components/PdfEditor/PdfEditor.component";
import { PdfSelector } from "@/components/PdfSelector/PdfSelector.component";
import { useMupdf } from "@/hooks/useMupdf.hook";
import { Box, Link, Typography } from "@mui/material";

export const Home = () => {
  const mupdf = useMupdf();

  return (
    <Box
      textAlign="center"
      margin={2}
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h2">PDF Image Remover</Typography>

      <Typography variant="h6">
        Remove all images from a PDF file, keeping the text and other elements.
        <br />
        Useful for creating printer-friendly versions.
      </Typography>

      <PdfSelector />

      <PdfEditor mupdf={mupdf} />

      <PdfDownloader mupdf={mupdf} />

      <Typography>
        All processing happens in your browser, and no PDF data leaves your
        device.
      </Typography>

      <h5>Coming soon: Select which specific images to remove from the PDF.</h5>

      <h5>
        This project is open-source. Check out the code on{" "}
        <Link
          href="https://github.com/themetalfleece/pdf-toolkit"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </Link>
        .
      </h5>
    </Box>
  );
};
