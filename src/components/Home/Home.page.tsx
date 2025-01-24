import { PdfSelector } from "@/components/PdfSelector/PdfSelector.component";
import { Box } from "@mui/material";

export const Home = () => {
  return (
    <Box
      textAlign="center"
      margin={2}
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <h1>PDF Image Remover</h1>

      <PdfSelector />

      <h5>Coming soon: Select which specific images to remove from the PDF.</h5>
    </Box>
  );
};
