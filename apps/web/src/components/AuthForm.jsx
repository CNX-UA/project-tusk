import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box, Tab, Tabs, Alert, Divider } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import axios from "axios";


const AuthForm = ({ onLoginSuccess }) => {
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const loginUrl = "http://localhost:3000/users/sign_in";
    const registerUrl = "http://localhost:3000/users";
    try {
      let response;
      if (tabValue === 0) {
        response = await axios.post(loginUrl, {
          user: { email, password },
        });
      } else {
        // Register first
        const registerResponse = await axios.post(registerUrl, {
          user: { email, password, password_confirmation: password },
        });
        response = await axios.post(loginUrl, {
          user: { email, password },
        });
      }

      const token = response.headers.authorization;
      if (token) {
        localStorage.setItem("token", token);
        onLoginSuccess();
      } else {
        setError("No authentication token received");
      }
    } catch (err) {
      console.error("Error:", err.response);
      setError(err.response?.data?.error || "Something wrong..");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 5 }}>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Log in" />
        <Tab label="Register" />
      </Tabs>

      <Typography variant="h5" align="center" gutterBottom>
        {tabValue === 0 ? "Login to Tusk" : "Create account"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
        >
          {tabValue === 0 ? "Login" : "Register"}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        OR
        </Typography>
      </Divider>

      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button startIcon={<GoogleIcon />}>
          Continue with Google
        </Button>

        <Button startIcon={<GitHubIcon />}>
          Continue with GitHub
        </Button>
      </Box>

    </Paper>
  );
};

export default AuthForm;
