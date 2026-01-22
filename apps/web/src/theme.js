import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#e53935'
    },
    secondary: {
      main: '#00b0ff',
    },
    background: {
      default: mode === 'light' ? '#eeeeee' : '#121212',
      paper: mode === 'light' ? '#bdbdbd' : '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default getAppTheme('light');