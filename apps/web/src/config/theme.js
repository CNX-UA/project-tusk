import { alpha, createTheme } from '@mui/material/styles';

const PRIMARY_MAIN = '#e53935'; // червоний
const SECONDARY_MAIN = '#00b0ff'; // блакитний

export const getAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: PRIMARY_MAIN,
      light: alpha(PRIMARY_MAIN, 0.5),
      dark: '#ab000d',
      contrastText: '#ffffff'
    },
    secondary: {
      main: SECONDARY_MAIN,
    },
    background: {
      default: mode === 'light' ? '#f4f6f8' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
        primary: mode === 'light' ? '#212b36' : '#ffffff',
        secondary: mode === 'light' ? '#637381' : '#919eab',
    },

    success: { main: '#36b37e' },
    warning: { main: '#ffab00' },
    error: { main: '#ff5630' },
    info: { main: '#00b8d9' },
  },


  typography: {
    fontFamily: '"Nunito, Manrope, Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {

      fontWeigdht: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
  MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            '&.Mui-selected': {
              backgroundColor: alpha(PRIMARY_MAIN, 0.12),
              color: PRIMARY_MAIN,
              '&:hover': {
                backgroundColor: alpha(PRIMARY_MAIN, 0.16),
              },
              '& .MuiListItemIcon-root': {
                color: PRIMARY_MAIN,
              },
            },
          },
        },
      },
    MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
    }
});

export default getAppTheme('light');