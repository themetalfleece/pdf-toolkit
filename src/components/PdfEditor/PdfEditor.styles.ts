import { styled } from "@mui/material";

interface PdfImageProps {
  isHighlighted: boolean;
}

export const PdfImage = styled("img")<PdfImageProps>(
  ({ isHighlighted, theme }) => ({
    maxWidth: 300,
    maxHeight: 300,
    cursor: "pointer",
    boxShadow: isHighlighted
      ? `0 0 20px ${theme.palette.primary.dark}`
      : undefined,
    border: isHighlighted
      ? `2px solid ${theme.palette.primary.dark}`
      : "2px solid transparent",
    boxSizing: "border-box",
  })
);
