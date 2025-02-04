import { PdfDownloader } from "@/components/PdfDownloader/PdfDownloader.component";
import { PdfEditor } from "@/components/PdfEditor/PdfEditor.component";
import { PdfSelector } from "@/components/PdfSelector/PdfSelector.component";
import { useMupdf } from "@/hooks/useMupdf.hook";
import { Box, lighten, Link, Typography } from "@mui/material";

export const Home = () => {
  const mupdf = useMupdf();

  return (
    <Box
      textAlign="center"
      padding={2}
      width="100%"
      height="100dvh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={(theme) => ({
        background: `linear-gradient(to bottom, ${
          theme.palette.background.default
        }, ${lighten(theme.palette.background.default, 0.2)});`,
      })}
    >
      <Typography variant="h2">PDF Image Remover</Typography>

      <Typography variant="h6">
        Remove all images from a PDF file, keeping the text and other elements.
        <br />
        Useful for creating printer-friendly versions.
      </Typography>

      <Typography>
        All processing happens in your browser, and no PDF data leaves your
        device.
      </Typography>

      <PdfSelector />

      <PdfEditor mupdf={mupdf} />

      <PdfDownloader mupdf={mupdf} />

      <h5>
        Coming soon: Select which specific images to remove from the PDF. <br />
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
