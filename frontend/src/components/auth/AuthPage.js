import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Box,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";

const AuthPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setName("");
  };

  const validateForm = () => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address with proper domain");
      return false;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long and contain letters and numbers");
      return false;
    }
    if (activeTab === 1) {
      if (!name || name.trim().length < 2) {
        setError("Please enter your full name (minimum 2 characters)");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint = activeTab === 0 ? "/auth/login" : "/auth/register";
      const payload = activeTab === 0
        ? { email, password }
        : { name, email, password, role: "student" };

      const response = await apiService.post(endpoint, payload);

      if (response.data?.token) {
        localStorage.setItem("authToken", response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setSuccess(activeTab === 0
          ? "Welcome back! Login successful. Redirecting to dashboard..."
          : "Account created successfully! Redirecting to dashboard..."
        );
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper sx={{ width: "100%", mb: 2, mt: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            {activeTab === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={activeTab === 0 ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                activeTab === 0 ? "Sign In to Your Account" : "Create New Account"
              )}
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={!!error || !!success}
          autoHideDuration={6000}
          onClose={() => {
            setError("");
            setSuccess("");
          }}
        >
          <Alert
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default AuthPage;
