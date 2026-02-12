import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box, Divider, Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EntityModal = ({ 
  open, 
  onClose, 
  title, 
  subtitle = "",
  children,
  actions,
  maxWidth = "sm",
  isLoading = false
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth={maxWidth}
      PaperProps={{
        elevation: 2, // М'якша тінь
        sx: { 
          borderRadius: 4, // Більш сучасне заокруглення
          overflow: 'hidden'
        }
      }}
      TransitionProps={{
        timeout: {
          enter: 300,
          exit: 200,
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 3, 
        pb: 1
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              letterSpacing: '-0.5px'
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton 
          onClick={onClose} 
          size="small" 
          disabled={isLoading}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' } 
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ my: 0 }} />

      {/* Content */}
      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {children}
        </Stack>
      </DialogContent>

      {/* Actions */}
      {actions && (
        <>
          <Divider sx={{ my: 0 }} />
          <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'flex-end', gap: 1 }}>
            {actions}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default EntityModal;