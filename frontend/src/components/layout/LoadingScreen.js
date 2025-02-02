import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh"
      bgcolor="background.default"
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="textSecondary" style={{ marginTop: 16 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
