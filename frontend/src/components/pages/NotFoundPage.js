import React from "react";
import { Box, Typography, Button, Link } from "@mui/material";

function NotFoundPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={2}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h5">Page Not Found</Typography>
      <Button 
        component={Link} 
        href="/"
        variant="contained" 
        color="primary"
      >
        Go Home
      </Button>
    </Box>
  );
}

export default NotFoundPage;
