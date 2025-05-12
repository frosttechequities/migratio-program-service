import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Toast from '../components/common/Toast';
import AccessibilityAnnouncer from '../components/common/AccessibilityAnnouncer';

// Create context
const ToastContext = createContext(null);

/**
 * Toast provider component
 * Provides toast notification functionality to the entire app
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} ToastProvider component
 */
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: '',
    title: '',
    severity: 'info',
    autoHideDuration: 6000,
    showProgress: true,
  });
  
  // For screen reader announcements
  const [announcement, setAnnouncement] = useState('');
  
  // Close the toast
  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, open: false }));
  }, []);
  
  // Show a toast notification
  const showToast = useCallback(({
    message,
    title = '',
    severity = 'info',
    autoHideDuration = 6000,
    showProgress = true,
  }) => {
    setToast({
      open: true,
      message,
      title,
      severity,
      autoHideDuration,
      showProgress,
    });
    
    // Announce to screen readers
    const announcementText = title 
      ? `${severity}: ${title}. ${message}`
      : `${severity}: ${message}`;
    
    setAnnouncement(announcementText);
  }, []);
  
  // Convenience methods for different toast types
  const success = useCallback((message, title = '') => {
    showToast({ message, title, severity: 'success' });
  }, [showToast]);
  
  const error = useCallback((message, title = '') => {
    showToast({ 
      message, 
      title, 
      severity: 'error',
      autoHideDuration: 8000, // Errors stay longer
    });
  }, [showToast]);
  
  const warning = useCallback((message, title = '') => {
    showToast({ message, title, severity: 'warning' });
  }, [showToast]);
  
  const info = useCallback((message, title = '') => {
    showToast({ message, title, severity: 'info' });
  }, [showToast]);
  
  // Context value
  const value = {
    showToast,
    success,
    error,
    warning,
    info,
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        open={toast.open}
        onClose={closeToast}
        message={toast.message}
        title={toast.title}
        severity={toast.severity}
        autoHideDuration={toast.autoHideDuration}
        showProgress={toast.showProgress}
      />
      <AccessibilityAnnouncer 
        message={announcement}
        politeness={toast.severity === 'error' ? 'assertive' : 'polite'}
      />
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use the toast context
 * @returns {Object} Toast context
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default ToastContext;
