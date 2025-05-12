import React, { useState, useEffect } from 'react';
import { Box, Paper, IconButton, useTheme, useMediaQuery, Fade } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import MapIcon from '@mui/icons-material/Map';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import ScrollLink from '../common/ScrollLink';

/**
 * Section navigation component for the homepage
 * Provides quick navigation to different sections of the page
 * 
 * @returns {React.ReactElement} SectionNav component
 */
const SectionNav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Show navigation after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setVisible(scrollPosition > 300);
      
      // Determine active section based on scroll position
      const sections = ['hero', 'features', 'how-it-works', 'map', 'faq'];
      
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation items
  const navItems = [
    { id: 'hero', icon: <HomeIcon />, label: 'Home' },
    { id: 'features', icon: <FeaturedPlayListIcon />, label: 'Features' },
    { id: 'how-it-works', icon: <InfoIcon />, label: 'How It Works' },
    { id: 'map', icon: <MapIcon />, label: 'Global Reach' },
    { id: 'faq', icon: <HelpIcon />, label: 'FAQ' },
  ];
  
  // Offset for scroll position (to account for fixed header)
  const scrollOffset = isMobile ? 70 : 80;
  
  return (
    <Fade in={visible}>
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          [isMobile ? 'bottom' : 'top']: isMobile ? '20px' : '50%',
          [isMobile ? 'left' : 'right']: isMobile ? '50%' : '20px',
          transform: isMobile 
            ? 'translateX(-50%)' 
            : 'translateY(-50%)',
          zIndex: 1000,
          borderRadius: isMobile ? '24px' : '28px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {navItems.map((item) => (
          <ScrollLink
            key={item.id}
            to={item.id}
            offset={scrollOffset}
            aria-label={item.label}
          >
            <IconButton
              size={isMobile ? 'small' : 'medium'}
              sx={{
                m: 0.5,
                color: activeSection === item.id ? 'primary.main' : 'text.secondary',
                bgcolor: activeSection === item.id ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(37, 99, 235, 0.1)',
                },
                position: 'relative',
                '&::after': activeSection === item.id && !isMobile ? {
                  content: '""',
                  position: 'absolute',
                  right: '-8px',
                  width: '3px',
                  height: '60%',
                  bgcolor: 'primary.main',
                  borderRadius: '3px',
                } : {},
                '&::before': activeSection === item.id && isMobile ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  width: '60%',
                  height: '3px',
                  bgcolor: 'primary.main',
                  borderRadius: '3px',
                } : {},
              }}
            >
              {item.icon}
            </IconButton>
          </ScrollLink>
        ))}
      </Paper>
    </Fade>
  );
};

export default SectionNav;
