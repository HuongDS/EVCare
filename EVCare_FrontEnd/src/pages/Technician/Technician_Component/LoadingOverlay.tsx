import { Box, CircularProgress } from "@mui/material";

export default function LoadingOverlay() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        zIndex: 10,
        borderRadius: 2,
      }}
    >
      <CircularProgress size={50} thickness={4} color="success" />
    </Box>
  );
}
