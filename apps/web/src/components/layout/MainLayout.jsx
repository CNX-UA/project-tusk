import React from "react";
import { Box, Container, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Aside from "./Aside";

const MainLayout = ({  mode, toggleColorMode, onLogout, userEmail}) => {
    return (
        <Box sx={{ display: "flex", bgcolor: 'background.default', minHeight: '100vh' }}>
            <CssBaseline />

            <Aside mode={mode} 
            toggleColorMode={toggleColorMode} 
            onLogout={onLogout} 
            userEmail={userEmail}
            />

            <Container sx={{ flexGrow: 1, p: 3, mt: 2 }}>
                <Outlet />
            </Container>
        </Box>
    )};

export default MainLayout; 