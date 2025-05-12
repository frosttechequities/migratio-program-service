import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { 
  Snackbar, 
  Alert as MuiAlert, 
  Typography, 
  Box,
  IconButton,
  LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

// Custom Alert component with enhanced styling
const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/**
 * Enhanced Toast notification component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the toast is open
 * @param {function} props.onClose - Function to call when the toast is closed
 * @param {string} props.message - Message to display
 * @param {string} props.title - Optional title for the toast
 * @param {string} props.severity - Severity level (success, error, warning, info)
 * @param {number} props.autoHideDuration - Duration in ms before auto-hiding
 * @param {boolean} props.showProgress - Whether to show a progress bar
 * @param {Object} props.action - Custom action component
 * @returns {React.ReactElement} Toast component
 */
const Toast = ({
  open,
  onClose,
  message,
  title,
  severity = 'info',
  autoHideDuration = 6000,
  showProgress = true,
  action,
  ...props
}) => {
  // Get the appropriate icon based on severity
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
      default:
        return <InfoIcon />;
    }
  };
  
  // Progress bar animation duration
  const progressProps = showProgress ? {
    sx: { width: '100%', mt: 0.5 },
    variant: 'determinate',
    value: 100,
    color: severity,
    style: {
      animation: `progress-shrink ${autoHideDuration}ms linear`,
      transformOrigin: 'left',
      '@keyframes progress-shrink': {
        '0%': { transform: 'scaleX(1)' },
        '100%': { transform: 'scaleX(0)' },
      },
    },
  } : {};
  
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      {...props}
    >
      <Alert
        severity={severity}
        icon={getIcon()}
        action={
          action || (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={onClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )
        }
        sx={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
          borderRadius: 2,
          '& .MuiAlert-icon': {
            fontSize: '1.5rem',
            alignItems: 'center',
          },
        }}
      >
        <Box>
          {title && (
            <Typography variant="subtitle2" fontWeight={600}>
              {title}
            </Typography>
          )}
          <Typography variant="body2">{message}</Typography>
          {showProgress && <LinearProgress {...progressProps} />}
        </Box>
      </Alert>
    </Snackbar>
  );
};

Toast.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  severity: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  autoHideDuration: PropTypes.number,
  showProgress: PropTypes.bool,
  action: PropTypes.node,
};

export default Toast;
