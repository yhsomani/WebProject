import React from "react";
import { Box, Typography, Button } from "@mui/material";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Box role="alert" sx={{ textAlign: "center", padding: 2 }}>
      <Typography variant="h5" color="error">
        Something went wrong:
      </Typography>
      <Typography variant="body1">{error.message}</Typography>
      <Button onClick={resetErrorBoundary} variant="contained" color="primary">
        Try Again
      </Button>
    </Box>
  );
};

export default ErrorFallback;