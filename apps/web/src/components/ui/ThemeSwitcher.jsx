import React from 'react';
import { IconButton } from '@mui/material';
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import Brightness7RoundedIcon from "@mui/icons-material/Brightness7Rounded";

const ThemeSwitcher = ({ mode, toggleColorMode }) => {
  return (
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === "dark" ? (
            <Brightness7RoundedIcon />
          ) : (
            <Brightness4RoundedIcon />
          )}
        </IconButton>
  );
};

export default ThemeSwitcher;