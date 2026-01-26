import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box, Tab, Tabs, Alert, Divider, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAuthForm } from "../hooks/useAuthForm";

const AuthForm = ({ onLoginSuccess }) => {
  const [ tabValue, setTabValue ] = useState(0);
  const { formik, isLoading, isError, errorMessage } = useAuthForm(onLoginSuccess, tabValue);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 5 }}> 
      <Tabs
        value={tabValue}
        onChange={(_, v) => { setTabValue(v); formik.resetForm(); }}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Log in" />
        <Tab label="Register" />
      </Tabs>

      <Typography variant="h5" align="center" gutterBottom>
        {tabValue === 0 ? "Login to Tusk" : "Create account"}
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
         {...formik.getFieldProps('email')}
         error={formik.touched.email && Boolean(formik.errors.email)}
         helperText={formik.touched.email && formik.errors.email} 
        />
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          margin="normal"
          {...formik.getFieldProps('password')}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : (tabValue === 0 ? "Login" : "Register")}
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
