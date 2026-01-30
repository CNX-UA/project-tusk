import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Toast({message, severity = 'info', open, onClose}) {
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    onClose();
  };

  return (
    <Snackbar
    open={open} 
    autoHideDuration={5000}
    onClose={handleClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
    </Snackbar>
  );
}
