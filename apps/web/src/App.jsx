import { useEffect, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';
import { CssBaseline, Box } from "@mui/material";
import api from '@/api/axios'
import { ThemeProvider } from "@mui/material/styles";
import { ToastProvider } from "@/context/ToastProvider";

import { getAppTheme } from "@/config/theme"; 

import MainLayout from "@/components/layout/MainLayout";
import AuthForm from "@/features/auth/components/AuthForm";
import OAuthCallback from "@/features/auth/components/OAuthCallback";

import Projects from "@/features/projects/components/ProjectsPage";
import Tasks from "@/features/tasks/components/TasksPage";
import Settings from "@/features/settings/components/SettingsPage";

function App() {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const theme = useMemo(() => getAppTheme(mode), [mode]);

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

    const queryClient = useQueryClient();


    const handleLogout = async () => {
      try{
        await api.delete('/logout');
      }catch(err){
        console.error(err);
      }finally{
      localStorage.removeItem("token");
      // setIsLoggedIn(false);
      window.location.href = '/login';

      }
      
      // queryClient.removeQueries();
      // queryClient.clear();
    }
    

    const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <Routes>
          <Route path="/login"
          element={
            !isLoggedIn ? (
              <Box sx={{
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '100vh', 
              bgcolor: 'background.default'
              }}>
                <AuthForm onLoginSuccess={() => setIsLoggedIn(true)} />
              </Box>
            ) : (
              <Navigate to="/projects" replace/>
            )
          }
          />
          
      {isLoggedIn ? ( 
        <Route element={
          <MainLayout 
          toggleColorMode={toggleColorMode} mode={mode} 
          onLogout={handleLogout} userEmail={"admin@test.com"} /> 
        }>
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/projects" replace /> } />
        </Route>
        ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        <Route path="/auth/callback" element={<OAuthCallback onLoginSuccess={() => setIsLoggedIn(true)} />}
        />
        </Routes>
        </ToastProvider>
    </ThemeProvider>
  );
}
export default App;
