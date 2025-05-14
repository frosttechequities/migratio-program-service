import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import ChatbotWidget from '../../features/chatbot/components/ChatbotWidget';
import { useSelector } from 'react-redux';

/**
 * MainLayout component for dashboard and protected pages
 * This is a standalone layout that doesn't use the main Layout component
 * to avoid nesting layouts
 * @returns {React.ReactNode} - Layout component
 */
const MainLayout = ({ children, title }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Set document title if provided
  React.useEffect(() => {
    if (title) {
      document.title = `${title} | Visafy`;
    }
  }, [title]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* We don't render Header and Footer here since they're already in the main Layout */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          py: 2,
        }}
      >
        {children}
      </Box>

      {/* We don't render the chatbot widget here since it's already in the main Layout */}
    </Box>
  );
};

export default MainLayout;