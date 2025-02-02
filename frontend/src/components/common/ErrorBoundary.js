import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  Stack,
  Divider 
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";
import { logError } from "../../utils/errorLogger";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate unique error ID for tracking
    const errorId = Math.random().toString(36).substr(2, 9);
    
    // Log error to error tracking service
    logError({
      errorId,
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      location: window.location.href
    });

    this.setState({ 
      error, 
      errorInfo,
      errorId 
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    });
    // Attempt to recover by reloading the component
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  handleReload = () => {
    window.location.reload();
  }

  handleNavigateHome = () => {
    window.location.href = "/";
  }

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      const isDevelopment = process.env.NODE_ENV === "development";

      return (
        <Container maxWidth="sm">
          <Paper 
            elevation={3} 
            sx={{ 
              mt: 10, 
              p: 4, 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center",
              gap: 2
            }}
          >
            <ErrorOutlineIcon color="error" sx={{ fontSize: 64 }} />
            
            <Typography variant="h4" component="h1" gutterBottom>
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" align="center">
              We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
            </Typography>

            {errorId && (
              <Typography variant="caption" color="text.secondary">
                Error ID: {errorId}
              </Typography>
            )}

            {isDevelopment && error && (
              <Box 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: "grey.100", 
                  borderRadius: 1,
                  width: "100%",
                  overflow: "auto"
                }}
              >
                <Typography variant="body2" component="pre" sx={{ whiteSpace: "pre-wrap" }}>
                  {error.toString()}
                </Typography>
              </Box>
            )}

            <Stack 
              direction="row" 
              spacing={2} 
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
              >
                Try Again
              </Button>

              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={this.handleNavigateHome}
              >
                Go Home
              </Button>

              <Button
                variant="outlined"
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
            </Stack>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
