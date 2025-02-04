import { pdfStatusAtom } from "@/store/pdfStatus.store";
import { selectedPdfFileAtom } from "@/store/selectedPdfFile.store";
import { CloudUpload } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useDropzone } from "react-dropzone";

export const PdfSelector = () => {
  const [selectedPdfFile, setSelectedPdfFile] = useAtom(selectedPdfFileAtom);
  const [, setPdfStatus] = useAtom(pdfStatusAtom);

  const onDrop = (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles.find(
      (file) => file.type === "application/pdf"
    );

    if (pdfFile) {
      setSelectedPdfFile(pdfFile);
      setPdfStatus({
        state: "selected",
        progressCurrent: 0,
        progressTotal: 0,
      });
    } else {
      setSelectedPdfFile(null);
      setPdfStatus({
        state: "unselected",
        progressCurrent: 0,
        progressTotal: 0,
      });
      alert("Please upload a valid PDF file.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      textAlign="center"
      padding={4}
      borderRadius={2}
      width="80%"
      minHeight="300px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={(theme) => ({
        border: `2px dashed ${theme.palette.grey[500]}`,
        cursor: "pointer",
        backgroundColor: isDragActive
          ? theme.palette.action.hover
          : theme.palette.background.paper,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      })}
    >
      <input {...getInputProps()} />
      <CloudUpload color="primary" sx={{ fontSize: 48 }} />
      <Typography variant="h5">
        {isDragActive
          ? "Drop the file here 🔥"
          : "Drag & drop a PDF file here, or click to select one"}
      </Typography>
      {selectedPdfFile && (
        <Typography variant="h6" fontWeight={500} color="primary">
          Selected file: {selectedPdfFile.name}
        </Typography>
      )}
    </Box>
  );
};
