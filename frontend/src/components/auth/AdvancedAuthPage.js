import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Divider, 
  IconButton, 
  InputAdornment,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  Google as GoogleIcon, 
  GitHub as GitHubIcon 
} from "@mui/icons-material";

const AdvancedAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false
  });

  const handleInputChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLogin) {
      // Login logic
      console.log("Login submitted", formData);
    } else {
      // Registration logic with password confirmation
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      console.log("Registration submitted", formData);
    }
  };

  const socialLoginButtons = [
    { 
      icon: <GoogleIcon />, 
      text: `${isLogin ? "Sign in" : "Sign up"} with Google`, 
      color: "#DB4437" 
    },
    { 
      icon: <GitHubIcon />, 
      text: `${isLogin ? "Sign in" : "Sign up"} with GitHub`, 
      color: "#333" 
    }
  ];

  return (
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)"
      }}
    >
      <Paper 
        elevation={10} 
        sx={{ 
          width: "100%", 
          maxWidth: 450, 
          p: 4, 
          borderRadius: 2 
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
        >
          {isLogin ? "Welcome Back" : "Create Account"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            required
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange("password")}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {!isLogin && (
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              required
            />
          )}

          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              my: 2 
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.rememberMe}
                  onChange={() => setFormData(prev => ({
                    ...prev, 
                    rememberMe: !prev.rememberMe
                  }))}
                />
              }
              label="Remember me"
            />
            {isLogin && (
              <Typography 
                variant="body2" 
                color="primary"
                sx={{ cursor: "pointer" }}
              >
                Forgot Password?
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1.5 }}
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Box sx={{ display: "flex", gap: 2 }}>
            {socialLoginButtons.map((button) => (
              <Button
                key={button.text}
                fullWidth
                variant="outlined"
                startIcon={button.icon}
                sx={{ 
                  color: button.color, 
                  borderColor: button.color,
                  "&:hover": { 
                    backgroundColor: `${button.color}10`, 
                    borderColor: button.color 
                  }
                }}
              >
                {button.text}
              </Button>
            ))}
          </Box>

          <Typography 
            variant="body2" 
            align="center" 
            sx={{ mt: 3 }}
          >
            {isLogin 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <Typography 
              component="span" 
              color="primary"
              sx={{ 
                cursor: "pointer", 
                fontWeight: "bold" 
              }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </Typography>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default AdvancedAuthPage;
