import React from 'react';
import { IconButton, Box, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Місяць
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeSwitcher = ({ mode, toggleColorMode }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2">
        {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </Typography>
      <IconButton onClick={toggleColorMode} color="inherit">
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
};

export default ThemeSwitcher;