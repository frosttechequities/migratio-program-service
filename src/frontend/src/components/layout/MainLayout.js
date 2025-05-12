import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { clearMessage } from '../../features/ui/uiSlice';
import Header from './Header';
import Footer from './Footer';
import SkipLink from '../common/SkipLink';
import ChatbotWidget from '../../features/chatbot/components/ChatbotWidget'; // Import Chatbot
import { useToast } from '../../contexts/ToastContext';

/**
 * Main layout component that wraps all pages
 * @returns {React.ReactNode} - Layout component
 */
const MainLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const toast = useToast();
  const { message } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  // Determine if the current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/dashboard') ||
                          location.pathname.startsWith('/profile') ||
                          location.pathname.startsWith('/assessment') ||
                          location.pathname.startsWith('/documents') ||
                          location.pathname.startsWith('/roadmap');

  // Show toast message when message changes
  useEffect(() => {
    if (message) {
      // Map message type to toast method
      switch (message.type) {
        case 'success':
          toast.success(message.text);
          break;
        case 'error':
          toast.error(message.text);
          break;
        case 'warning':
          toast.warning(message.text);
          break;
        case 'info':
        default:
          toast.info(message.text);
          break;
      }

      // Clear the message from Redux store
      dispatch(clearMessage());
    }
  }, [message, dispatch, toast]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <SkipLink />
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#f9fafb',
        backgroundImage: 'url("/assets/world-map-pattern.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,102,255,0.03) 0%, rgba(124,58,237,0.03) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Header />

      <Box sx={{ display: 'flex', flex: 1, position: 'relative', zIndex: 1 }}>
        {/* Main content */}
        <Box
          id="main-content"
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: '100%',
            transition: theme => theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            my: 3,
            mx: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Page content */}
          <Outlet />
        </Box>
      </Box>

      <Footer />
      {/* Render Chatbot Widget (conditionally based on auth?) */}
      {isAuthenticated && <ChatbotWidget />}
    </Box>
    </>
  );
};

export default MainLayout;