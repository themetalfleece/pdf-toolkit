import { selectedPdfFileAtom } from "@/store/selectedPdfFile.store";
import { CloudUpload } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useDropzone } from "react-dropzone";

export const PdfSelector = () => {
  const [selectedPdfFile, setSelectedPdfFile] = useAtom(selectedPdfFileAtom);

  const onDrop = (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles.find(
      (file) => file.type === "application/pdf"
    );

    if (pdfFile) {
      setSelectedPdfFile(pdfFile);
    } else {
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
      sx={(theme) => ({
        border: `2px dashed ${theme.palette.grey[500]}`,
        cursor: "pointer",
        backgroundColor: isDragActive
          ? theme.palette.grey[800]
          : theme.palette.background.paper,
      })}
    >
      <input {...getInputProps()} />
      <CloudUpload style={{ fontSize: 48, color: "#1976d2" }} />
      <Typography>
        {isDragActive
          ? "Drop the file here..."
          : "Drag & drop a PDF file here, or click to select one"}
      </Typography>
      {selectedPdfFile && (
        <Typography fontWeight={500} color="#1976d2">
          Selected file: {selectedPdfFile.name}
        </Typography>
      )}
    </Box>
  );
};
