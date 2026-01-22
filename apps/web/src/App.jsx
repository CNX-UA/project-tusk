import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { CssBaseline, Box, Toolbar, Container, Typography, Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getAppTheme } from "./theme";
import Aside from "./components/Aside";
import AuthForm from "./components/AuthForm";
import ThemeSwitcher from "./components/ThemeSwitcher";

function App() {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const theme = useMemo(() => getAppTheme(mode), [mode]);

    const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ display: "flex", bgcolor: 'background.default'}}>
      <CssBaseline />

      {isLoggedIn && <Aside toggleColorMode={toggleColorMode} mode={mode}>
        <ThemeSwitcher mode={mode} toggleColorMode={toggleColorMode} /></Aside>}

      <Container component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Project Tusk
        </Typography>

      {isLoggedIn ? (
          <Box>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => setIsLoggedIn(false)}
              sx={{ mt: 2 }}
            >
              Exit
            </Button>
          </Box>
        ) : (
            <AuthForm onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
      </Container>
    </Box>
    </ThemeProvider>
  );
}
export default App;
