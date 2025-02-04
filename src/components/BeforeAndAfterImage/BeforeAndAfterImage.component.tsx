import { Box, Paper, Typography } from "@mui/material";
import BeforeAfterSlider from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";

export const BeforeAndAfterImage = () => {
  const beforeImage = "/demo-image-before.jpg";
  const afterImage = "/demo-image-after.jpg";

  return (
    <Paper sx={{ padding: 2, maxWidth: "600px", textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        Demo with removed images:
      </Typography>
      <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
        <BeforeAfterSlider
          firstImage={{ imageUrl: beforeImage }}
          secondImage={{ imageUrl: afterImage }}
        />
      </Box>
    </Paper>
  );
};
