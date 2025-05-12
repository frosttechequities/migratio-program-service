import React, { useEffect, useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Avatar,
  Rating,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ResponsiveImage from '../components/common/ResponsiveImage';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SectionNav from '../components/navigation/SectionNav';
import AnimatedElement from '../components/common/AnimatedElement';
import GradientText from '../components/common/GradientText';
import GlassCard from '../components/common/GlassCard';
import PerformanceMonitor from '../components/common/PerformanceMonitor';
import { useToast } from '../contexts/ToastContext';
import { debounce, throttle } from '../utils/performance';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loaded, setLoaded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const heroRef = useRef(null);
  const testimonialIntervalRef = useRef(null);
  const toast = useToast();

  // Animation states
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [iconVisible, setIconVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [countryCount, setCountryCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  // Statistics data
  const stats = [
    { label: 'Countries Supported', value: 150, icon: <LanguageIcon />, color: '#2563EB' },
    { label: 'Success Rate', value: 98, icon: <AutoGraphIcon />, color: '#7C3AED', suffix: '%' },
    { label: 'Happy Immigrants', value: 10000, icon: <PeopleAltIcon />, color: '#EC4899', prefix: '+' }
  ];

  // Testimonial data
  const testimonials = [
    {
      quote: "Visafy made my immigration journey so much easier. The personalized roadmap was exactly what I needed.",
      name: "Sarah Chen",
      location: "Moved to Canada",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      quote: "The document management system saved me countless hours of stress and confusion.",
      name: "Miguel Rodriguez",
      location: "Moved to Australia",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    },
    {
      quote: "I couldn't have navigated the complex visa process without Visafy's step-by-step guidance.",
      name: "Aisha Patel",
      location: "Moved to UK",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 4
    }
  ];

  // Handle scroll for parallax effect with throttling for better performance
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      setScrollPosition(scrollY);

      // Show back to top button when scrolled down 500px
      setShowBackToTop(scrollY > 500);
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll back to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Trigger animations after component mounts
  useEffect(() => {
    setLoaded(true);

    const titleTimer = setTimeout(() => setTitleVisible(true), 300);
    const subtitleTimer = setTimeout(() => setSubtitleVisible(true), 800);
    const buttonTimer = setTimeout(() => setButtonVisible(true), 1300);
    const iconTimer = setTimeout(() => setIconVisible(true), 1800);

    // Animate statistics counters with optimized animation
    const animateCounter = (setter, targetValue, duration, delay) => {
      const timer = setTimeout(() => {
        const startTime = Date.now();
        const endTime = startTime + duration;

        const updateCounter = () => {
          const now = Date.now();
          if (now >= endTime) {
            setter(targetValue);
            return;
          }

          const progress = (now - startTime) / duration;
          const currentValue = Math.floor(progress * targetValue);
          setter(currentValue);
          requestAnimationFrame(updateCounter);
        };

        requestAnimationFrame(updateCounter);
      }, delay);

      return timer;
    };

    const countryCountTimer = animateCounter(setCountryCount, 150, 1500, 2200);
    const userCountTimer = animateCounter(setUserCount, 10000, 1500, 2400);
    const successRateTimer = animateCounter(setSuccessRate, 98, 1500, 2600);

    // Auto-rotate testimonials with debounced state update for better performance
    testimonialIntervalRef.current = setInterval(() => {
      const nextTestimonial = (activeTestimonial + 1) % testimonials.length;
      // Use debounce to prevent too many re-renders
      debounce(() => setActiveTestimonial(nextTestimonial), 100)();
    }, 5000);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(buttonTimer);
      clearTimeout(iconTimer);
      clearTimeout(countryCountTimer);
      clearTimeout(userCountTimer);
      clearTimeout(successRateTimer);
      clearInterval(testimonialIntervalRef.current);
    };
  }, [testimonials.length, activeTestimonial]);

  return (
    <Box>
      {/* Performance Monitor (only visible in development) */}
      <PerformanceMonitor componentName="HomePage" />

      {/* Section Navigation */}
      <SectionNav />

      {/* Back to Top Button - Mobile Optimized */}
      <Fade in={showBackToTop}>
        <Box
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: { xs: 20, md: 30 },
            right: { xs: 20, md: 30 },
            zIndex: 1000,
            width: { xs: 50, md: 60 },
            height: { xs: 50, md: 60 },
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          <KeyboardArrowUpIcon sx={{ color: 'white', fontSize: { xs: 28, md: 32 } }} />
        </Box>
      </Fade>
      {/* Premium Hero Section - 3.0 (Mobile Optimized) */}
      <Box
        id="hero"
        ref={heroRef}
        sx={{
          position: 'relative',
          color: 'white',
          overflow: 'hidden',
          height: { xs: 'auto', sm: '100vh' },
          minHeight: { xs: 'calc(100vh - 70px)', md: '800px' }, // Adjusted for mobile header
          maxHeight: { md: '900px' },
          display: 'flex',
          alignItems: 'center',
          mb: 0,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pt: { xs: '90px', md: 0 }, // Increased padding top on mobile
          pb: { xs: 10, md: 0 }, // Increased padding bottom on mobile
        }}
      >
        {/* Advanced Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          {/* Multi-layered Parallax Background - Performance Optimized */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              // Disable parallax effect on mobile for better performance
              transform: { xs: 'none', md: `translateY(-${scrollPosition * 0.15}px)` },
              willChange: { xs: 'auto', md: 'transform' }, // Only use willChange when needed
              filter: 'brightness(0.85)',
              overflow: 'hidden', // Prevent image overflow
            }}
          >
            <ResponsiveImage
              src="/hero-image.png"
              mobileSrc="/hero-image.png"
              webpSrc="/assets/images/optimized/hero-image.webp"
              mobileWebpSrc="/assets/images/optimized/hero-image-mobile.webp"
              alt="Diverse professionals at airport"
              lazy={false}
              objectPosition="center 30%"
              imgSx={{
                willChange: 'transform',
                transform: 'scale(1.05)',
              }}
              onLoad={() => setLoaded(true)}
            />
          </Box>

          {/* Advanced Gradient Overlay with Multiple Layers */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.5) 100%)',
              zIndex: 1,
            }}
          />

          {/* Color Overlay - Performance Optimized */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(0,102,255,0.3) 0%, rgba(82,113,255,0.2) 100%)',
              opacity: 0.7,
              zIndex: 2,
              // Disable animation on mobile for better performance
              animation: { xs: 'none', md: 'colorPulse 15s infinite alternate' },
              willChange: { xs: 'auto', md: 'opacity' }, // Only use willChange when needed
              '@keyframes colorPulse': {
                '0%': { opacity: 0.5 },
                '50%': { opacity: 0.7 },
                '100%': { opacity: 0.5 },
              },
            }}
          />

          {/* Subtle Pattern Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/assets/background-pattern.png)',
              backgroundSize: '500px',
              opacity: 0.1,
              zIndex: 3,
            }}
          />

          {/* Enhanced Decorative Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 4,
              opacity: loaded ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          >
            {/* Top Right Decorative Circle - Optimized */}
            <Box
              sx={{
                position: 'absolute',
                top: '10%',
                right: '8%',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,102,255,0.25) 0%, rgba(82,113,255,0.15) 50%, rgba(0,0,0,0) 70%)',
                animation: 'pulse 12s infinite ease-in-out',
                display: { xs: 'none', md: 'block' },
                willChange: 'transform, opacity', // Optimize for animation
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)', opacity: 0.5 },
                  '50%': { transform: 'scale(1.15)', opacity: 0.7 },
                  '100%': { transform: 'scale(1)', opacity: 0.5 },
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '70%',
                  height: '70%',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transform: 'translate(-50%, -50%)',
                },
              }}
            />

            {/* Bottom Left Decorative Circle - Optimized */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '15%',
                left: '5%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(82,113,255,0.25) 0%, rgba(0,102,255,0.15) 50%, rgba(0,0,0,0) 70%)',
                animation: 'floatSlow 15s infinite ease-in-out',
                display: { xs: 'none', md: 'block' },
                willChange: 'transform', // Optimize for animation
                '@keyframes floatSlow': {
                  '0%': { transform: 'translateY(0px) rotate(0deg)' },
                  '50%': { transform: 'translateY(-25px) rotate(5deg)' },
                  '100%': { transform: 'translateY(0px) rotate(0deg)' },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-15%',
                  left: '-15%',
                  width: '130%',
                  height: '130%',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  animation: 'spin 30s linear infinite',
                  willChange: 'transform', // Optimize for animation
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                },
              }}
            />

            {/* Middle Right Small Circle - Optimized */}
            <Box
              sx={{
                position: 'absolute',
                top: '45%',
                right: '15%',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0) 70%)',
                animation: 'floatFast 8s infinite ease-in-out',
                display: { xs: 'none', md: 'block' },
                willChange: 'transform', // Optimize for animation
                '@keyframes floatFast': {
                  '0%': { transform: 'translate(0, 0)' },
                  '25%': { transform: 'translate(-10px, 10px)' },
                  '50%': { transform: 'translate(0, 20px)' },
                  '75%': { transform: 'translate(10px, 10px)' },
                  '100%': { transform: 'translate(0, 0)' },
                },
              }}
            />

            {/* Bottom Right Dots Pattern */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '200px',
                height: '200px',
                opacity: 0.2,
                display: { xs: 'none', md: 'block' },
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '15px 15px',
              }}
            />
          </Box>
        </Box>

        {/* Hero Content - Improved Alignment */}
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 5,
            py: { xs: 4, md: 0 },
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            px: { xs: 2, sm: 3, md: 4 }, // Adjust horizontal padding for better mobile display
          }}
        >
          <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center" justifyContent="space-between">
            {/* Left Content */}
            <Grid item xs={12} md={7}>
              <Box sx={{ position: 'relative', maxWidth: { md: '650px' } }}>
                <AnimatedElement
                  animation="fade-up"
                  duration={1000}
                  delay={300}
                  sx={{
                    opacity: titleVisible ? 1 : 0,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-20px',
                      left: '-30px',
                      width: '60px',
                      height: '60px',
                      background: 'radial-gradient(circle, rgba(124,58,237,0.5) 0%, rgba(124,58,237,0) 70%)',
                      borderRadius: '50%',
                      filter: 'blur(10px)',
                      zIndex: -1,
                      display: { xs: 'none', md: 'block' },
                    }
                  }}
                >
                  <GradientText
                    variant="h1"
                    component="h1"
                    gradient="linear-gradient(90deg, #FFFFFF 0%, #E0E7FF 100%)"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                      lineHeight: { xs: 1.1, md: 1.05 },
                      mb: { xs: 3, md: 4 },
                      textShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
                      letterSpacing: '-0.03em',
                      position: 'relative',
                      textAlign: { xs: 'center', sm: 'left' }, // Center text on mobile
                    }}
                  >
                    Your Journey to a{' '}
                    <Box
                      component="span"
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        color: 'transparent',
                        background: 'linear-gradient(90deg, #FFFFFF 0%, #A5B4FC 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: '-8px',
                          left: 0,
                          width: '100%',
                          height: '6px',
                          background: 'linear-gradient(90deg, #0066FF 0%, #5271FF 100%)',
                          borderRadius: '3px',
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 0.8 },
                            '50%': { opacity: 1 },
                            '100%': { opacity: 0.8 },
                          },
                        }
                      }}
                    >
                      New Beginning
                    </Box>
                  </GradientText>
                </AnimatedElement>

                <AnimatedElement
                  animation="fade-up"
                  duration={1000}
                  delay={500}
                  sx={{
                    opacity: subtitleVisible ? 1 : 0,
                    position: 'relative',
                    mb: { xs: 4, md: 5 },
                    maxWidth: '650px',
                    pl: { md: 2 },
                    textAlign: { xs: 'center', sm: 'left' }, // Center text on mobile
                    mx: { xs: 'auto', sm: 0 }, // Center on mobile
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: { xs: '-10px', md: 0 },
                      top: '10px',
                      bottom: '10px',
                      width: '4px',
                      background: 'linear-gradient(180deg, #0066FF 0%, #5271FF 100%)',
                      borderRadius: '4px',
                      display: { xs: 'none', md: 'block' },
                    }
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                      lineHeight: 1.6,
                      color: 'rgba(255, 255, 255, 0.95)',
                      letterSpacing: '0.4px',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    Visafy simplifies your immigration process with personalized roadmaps,
                    document management, and expert guidance every step of the way.
                  </Typography>
                </AnimatedElement>

                <Box sx={{
                  display: 'flex',
                  gap: { xs: 3, md: 3 },
                  flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons on mobile
                  position: 'relative',
                  justifyContent: { xs: 'center', sm: 'flex-start' }, // Center buttons on mobile
                  alignItems: { xs: 'center', sm: 'flex-start' }, // Center buttons on mobile
                  width: '100%',
                  maxWidth: { xs: '90%', sm: '100%' }, // Constrain width on mobile
                  mx: { xs: 'auto', sm: 0 } // Center on mobile
                }}>
                  <Slide direction="up" in={buttonVisible} timeout={500}>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      color="secondary"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => toast.success('Welcome to Visafy!', 'Your journey begins here')}
                      sx={{
                        px: { xs: 4, md: 5 },
                        py: { xs: 1.8, md: 2 },
                        fontSize: { xs: '1.1rem', md: '1.2rem' },
                        fontWeight: 700,
                        borderRadius: '14px',
                        background: 'linear-gradient(45deg, #5271FF 0%, #0066FF 100%)',
                        boxShadow: '0 10px 25px rgba(124, 58, 237, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        position: 'relative',
                        overflow: 'hidden',
                        width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                        minWidth: { xs: '250px', sm: 'auto' }, // Minimum width on mobile
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                          transition: 'all 0.6s ease',
                        },
                        '&:hover': {
                          boxShadow: '0 20px 40px rgba(124, 58, 237, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                          transform: 'translateY(-5px) scale(1.03)',
                          '&::before': {
                            left: '100%',
                          },
                        },
                        '&:active': {
                          transform: 'translateY(-2px) scale(0.98)',
                        }
                      }}
                    >
                      Start Your Journey
                    </Button>
                  </Slide>

                  <Slide direction="up" in={buttonVisible} timeout={700}>
                    <Button
                      component={RouterLink}
                      to="/about"
                      variant="outlined"
                      size="large"
                      sx={{
                        px: { xs: 4, md: 5 },
                        py: { xs: 1.8, md: 2 },
                        fontSize: { xs: '1.1rem', md: '1.2rem' },
                        fontWeight: 600,
                        borderRadius: '14px',
                        borderWidth: '2px',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        position: 'relative',
                        overflow: 'hidden',
                        width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                        minWidth: { xs: '250px', sm: 'auto' }, // Minimum width on mobile
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '0%',
                          background: 'linear-gradient(to top, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
                          transition: 'all 0.4s ease',
                          zIndex: -1,
                        },
                        '&:hover': {
                          borderColor: 'white',
                          background: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                          '&::after': {
                            height: '100%',
                          },
                        },
                        '&:active': {
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </Slide>

                  {/* Decorative element behind buttons */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '-15px',
                      left: '10%',
                      width: '80%',
                      height: '15px',
                      background: 'linear-gradient(90deg, rgba(124,58,237,0.3) 0%, rgba(37,99,235,0.3) 100%)',
                      filter: 'blur(10px)',
                      borderRadius: '50%',
                      zIndex: -1,
                      display: { xs: 'none', md: 'block' },
                    }}
                  />
                </Box>

                <Fade in={iconVisible} timeout={1000}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: { xs: 2, sm: 4 },
                      mt: { xs: 6, md: 7 },
                      alignItems: 'center',
                      justifyContent: 'space-around', // Better spacing on mobile
                      flexWrap: 'wrap',
                      p: { xs: 3, md: 3 },
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.07)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      width: '100%',
                      maxWidth: { xs: '100%', sm: '100%', md: 'fit-content' },
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
                      }
                    }}
                  >
                    {stats.map((stat, index) => (
                      <Box
                        key={stat.label}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1,
                          position: 'relative',
                          p: { xs: 2, md: 1.5 },
                          flex: { xs: '1 0 auto', sm: '0 0 auto' },
                          minWidth: { xs: '30%', sm: 'auto' },
                          // Add subtle hover effect for better interaction
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                          },
                          '&::after': index < stats.length - 1 ? {
                            content: '""',
                            position: 'absolute',
                            right: -16,
                            top: '20%',
                            bottom: '20%',
                            width: '1px',
                            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                            display: { xs: 'none', sm: 'block' }
                          } : {}
                        }}
                      >
                        <Box
                          sx={{
                            color: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: 60, md: 50 }, // Larger on mobile
                            height: { xs: 60, md: 50 }, // Larger on mobile
                            borderRadius: '50%',
                            background: `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.15)`,
                            mb: 1,
                            boxShadow: `0 8px 16px rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.2)`,
                            transition: 'all 0.3s ease',
                            '& svg': {
                              fontSize: { xs: '1.8rem', md: '1.5rem' }, // Larger icons on mobile
                            }
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {stat.prefix && <span>{stat.prefix}</span>}
                          {index === 0 ? countryCount : index === 1 ? successRate : userCount}
                          {stat.suffix && <span>{stat.suffix}</span>}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 500,
                            textAlign: 'center',
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Fade>
              </Box>
            </Grid>

            {/* Right Content - Floating Card with Testimonials - Desktop Version */}
            {!isMobile && (
              <Grid item md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Fade in={loaded} timeout={1500}>
                  <Box
                    sx={{
                      position: 'relative',
                      animation: 'float 6s infinite ease-in-out',
                      willChange: 'transform', // Optimize for animation
                      '@keyframes float': {
                        '0%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-20px)' },
                        '100%': { transform: 'translateY(0px)' },
                      },
                    }}
                  >
                    {/* Decorative elements - Adjusted for better alignment */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-40px',
                        right: '-30px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(124,58,237,0) 70%)',
                        zIndex: 0,
                        transform: 'translateZ(0)', // Force GPU acceleration
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '-50px',
                        left: '-20px',
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(37,99,235,0) 70%)',
                        zIndex: 0,
                        transform: 'translateZ(0)', // Force GPU acceleration
                      }}
                    />

                    {/* Main Card - Improved Alignment */}
                    <Paper
                      elevation={24}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.07)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(124, 58, 237, 0.1)',
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: 1,
                        maxWidth: '450px', // Control maximum width
                        width: '100%', // Ensure it takes full width up to max-width
                        transform: 'translateZ(0)', // Force GPU acceleration
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '6px',
                          background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                        },
                      }}
                    >
                      {/* Top Section */}
                      <Box sx={{ mb: 4, position: 'relative' }}>
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="white"
                          gutterBottom
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&::before': {
                              content: '""',
                              display: 'inline-block',
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                            }
                          }}
                        >
                          Success Stories
                        </Typography>
                        <Typography
                          variant="body2"
                          color="rgba(255, 255, 255, 0.7)"
                          paragraph
                          sx={{
                            maxWidth: '90%',
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: '-10px',
                              left: 0,
                              width: '40px',
                              height: '2px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: '2px',
                            }
                          }}
                        >
                          Hear from people who transformed their lives with Visafy
                        </Typography>
                      </Box>

                      {/* Testimonial Carousel */}
                      <Box sx={{ position: 'relative', mb: 3 }}>
                        {testimonials.map((testimonial, index) => (
                          <Fade
                            key={testimonial.name}
                            in={activeTestimonial === index}
                            timeout={800}
                            style={{
                              display: activeTestimonial === index ? 'block' : 'none',
                              position: 'relative',
                            }}
                          >
                            <Box>
                              {/* Quote Icon */}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: -10,
                                  right: 10,
                                  opacity: 0.2,
                                  transform: 'scale(2)',
                                  color: theme.palette.primary.main,
                                }}
                              >
                                <FormatQuoteIcon />
                              </Box>

                              {/* Testimonial Content */}
                              <Typography
                                variant="body1"
                                color="white"
                                paragraph
                                sx={{
                                  fontStyle: 'italic',
                                  lineHeight: 1.6,
                                  mb: 3,
                                  position: 'relative',
                                  zIndex: 1,
                                }}
                              >
                                "{testimonial.quote}"
                              </Typography>

                              {/* User Info */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  src={testimonial.avatar}
                                  alt={testimonial.name}
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                  }}
                                />
                                <Box>
                                  <Typography variant="subtitle2" color="white" fontWeight={600}>
                                    {testimonial.name}
                                  </Typography>
                                  <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                                    {testimonial.location}
                                  </Typography>
                                  <Rating
                                    value={testimonial.rating}
                                    readOnly
                                    size="small"
                                    sx={{
                                      mt: 0.5,
                                      color: theme.palette.secondary.main,
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </Fade>
                        ))}

                        {/* Navigation Dots */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            mt: 3,
                          }}
                        >
                          {testimonials.map((_, index) => (
                            <Box
                              key={index}
                              onClick={() => setActiveTestimonial(index)}
                              sx={{
                                width: { xs: 10, md: 8 }, // Larger on mobile for better touch targets
                                height: { xs: 10, md: 8 },
                                borderRadius: '50%',
                                background: activeTestimonial === index
                                  ? 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)'
                                  : 'rgba(255, 255, 255, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease', // Faster transition
                                mx: 0.5, // Add margin for better spacing
                                '&:hover': {
                                  transform: { xs: 'none', md: 'scale(1.2)' }, // Disable hover effect on mobile
                                  background: activeTestimonial !== index ? 'rgba(255, 255, 255, 0.5)' : undefined // Simpler hover effect
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* CTA Button */}
                      <Button
                        component={RouterLink}
                        to="/register"
                        variant="contained"
                        fullWidth
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          py: 1.8,
                          borderRadius: 3,
                          background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                          fontWeight: 700,
                          fontSize: '1rem',
                          letterSpacing: '0.5px',
                          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                            transition: 'all 0.6s ease',
                          },
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                            '&::before': {
                              left: '100%',
                            },
                          },
                        }}
                      >
                        Join Thousands of Immigrants
                      </Button>
                    </Paper>
                  </Box>
                </Fade>
              </Grid>
            )}

            {/* Mobile Success Story Card */}
            {isMobile && (
              <Grid item xs={12} sx={{ mt: 6 }}>
                <AnimatedElement animation="fade-up" duration={1000} delay={300}>
                  <GlassCard
                    elevation={8}
                    blur={30}
                    opacity={0.07}
                    borderColor="rgba(255, 255, 255, 0.15)"
                    sx={{
                      p: 4,
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(124, 58, 237, 0.15)',
                      position: 'relative',
                      zIndex: 1,
                      width: '100%',
                      transform: 'translateZ(0)', // Force GPU acceleration
                      mx: 'auto', // Center the card
                      maxWidth: '90%', // Limit width for better readability
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '5px',
                        background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                      },
                    }}
                  >
                    {/* Top Section */}
                    <Box sx={{ mb: 2, position: 'relative' }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="white"
                        gutterBottom
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontSize: '1.1rem',
                          '&::before': {
                            content: '""',
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                          }
                        }}
                      >
                        Success Stories
                      </Typography>
                    </Box>

                    {/* Testimonial Content */}
                    <Typography
                      variant="body2"
                      color="white"
                      paragraph
                      sx={{
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                        mb: 2,
                        fontSize: '0.9rem',
                      }}
                    >
                      "{testimonials[activeTestimonial].quote}"
                    </Typography>

                    {/* User Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar
                        src={testimonials[activeTestimonial].avatar}
                        alt={testimonials[activeTestimonial].name}
                        sx={{
                          width: 40,
                          height: 40,
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle2" color="white" fontWeight={600} fontSize="0.9rem">
                          {testimonials[activeTestimonial].name}
                        </Typography>
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.6)" fontSize="0.8rem">
                          {testimonials[activeTestimonial].location}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Navigation Dots */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      {testimonials.map((_, index) => (
                        <Box
                          key={index}
                          onClick={() => setActiveTestimonial(index)}
                          sx={{
                            width: 10, // Larger for better touch targets
                            height: 10,
                            borderRadius: '50%',
                            background: activeTestimonial === index
                              ? 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)'
                              : 'rgba(255, 255, 255, 0.3)',
                            cursor: 'pointer',
                            mx: 0.5, // Add margin for better spacing
                            transition: 'background-color 0.2s ease', // Simple transition
                            '&:active': { // Use active instead of hover for mobile
                              background: activeTestimonial !== index ? 'rgba(255, 255, 255, 0.5)' : undefined
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </GlassCard>
                </AnimatedElement>
              </Grid>
            )}
          </Grid>
        </Container>

        {/* Scroll Indicator - Optimized */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            opacity: 0.7,
            animation: 'bounce 2s infinite',
            willChange: 'transform', // Optimize for animation
            display: { xs: 'none', md: 'block' }, // Hide on mobile for better performance
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0) translateX(-50%)' },
              '40%': { transform: 'translateY(-20px) translateX(-50%)' },
              '60%': { transform: 'translateY(-10px) translateX(-50%)' },
            },
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 50,
              border: '2px solid white',
              borderRadius: 15,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 10,
                left: '50%',
                width: 6,
                height: 6,
                backgroundColor: 'white',
                borderRadius: '50%',
                transform: 'translateX(-50%)',
                animation: 'scroll 2s infinite',
                willChange: 'opacity, top', // Optimize for animation
                '@keyframes scroll': {
                  '0%': { opacity: 1, top: 10 },
                  '100%': { opacity: 0, top: 30 },
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 12, position: 'relative', overflow: 'hidden' }}>
        {/* Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {/* Animated Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.03,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              animation: 'patternMove 60s linear infinite',
              '@keyframes patternMove': {
                '0%': { backgroundPosition: '0 0' },
                '100%': { backgroundPosition: '100px 100px' },
              },
            }}
          />

          {/* Decorative Circle 1 - Enhanced */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '-5%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.05) 50%, rgba(0,0,0,0) 70%)',
              opacity: 0.7,
              animation: 'pulseAndMove 15s infinite ease-in-out',
              '@keyframes pulseAndMove': {
                '0%': { transform: 'scale(1) translate(0, 0)', opacity: 0.7 },
                '50%': { transform: 'scale(1.1) translate(20px, 20px)', opacity: 0.9 },
                '100%': { transform: 'scale(1) translate(0, 0)', opacity: 0.7 },
              },
            }}
          />

          {/* Decorative Circle 2 - Enhanced */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '5%',
              right: '-10%',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, rgba(37,99,235,0.05) 50%, rgba(0,0,0,0) 70%)',
              opacity: 0.7,
              animation: 'pulseAndMove2 20s infinite ease-in-out',
              '@keyframes pulseAndMove2': {
                '0%': { transform: 'scale(1) translate(0, 0)', opacity: 0.7 },
                '50%': { transform: 'scale(1.05) translate(-20px, -20px)', opacity: 0.9 },
                '100%': { transform: 'scale(1) translate(0, 0)', opacity: 0.7 },
              },
            }}
          />

          {/* Additional Decorative Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '40%',
              left: '10%',
              width: '150px',
              height: '150px',
              opacity: 0.1,
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              animation: 'morphing 15s infinite ease-in-out',
              '@keyframes morphing': {
                '0%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
                '25%': { borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%' },
                '50%': { borderRadius: '30% 30% 70% 70% / 70% 30% 70% 30%' },
                '75%': { borderRadius: '70% 70% 30% 30% / 30% 70% 30% 70%' },
                '100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
              },
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <AnimatedElement animation="fade-down" duration={800} delay={200}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: 'primary.main',
                  mb: 2,
                  display: 'inline-block',
                  position: 'relative',
                  px: 2,
                  py: 0.5,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, rgba(37,99,235,0) 0%, rgba(37,99,235,1) 50%, rgba(37,99,235,0) 100%)',
                  },
                }}
              >
                KEY FEATURES
              </Typography>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" duration={800} delay={300}>
              <GradientText
                variant="h2"
                component="h2"
                gradient="linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                  mb: 3,
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '4px',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                  },
                }}
              >
                Powerful Immigration Tools
              </GradientText>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" duration={800} delay={400}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  maxWidth: '800px',
                  mx: 'auto',
                  fontSize: '1.2rem',
                  lineHeight: 1.6,
                  mt: 4,
                  fontWeight: 400,
                }}
              >
                Discover the comprehensive suite of tools designed to simplify every step of your immigration journey
              </Typography>
            </AnimatedElement>
          </Box>

          {/* Feature Cards */}
          <Grid container spacing={4}>
            {/* Feature Card 1 */}
            <Grid item xs={12} md={4}>
              <AnimatedElement animation="fade-up" duration={800} delay={300} once={true}>
                <GlassCard
                  elevation={0}
                  blur={10}
                  opacity={0.8}
                  borderColor="rgba(0, 0, 0, 0.1)"
                  sx={{
                    p: 4,
                    height: '100%',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: { xs: '0 8px 20px rgba(0, 0, 0, 0.08)', md: 'none' }, // Add subtle shadow on mobile by default
                    '&:hover': {
                      transform: { xs: 'translateY(-8px)', md: 'translateY(-16px) scale(1.02)' }, // Less dramatic on mobile
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      '& .feature-icon': {
                        transform: { xs: 'scale(1.05)', md: 'scale(1.1) rotate(10deg)' }, // Less dramatic on mobile
                        boxShadow: '0 15px 30px rgba(37, 99, 235, 0.3)',
                      },
                      '& .feature-title::after': {
                        width: '80%',
                      },
                    },
                    position: 'relative',
                    overflow: 'hidden',
                  }}
              >
                {/* Background Decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(37,99,235,0) 70%)',
                    zIndex: 0,
                  }}
                />

                {/* Icon */}
                <Box
                  className="feature-icon"
                  sx={{
                    width: { xs: 70, md: 80 }, // Slightly smaller on mobile
                    height: { xs: 70, md: 80 },
                    borderRadius: { xs: '16px', md: '20px' }, // Slightly smaller radius on mobile
                    background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)',
                    mb: 3,
                    position: 'relative',
                    zIndex: 1,
                    transition: 'all 0.3s ease', // Slightly faster transition
                    mx: { xs: 'auto', md: 0 }, // Center on mobile
                  }}
                >
                  <AssessmentIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>

                {/* Content */}
                <Typography
                  variant="h5"
                  component="h3"
                  className="feature-title"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    position: 'relative',
                    display: { xs: 'block', md: 'inline-block' }, // Full width on mobile
                    textAlign: { xs: 'center', md: 'left' }, // Center on mobile
                    zIndex: 1,
                    fontSize: { xs: '1.4rem', md: '1.5rem' }, // Slightly smaller on mobile
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: { xs: '50%', md: 0 }, // Center on mobile
                      transform: { xs: 'translateX(-50%)', md: 'none' }, // Center on mobile
                      width: { xs: '60%', md: '40%' }, // Wider on mobile
                      height: '3px',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)',
                      transition: 'width 0.3s ease',
                    },
                  }}
                >
                  Personalized Assessment
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: 3,
                    lineHeight: 1.7,
                    zIndex: 1,
                    position: 'relative',
                    textAlign: { xs: 'center', md: 'left' }, // Center on mobile
                    px: { xs: 1, md: 0 }, // Add padding on mobile
                    fontSize: { xs: '0.95rem', md: '1rem' }, // Slightly smaller on mobile
                  }}
                >
                  Our comprehensive assessment analyzes your background, goals, and circumstances to identify the best immigration pathways for your unique situation.
                </Typography>

                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  mb: 3,
                  alignItems: { xs: 'center', md: 'flex-start' }, // Center on mobile
                  width: '100%',
                }}>
                  {['Customized recommendations', 'Multiple program eligibility', 'Challenge identification'].map((benefit, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        width: { xs: '90%', md: '100%' }, // Constrain width on mobile
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: { xs: 28, md: 24 }, // Larger on mobile for better touch targets
                          height: { xs: 28, md: 24 },
                          borderRadius: '50%',
                          background: 'rgba(37, 99, 235, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)', // Add subtle shadow
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: { xs: 18, md: 16 }, color: '#2563EB' }} />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.9rem', md: '0.875rem' }, // Adjust font size
                        }}
                      >
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  component={RouterLink}
                  to="/assessment"
                  variant="text"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', md: '0.875rem' }, // Larger on mobile
                    py: { xs: 1, md: 0.5 }, // More padding on mobile
                    px: { xs: 2, md: 1 }, // More padding on mobile
                    mx: { xs: 'auto', md: 0 }, // Center on mobile
                    display: 'block', // Make it block to respect the mx: auto
                    '&:hover': {
                      background: 'rgba(37, 99, 235, 0.05)',
                      transform: 'translateX(5px)',
                    },
                    transition: 'transform 0.3s ease',
                  }}
                >
                  Try Assessment →
                </Button>
              </GlassCard>
            </AnimatedElement>
            </Grid>

            {/* Feature Card 2 */}
            <Grid item xs={12} md={4}>
              <AnimatedElement animation="fade-up" duration={800} delay={400} once={true}>
                <GlassCard
                  elevation={0}
                  blur={10}
                  opacity={0.8}
                  borderColor="rgba(0, 0, 0, 0.1)"
                  sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    transform: 'translateY(-16px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    '& .feature-icon': {
                      transform: 'scale(1.1) rotate(10deg)',
                      boxShadow: '0 15px 30px rgba(124, 58, 237, 0.3)',
                    },
                    '& .feature-title::after': {
                      width: '80%',
                    },
                  },
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background Decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, rgba(124,58,237,0) 70%)',
                    zIndex: 0,
                  }}
                />

                {/* Icon */}
                <Box
                  className="feature-icon"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)',
                    mb: 3,
                    position: 'relative',
                    zIndex: 1,
                    transition: 'all 0.4s ease',
                  }}
                >
                  <MapIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>

                {/* Content */}
                <Typography
                  variant="h5"
                  component="h3"
                  className="feature-title"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    position: 'relative',
                    display: 'inline-block',
                    zIndex: 1,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      width: '40%',
                      height: '3px',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)',
                      transition: 'width 0.3s ease',
                    },
                  }}
                >
                  Interactive Roadmaps
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, zIndex: 1, position: 'relative' }}>
                  Receive a step-by-step visual guide to your immigration journey, with clear timelines, requirements, and actionable tasks.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                  {['Visual process timeline', 'Interactive milestones', 'Automatic updates'].map((benefit, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          minWidth: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'rgba(124, 58, 237, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 16, color: '#7C3AED' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  component={RouterLink}
                  to="/roadmap"
                  variant="text"
                  color="secondary"
                  sx={{
                    fontWeight: 600,
                    '&:hover': {
                      background: 'rgba(124, 58, 237, 0.05)',
                      transform: 'translateX(5px)',
                    },
                    transition: 'transform 0.3s ease',
                  }}
                >
                  View Sample →
                </Button>
              </GlassCard>
            </AnimatedElement>
            </Grid>

            {/* Feature Card 3 */}
            <Grid item xs={12} md={4}>
              <AnimatedElement animation="fade-up" duration={800} delay={500} once={true}>
                <GlassCard
                  elevation={0}
                  blur={10}
                  opacity={0.8}
                  borderColor="rgba(0, 0, 0, 0.1)"
                  sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    transform: 'translateY(-16px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    '& .feature-icon': {
                      transform: 'scale(1.1) rotate(10deg)',
                      boxShadow: '0 15px 30px rgba(236, 72, 153, 0.3)',
                    },
                    '& .feature-title::after': {
                      width: '80%',
                    },
                  },
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background Decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0) 70%)',
                    zIndex: 0,
                  }}
                />

                {/* Icon */}
                <Box
                  className="feature-icon"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px rgba(236, 72, 153, 0.2)',
                    mb: 3,
                    position: 'relative',
                    zIndex: 1,
                    transition: 'all 0.4s ease',
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>

                {/* Content */}
                <Typography
                  variant="h5"
                  component="h3"
                  className="feature-title"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    position: 'relative',
                    display: 'inline-block',
                    zIndex: 1,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      width: '40%',
                      height: '3px',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg, #EC4899 0%, #F472B6 100%)',
                      transition: 'width 0.3s ease',
                    },
                  }}
                >
                  Document Management
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, zIndex: 1, position: 'relative' }}>
                  Securely store, organize, and manage all your immigration documents in one centralized location.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                  {['Secure cloud storage', 'Document checklists', 'Expiration reminders'].map((benefit, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          minWidth: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'rgba(236, 72, 153, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 16, color: '#EC4899' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  component={RouterLink}
                  to="/documents"
                  variant="text"
                  sx={{
                    fontWeight: 600,
                    color: '#EC4899',
                    '&:hover': {
                      background: 'rgba(236, 72, 153, 0.05)',
                      transform: 'translateX(5px)',
                    },
                    transition: 'transform 0.3s ease',
                  }}
                >
                  Explore Documents →
                </Button>
              </GlassCard>
            </AnimatedElement>
            </Grid>
          </Grid>

          {/* Process Steps Section Header */}
          <Box id="how-it-works" sx={{ textAlign: 'center', mt: 16, mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 700,
                letterSpacing: 2,
                color: 'primary.main',
                mb: 2,
                display: 'inline-block',
                position: 'relative',
                px: 2,
                py: 0.5,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, rgba(37,99,235,0) 0%, rgba(37,99,235,1) 50%, rgba(37,99,235,0) 100%)',
                },
              }}
            >
              SIMPLE PROCESS
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                },
              }}
            >
              How Visafy Works
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                fontSize: '1.2rem',
                lineHeight: 1.6,
                mt: 4,
                fontWeight: 400,
              }}
            >
              Our streamlined process makes immigration planning simple, organized, and stress-free
            </Typography>
          </Box>

          {/* Process Steps */}
          <Box sx={{ position: 'relative', mt: 10 }}>
            {/* Animated Connecting Line */}
            <Box
              sx={{
                position: 'absolute',
                top: '120px',
                left: '50px',
                right: '50px',
                height: '6px',
                background: 'linear-gradient(90deg, rgba(37,99,235,0.2) 0%, rgba(124,58,237,0.2) 50%, rgba(192,38,211,0.2) 100%)',
                display: { xs: 'none', md: 'block' },
                zIndex: 0,
                borderRadius: '6px',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '0%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 50%, #C026D3 100%)',
                  borderRadius: '6px',
                  animation: 'lineProgress 3s forwards ease-out',
                  '@keyframes lineProgress': {
                    '0%': { width: '0%' },
                    '100%': { width: '100%' },
                  },
                  boxShadow: '0 0 10px rgba(124, 58, 237, 0.5)',
                },
              }}
            />

            <Grid container spacing={4} position="relative" zIndex={1}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Step Number - Enhanced with Pulse Animation - Mobile Optimized */}
                  <Box
                    sx={{
                      width: { xs: 90, md: 120 }, // Smaller on mobile
                      height: { xs: 90, md: 120 }, // Smaller on mobile
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 15px 30px rgba(37, 99, 235, 0.3)',
                      mb: { xs: 3, md: 4 }, // Less margin on mobile
                      position: 'relative',
                      zIndex: 2,
                      animation: { xs: 'none', md: 'pulse 3s infinite' }, // Disable animation on mobile for better performance
                      '@keyframes pulse': {
                        '0%': { boxShadow: '0 15px 30px rgba(37, 99, 235, 0.3)' },
                        '50%': { boxShadow: '0 15px 30px rgba(37, 99, 235, 0.5)' },
                        '100%': { boxShadow: '0 15px 30px rgba(37, 99, 235, 0.3)' },
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -10,
                        left: -10,
                        right: -10,
                        bottom: -10,
                        borderRadius: '50%',
                        background: 'rgba(37, 99, 235, 0.1)',
                        zIndex: -1,
                        animation: { xs: 'none', md: 'ripple 3s infinite' }, // Disable on mobile
                        display: { xs: 'none', md: 'block' }, // Hide on mobile
                        '@keyframes ripple': {
                          '0%': { transform: 'scale(1)', opacity: 1 },
                          '100%': { transform: 'scale(1.3)', opacity: 0 },
                        },
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: -5,
                        left: -5,
                        right: -5,
                        bottom: -5,
                        borderRadius: '50%',
                        background: 'rgba(37, 99, 235, 0.15)',
                        zIndex: -1,
                        animation: { xs: 'none', md: 'ripple 3s infinite 1s' }, // Disable on mobile
                        display: { xs: 'none', md: 'block' }, // Hide on mobile
                      },
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        color: 'white',
                        fontWeight: 800,
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                        fontSize: { xs: '2.5rem', md: '3.75rem' }, // Smaller on mobile
                      }}
                    >
                      1
                    </Typography>
                  </Box>

                  {/* Content Card - Enhanced with 3D Effects */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 4 }, // Less padding on mobile
                      borderRadius: 4,
                      width: '100%',
                      flexGrow: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      boxShadow: { xs: '0 10px 20px rgba(0, 0, 0, 0.08)', md: 'none' }, // Add subtle shadow on mobile by default
                      '&:hover': {
                        transform: { xs: 'translateY(-8px)', md: 'translateY(-12px) rotateX(5deg)' }, // Less dramatic on mobile
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 15px 12px rgba(0, 0, 0, 0.05)',
                        '& .card-icon': {
                          transform: { xs: 'scale(1.1)', md: 'rotate(10deg) scale(1.2)' }, // Less dramatic on mobile
                          color: '#2563EB',
                        },
                        '& .card-title': {
                          color: '#2563EB',
                        },
                        '& .card-button': {
                          transform: 'translateX(5px)',
                        },
                      },
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '6px',
                        background: 'linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)',
                      },
                    }}
                  >
                    {/* Card Icon */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3,
                      flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile
                      textAlign: { xs: 'center', md: 'left' }, // Center on mobile
                    }}>
                      <AssessmentIcon
                        className="card-icon"
                        sx={{
                          fontSize: { xs: 40, md: 36 }, // Larger on mobile
                          color: '#64748B',
                          mr: { xs: 0, md: 2 }, // No margin on mobile
                          mb: { xs: 2, md: 0 }, // Add bottom margin on mobile
                          transition: 'all 0.4s ease',
                        }}
                      />
                      <Typography
                        variant="h5"
                        component="h3"
                        className="card-title"
                        sx={{
                          fontWeight: 700,
                          transition: 'color 0.3s ease',
                          fontSize: { xs: '1.3rem', md: '1.5rem' }, // Smaller on mobile
                        }}
                      >
                        Take the Assessment
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.7,
                        mb: 3,
                        textAlign: { xs: 'center', md: 'left' }, // Center on mobile
                        fontSize: { xs: '0.95rem', md: '1rem' }, // Slightly smaller on mobile
                      }}
                    >
                      Answer questions about your background, goals, and circumstances to help us
                      understand your unique situation and immigration needs.
                    </Typography>

                    {/* Feature List */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      mb: 3,
                      alignItems: { xs: 'center', md: 'flex-start' }, // Center on mobile
                    }}>
                      {['Personalized recommendations', 'Quick and easy process', 'Immediate results'].map((feature, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            width: { xs: '90%', md: '100%' }, // Constrain width on mobile
                          }}
                        >
                          <Box
                            sx={{
                              minWidth: { xs: 28, md: 24 }, // Larger on mobile for better touch targets
                              height: { xs: 28, md: 24 },
                              borderRadius: '50%',
                              background: 'rgba(37, 99, 235, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)', // Add subtle shadow
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: { xs: 18, md: 16 }, color: '#2563EB' }} />
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: '0.9rem', md: '0.875rem' }, // Adjust font size
                            }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      justifyContent: { xs: 'center', md: 'flex-end' } // Center on mobile
                    }}>
                      <Button
                        component={RouterLink}
                        to="/assessment"
                        variant="text"
                        color="primary"
                        className="card-button"
                        sx={{
                          fontWeight: 600,
                          transition: 'transform 0.3s ease',
                          fontSize: { xs: '0.95rem', md: '0.875rem' }, // Larger on mobile
                          py: { xs: 1, md: 0.5 }, // More padding on mobile
                          px: { xs: 2, md: 1 }, // More padding on mobile
                          '&:hover': {
                            background: 'rgba(37, 99, 235, 0.05)',
                          },
                        }}
                      >
                        Start Assessment →
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Step Number - Enhanced with Pulse Animation */}
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 15px 30px rgba(79, 70, 229, 0.3)',
                      mb: 4,
                      position: 'relative',
                      zIndex: 2,
                      animation: 'pulse2 3s infinite',
                      '@keyframes pulse2': {
                        '0%': { boxShadow: '0 15px 30px rgba(79, 70, 229, 0.3)' },
                        '50%': { boxShadow: '0 15px 30px rgba(79, 70, 229, 0.5)' },
                        '100%': { boxShadow: '0 15px 30px rgba(79, 70, 229, 0.3)' },
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -10,
                        left: -10,
                        right: -10,
                        bottom: -10,
                        borderRadius: '50%',
                        background: 'rgba(79, 70, 229, 0.1)',
                        zIndex: -1,
                        animation: 'ripple2 3s infinite',
                        '@keyframes ripple2': {
                          '0%': { transform: 'scale(1)', opacity: 1 },
                          '100%': { transform: 'scale(1.3)', opacity: 0 },
                        },
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: -5,
                        left: -5,
                        right: -5,
                        bottom: -5,
                        borderRadius: '50%',
                        background: 'rgba(79, 70, 229, 0.15)',
                        zIndex: -1,
                        animation: 'ripple2 3s infinite 1s',
                      },
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        color: 'white',
                        fontWeight: 800,
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      2
                    </Typography>
                  </Box>

                  {/* Content Card - Enhanced with 3D Effects */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      width: '100%',
                      flexGrow: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        transform: 'translateY(-12px) rotateX(5deg)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 15px 12px rgba(0, 0, 0, 0.05)',
                        '& .card-icon': {
                          transform: 'rotate(10deg) scale(1.2)',
                          color: '#7C3AED',
                        },
                        '& .card-title': {
                          color: '#7C3AED',
                        },
                        '& .card-button': {
                          transform: 'translateX(5px)',
                        },
                      },
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '6px',
                        background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                      },
                    }}
                  >
                    {/* Card Icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <MapIcon
                        className="card-icon"
                        sx={{
                          fontSize: 36,
                          color: '#64748B',
                          mr: 2,
                          transition: 'all 0.4s ease',
                        }}
                      />
                      <Typography
                        variant="h5"
                        component="h3"
                        className="card-title"
                        sx={{
                          fontWeight: 700,
                          transition: 'color 0.3s ease',
                        }}
                      >
                        Get Your Roadmap
                      </Typography>
                    </Box>

                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                      Receive a personalized immigration roadmap with step-by-step guidance tailored to
                      your specific situation and destination country.
                    </Typography>

                    {/* Feature List */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                      {['Visual timeline', 'Custom milestones', 'Progress tracking'].map((feature, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              minWidth: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: 'rgba(124, 58, 237, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 16, color: '#7C3AED' }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        component={RouterLink}
                        to="/roadmap"
                        variant="text"
                        color="secondary"
                        className="card-button"
                        sx={{
                          fontWeight: 600,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            background: 'rgba(124, 58, 237, 0.05)',
                          },
                        }}
                      >
                        View Sample →
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Step Number - Enhanced with Pulse Animation */}
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 15px 30px rgba(124, 58, 237, 0.3)',
                      mb: 4,
                      position: 'relative',
                      zIndex: 2,
                      animation: 'pulse3 3s infinite',
                      '@keyframes pulse3': {
                        '0%': { boxShadow: '0 15px 30px rgba(124, 58, 237, 0.3)' },
                        '50%': { boxShadow: '0 15px 30px rgba(124, 58, 237, 0.5)' },
                        '100%': { boxShadow: '0 15px 30px rgba(124, 58, 237, 0.3)' },
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -10,
                        left: -10,
                        right: -10,
                        bottom: -10,
                        borderRadius: '50%',
                        background: 'rgba(124, 58, 237, 0.1)',
                        zIndex: -1,
                        animation: 'ripple3 3s infinite',
                        '@keyframes ripple3': {
                          '0%': { transform: 'scale(1)', opacity: 1 },
                          '100%': { transform: 'scale(1.3)', opacity: 0 },
                        },
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: -5,
                        left: -5,
                        right: -5,
                        bottom: -5,
                        borderRadius: '50%',
                        background: 'rgba(124, 58, 237, 0.15)',
                        zIndex: -1,
                        animation: 'ripple3 3s infinite 1s',
                      },
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        color: 'white',
                        fontWeight: 800,
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      3
                    </Typography>
                  </Box>

                  {/* Content Card - Enhanced with 3D Effects */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      width: '100%',
                      flexGrow: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        transform: 'translateY(-12px) rotateX(5deg)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 15px 12px rgba(0, 0, 0, 0.05)',
                        '& .card-icon': {
                          transform: 'rotate(10deg) scale(1.2)',
                          color: '#C026D3',
                        },
                        '& .card-title': {
                          color: '#C026D3',
                        },
                        '& .card-button': {
                          transform: 'translateX(5px)',
                        },
                      },
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '6px',
                        background: 'linear-gradient(90deg, #7C3AED 0%, #C026D3 100%)',
                      },
                    }}
                  >
                    {/* Card Icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <NotificationsIcon
                        className="card-icon"
                        sx={{
                          fontSize: 36,
                          color: '#64748B',
                          mr: 2,
                          transition: 'all 0.4s ease',
                        }}
                      />
                      <Typography
                        variant="h5"
                        component="h3"
                        className="card-title"
                        sx={{
                          fontWeight: 700,
                          transition: 'color 0.3s ease',
                        }}
                      >
                        Track Your Progress
                      </Typography>
                    </Box>

                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                      Manage documents, track application progress, and stay on top of deadlines with our
                      intuitive dashboard and timely reminders.
                    </Typography>

                    {/* Feature List */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                      {['Document management', 'Deadline reminders', 'Status updates'].map((feature, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              minWidth: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: 'rgba(192, 38, 211, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 16, color: '#C026D3' }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        component={RouterLink}
                        to="/dashboard"
                        variant="text"
                        sx={{
                          fontWeight: 600,
                          color: '#C026D3',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            background: 'rgba(192, 38, 211, 0.05)',
                          },
                        }}
                        className="card-button"
                      >
                        See Dashboard →
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Call to Action - Enhanced */}
      <Box
        sx={{
          py: { xs: 12, md: 20 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Enhanced Background with Multiple Animated Layers */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(82, 113, 255, 0.97) 0%, rgba(0, 102, 255, 0.97) 100%)',
            zIndex: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              right: '-50%',
              bottom: '-50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
              animation: 'ctaPulse 15s infinite ease-in-out',
              '@keyframes ctaPulse': {
                '0%': { transform: 'scale(1)', opacity: 0.5 },
                '50%': { transform: 'scale(1.5)', opacity: 0.8 },
                '100%': { transform: 'scale(1)', opacity: 0.5 },
              },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px',
              opacity: 0.1,
              zIndex: 1,
              animation: 'patternMove 60s linear infinite',
            },
          }}
        />

        {/* Additional Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            overflow: 'hidden',
            opacity: 0.4,
          }}
        >
          {/* Animated Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
              animation: 'gradientMove 8s ease-in-out infinite',
              '@keyframes gradientMove': {
                '0%': { opacity: 0.1 },
                '50%': { opacity: 0.3 },
                '100%': { opacity: 0.1 },
              },
            }}
          />

          {/* Light Beams */}
          <Box
            sx={{
              position: 'absolute',
              top: '-50%',
              left: '20%',
              width: '150px',
              height: '300%',
              background: 'linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0))',
              transform: 'rotate(35deg)',
              animation: 'lightBeam 10s ease-in-out infinite',
              '@keyframes lightBeam': {
                '0%': { transform: 'rotate(35deg) translateX(-30vw)', opacity: 0 },
                '30%': { opacity: 0.2 },
                '70%': { opacity: 0.2 },
                '100%': { transform: 'rotate(35deg) translateX(30vw)', opacity: 0 },
              },
              display: { xs: 'none', md: 'block' },
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              top: '-50%',
              right: '30%',
              width: '100px',
              height: '300%',
              background: 'linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0))',
              transform: 'rotate(-35deg)',
              animation: 'lightBeam2 15s ease-in-out infinite 2s',
              '@keyframes lightBeam2': {
                '0%': { transform: 'rotate(-35deg) translateX(30vw)', opacity: 0 },
                '30%': { opacity: 0.15 },
                '70%': { opacity: 0.15 },
                '100%': { transform: 'rotate(-35deg) translateX(-30vw)', opacity: 0 },
              },
              display: { xs: 'none', md: 'block' },
            }}
          />
        </Box>

        {/* Floating Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '5%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1,
            animation: 'float1 8s infinite ease-in-out',
            '@keyframes float1': {
              '0%': { transform: 'translate(0, 0)' },
              '50%': { transform: 'translate(20px, -30px)' },
              '100%': { transform: 'translate(0, 0)' },
            },
            display: { xs: 'none', md: 'block' },
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1,
            animation: 'float2 12s infinite ease-in-out',
            '@keyframes float2': {
              '0%': { transform: 'translate(0, 0)' },
              '50%': { transform: 'translate(-30px, 20px)' },
              '100%': { transform: 'translate(0, 0)' },
            },
            display: { xs: 'none', md: 'block' },
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
                {/* Enhanced Headline with Accent */}
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      letterSpacing: 2,
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 1,
                      display: { xs: 'none', md: 'inline-block' },
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        width: '40px',
                        height: '3px',
                        background: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '3px',
                      },
                    }}
                  >
                    YOUR FUTURE AWAITS
                  </Typography>
                </Box>

                <Typography
                  variant="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.8rem', md: '4rem' },
                    textShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -10,
                      left: { xs: 'calc(50% - 40px)', md: 0 },
                      width: '80px',
                      height: '4px',
                      background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 100%)',
                      borderRadius: '4px',
                    },
                  }}
                >
                  Ready to Start Your Immigration Journey?
                </Typography>

                <Typography
                  variant="h5"
                  paragraph
                  sx={{
                    mb: 5,
                    opacity: 0.95,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    maxWidth: { md: '600px' },
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    pl: { md: 2 },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: { xs: 'calc(50% - 25px)', md: 0 },
                      top: { xs: -10, md: '10px' },
                      bottom: { md: '10px' },
                      width: { xs: '50px', md: '4px' },
                      height: { xs: '4px', md: 'auto' },
                      background: {
                        xs: 'rgba(255, 255, 255, 0.3)',
                        md: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)'
                      },
                      borderRadius: '4px',
                      display: { xs: 'none', md: 'block' },
                    },
                  }}
                >
                  Join thousands of successful immigrants who have used Visafy to simplify their path to a new life abroad.
                </Typography>

                {/* Statistics Row */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 3, md: 5 },
                    mb: 5,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    flexWrap: 'wrap',
                  }}
                >
                  {[
                    { value: '150+', label: 'Countries' },
                    { value: '10K+', label: 'Users' },
                    { value: '98%', label: 'Success Rate' }
                  ].map((stat, index) => (
                    <Box
                      key={index}
                      sx={{
                        textAlign: 'center',
                        position: 'relative',
                        '&::after': index < 2 ? {
                          content: '""',
                          position: 'absolute',
                          right: { xs: -16, md: -24 },
                          top: '20%',
                          bottom: '20%',
                          width: '1px',
                          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
                          display: { xs: 'none', md: 'block' }
                        } : {}
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: 'white',
                          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: 500,
                          letterSpacing: 1,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Enhanced CTA Buttons */}
                <Box sx={{
                  mt: 5,
                  display: 'flex',
                  gap: 3,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  position: 'relative',
                }}>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.dark',
                      px: 5,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      borderRadius: '14px',
                      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                        transition: 'all 0.6s ease',
                      },
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-5px) scale(1.03)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
                        '&::before': {
                          left: '100%',
                        },
                      },
                      '&:active': {
                        transform: 'translateY(-2px) scale(0.98)',
                      }
                    }}
                  >
                    Create Free Account
                  </Button>

                  <Button
                    component={RouterLink}
                    to="/features"
                    variant="outlined"
                    size="large"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      borderWidth: '2px',
                      px: 5,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      borderRadius: '14px',
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '0%',
                        background: 'linear-gradient(to top, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                        transition: 'all 0.4s ease',
                        zIndex: -1,
                      },
                      '&:hover': {
                        borderColor: 'white',
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                        '&::after': {
                          height: '100%',
                        },
                      },
                      '&:active': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Learn More
                  </Button>

                  {/* Decorative element behind buttons */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '-15px',
                      left: { xs: '10%', md: '5%' },
                      width: { xs: '80%', md: '90%' },
                      height: '15px',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                      filter: 'blur(10px)',
                      borderRadius: '50%',
                      zIndex: -1,
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Paper
                elevation={24}
                sx={{
                  p: 5,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'float3 8s infinite ease-in-out',
                  '@keyframes float3': {
                    '0%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-15px) rotate(1deg)' },
                    '100%': { transform: 'translateY(0px) rotate(0deg)' },
                  },
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(124, 58, 237, 0.2)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: 'linear-gradient(90deg, rgba(37,99,235,0.8) 0%, rgba(124,58,237,0.8) 100%)',
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                  },
                }}
              >
                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '10%',
                    right: '10%',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '10%',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: 0,
                  }}
                />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  {/* Header with Icon */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <FormatQuoteIcon
                      sx={{
                        fontSize: 28,
                        color: 'rgba(255, 255, 255, 0.6)',
                        mr: 1.5,
                        transform: 'rotate(180deg)',
                      }}
                    />
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{
                        background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Success Stories
                    </Typography>
                  </Box>

                  {/* Testimonial Content */}
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      fontStyle: 'italic',
                      opacity: 0.95,
                      lineHeight: 1.7,
                      fontSize: '1.1rem',
                      position: 'relative',
                      pl: 2,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '10%',
                        bottom: '10%',
                        width: '3px',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)',
                        borderRadius: '3px',
                      },
                    }}
                  >
                    "Visafy simplified my entire immigration process. The personalized roadmap was exactly what I needed to navigate the complex requirements for moving to Canada."
                  </Typography>

                  {/* User Info with Avatar */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.05)',
                      p: 2,
                      borderRadius: 3,
                      backdropFilter: 'blur(5px)',
                    }}
                  >
                    <Avatar
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Maria Rodriguez"
                      sx={{
                        width: { xs: 50, md: 60 }, // Smaller on mobile
                        height: { xs: 50, md: 60 },
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{
                          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        Maria Rodriguez
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', mr: 0.5 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            opacity: 0.8,
                            fontWeight: 500,
                          }}
                        >
                          Successfully immigrated to Canada
                        </Typography>
                      </Box>
                      <Rating
                        value={5}
                        readOnly
                        size="small"
                        sx={{
                          mt: 0.5,
                          color: '#FFD700',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Large Quote Mark */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -20,
                    fontSize: '10rem',
                    opacity: 0.1,
                    fontFamily: 'serif',
                    fontWeight: 900,
                    color: 'white',
                    zIndex: 0,
                  }}
                >
                  "
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

      {/* World Map Visualization Section */}
      <Box
        id="map"
        sx={{
          py: { xs: 12, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          background: '#f8fafc',
        }}
      >
        {/* Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            overflow: 'hidden',
            opacity: 0.5,
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563EB' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Decorative Circles */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(37,99,235,0) 70%)',
              animation: 'pulse4 15s infinite ease-in-out',
              '@keyframes pulse4': {
                '0%': { transform: 'scale(1)', opacity: 0.5 },
                '50%': { transform: 'scale(1.2)', opacity: 0.8 },
                '100%': { transform: 'scale(1)', opacity: 0.5 },
              },
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              right: '5%',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, rgba(124,58,237,0) 70%)',
              animation: 'pulse5 12s infinite ease-in-out',
              '@keyframes pulse5': {
                '0%': { transform: 'scale(1)', opacity: 0.5 },
                '50%': { transform: 'scale(1.2)', opacity: 0.8 },
                '100%': { transform: 'scale(1)', opacity: 0.5 },
              },
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 700,
                letterSpacing: 2,
                color: 'primary.main',
                mb: 2,
                display: 'inline-block',
                position: 'relative',
                px: 2,
                py: 0.5,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, rgba(37,99,235,0) 0%, rgba(37,99,235,1) 50%, rgba(37,99,235,0) 100%)',
                },
              }}
            >
              GLOBAL REACH
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg, #0066FF 0%, #5271FF 100%)',
                },
              }}
            >
              Immigration Pathways Worldwide
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                fontSize: '1.2rem',
                lineHeight: 1.6,
                mt: 4,
                fontWeight: 400,
              }}
            >
              Explore popular immigration routes and discover opportunities across the globe
            </Typography>
          </Box>

          {/* World Map Visualization */}
          <Box
            data-testid="world-map-visualization"
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '300px', md: '500px' },
              my: 5,
              mx: 'auto',
              maxWidth: '1000px',
            }}
          >
            <ResponsiveImage
              src="/assets/world-map-dots.svg"
              mobileSrc="/assets/images/optimized/world-map-dots-mobile.svg"
              alt="World map visualization"
              objectFit="contain"
              sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            {/* Connection Lines */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1000 500"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
              }}
            >
              {/* US to Canada */}
              <path
                d="M250,170 C270,120 280,120 300,130"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="2"
                strokeDasharray="5,5"
                style={{
                  animation: 'dashMove 30s linear infinite',
                }}
              />

              {/* UK to Australia */}
              <path
                d="M470,150 C600,300 700,350 800,280"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="2"
                strokeDasharray="5,5"
                style={{
                  animation: 'dashMove 40s linear infinite',
                }}
              />

              {/* India to Canada */}
              <path
                d="M650,200 C500,100 350,100 300,130"
                fill="none"
                stroke="url(#gradient3)"
                strokeWidth="2"
                strokeDasharray="5,5"
                style={{
                  animation: 'dashMove 35s linear infinite',
                }}
              />

              {/* China to US */}
              <path
                d="M750,180 C500,250 300,200 250,170"
                fill="none"
                stroke="url(#gradient4)"
                strokeWidth="2"
                strokeDasharray="5,5"
                style={{
                  animation: 'dashMove 45s linear infinite',
                }}
              />

              {/* Gradients for paths */}
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0066FF" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#5271FF" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3D5AFE" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#8C9EFF" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#F472B6" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              <style>
                {`
                  @keyframes dashMove {
                    to {
                      stroke-dashoffset: 100;
                    }
                  }
                `}
              </style>
            </svg>

            {/* Country Markers */}
            <Box
              sx={{
                position: 'absolute',
                top: { xs: '34%', md: '34%' },
                left: { xs: '25%', md: '25%' },
                width: { xs: 12, md: 16 },
                height: { xs: 12, md: 16 },
                borderRadius: '50%',
                background: '#0066FF',
                boxShadow: '0 0 0 rgba(37, 99, 235, 0.4)',
                animation: 'pulse6 2s infinite',
                '@keyframes pulse6': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.4)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(37, 99, 235, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(37, 99, 235, 0)',
                  },
                },
                '&::after': {
                  content: '"USA"',
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#1E40AF',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  whiteSpace: 'nowrap',
                },
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: { xs: '26%', md: '26%' },
                left: { xs: '30%', md: '30%' },
                width: { xs: 12, md: 16 },
                height: { xs: 12, md: 16 },
                borderRadius: '50%',
                background: '#5271FF',
                boxShadow: '0 0 0 rgba(96, 165, 250, 0.4)',
                animation: 'pulse7 2s infinite',
                '@keyframes pulse7': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(96, 165, 250, 0.4)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(96, 165, 250, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(96, 165, 250, 0)',
                  },
                },
                '&::after': {
                  content: '"Canada"',
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#1E40AF',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  whiteSpace: 'nowrap',
                },
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: { xs: '30%', md: '30%' },
                left: { xs: '47%', md: '47%' },
                width: { xs: 12, md: 16 },
                height: { xs: 12, md: 16 },
                borderRadius: '50%',
                background: '#3D5AFE',
                boxShadow: '0 0 0 rgba(124, 58, 237, 0.4)',
                animation: 'pulse8 2s infinite',
                '@keyframes pulse8': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(124, 58, 237, 0.4)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(124, 58, 237, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(124, 58, 237, 0)',
                  },
                },
                '&::after': {
                  content: '"UK"',
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#5B21B6',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  whiteSpace: 'nowrap',
                },
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: { xs: '40%', md: '40%' },
                left: { xs: '65%', md: '65%' },
                width: { xs: 12, md: 16 },
                height: { xs: 12, md: 16 },
                borderRadius: '50%',
                background: '#EC4899',
                boxShadow: '0 0 0 rgba(236, 72, 153, 0.4)',
                animation: 'pulse9 2s infinite',
                '@keyframes pulse9': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(236, 72, 153, 0.4)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(236, 72, 153, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(236, 72, 153, 0)',
                  },
                },
                '&::after': {
                  content: '"India"',
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#BE185D',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  whiteSpace: 'nowrap',
                },
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: { xs: '36%', md: '36%' },
                left: { xs: '75%', md: '75%' },
                width: { xs: 12, md: 16 },
                height: { xs: 12, md: 16 },
                borderRadius: '50%',
                background: '#F59E0B',
                boxShadow: '0 0 0 rgba(245, 158, 11, 0.4)',
                animation: 'pulse10 2s infinite',
                '@keyframes pulse10': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.4)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(245, 158, 11, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(245, 158, 11, 0)',
                  },
                },
                '&::after': {
                  content: '"China"',
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#B45309',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  whiteSpace: 'nowrap',
                },
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: { xs: '56%', md: '56%' },
                left: { xs: '80%', md: '80%' },
                width: { xs: 12, md: 16 },
                height: { xs: 12, md: 16 },
                borderRadius: '50%',
                background: '#A78BFA',
                boxShadow: '0 0 0 rgba(167, 139, 250, 0.4)',
                animation: 'pulse11 2s infinite',
                '@keyframes pulse11': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(167, 139, 250, 0.4)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(167, 139, 250, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(167, 139, 250, 0)',
                  },
                },
                '&::after': {
                  content: '"Australia"',
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#6D28D9',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  whiteSpace: 'nowrap',
                },
              }}
            />
          </Box>

          {/* Popular Destinations */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom color="primary.main">
                  Top Destination Countries
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {['Canada', 'Australia', 'United States', 'United Kingdom', 'Germany'].map((country, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        mb: 1.5,
                        color: 'text.secondary',
                        '&::marker': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {country}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    borderColor: 'secondary.main',
                  },
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom color="secondary.main">
                  Popular Visa Types
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {['Skilled Worker', 'Family Sponsorship', 'Student Visa', 'Investor Visa', 'Refugee/Asylum'].map((visa, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        mb: 1.5,
                        color: 'text.secondary',
                        '&::marker': {
                          color: 'secondary.main',
                        },
                      }}
                    >
                      {visa}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    borderColor: '#EC4899',
                  },
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#EC4899' }}>
                  In-Demand Skills
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {['Healthcare Professionals', 'IT & Software Development', 'Engineering', 'Education', 'Skilled Trades'].map((skill, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        mb: 1.5,
                        color: 'text.secondary',
                        '&::marker': {
                          color: '#EC4899',
                        },
                      }}
                    >
                      {skill}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* FAQ Section - Mobile Optimized */}
      <Box
        id="faq"
        sx={{
          py: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        {/* Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.03,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237C3AED' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              animation: { xs: 'none', md: 'patternMove 60s linear infinite' }, // Disable animation on mobile
            }}
          />

          {/* Decorative Circles - Optimized for mobile */}
          <Box
            sx={{
              position: 'absolute',
              top: '5%',
              left: '-10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, rgba(124,58,237,0) 70%)',
              opacity: 0.7,
              display: { xs: 'none', md: 'block' }, // Hide on mobile
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              bottom: '5%',
              right: '-10%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(37,99,235,0) 70%)',
              opacity: 0.7,
              display: { xs: 'none', md: 'block' }, // Hide on mobile
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="overline"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 700,
                letterSpacing: 2,
                color: 'primary.main',
                mb: 2,
                display: 'inline-block',
                position: 'relative',
                px: 2,
                py: 0.5,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, rgba(37,99,235,0) 0%, rgba(37,99,235,1) 50%, rgba(37,99,235,0) 100%)',
                },
              }}
            >
              COMMON QUESTIONS
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                },
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.2rem' },
                lineHeight: 1.6,
                mt: 4,
                fontWeight: 400,
                px: { xs: 2, md: 0 }, // Add padding on mobile
              }}
            >
              Get answers to the most common questions about immigration and our platform
            </Typography>
          </Box>

          {/* FAQ Accordion - Mobile Optimized */}
          <Box sx={{ maxWidth: '900px', mx: 'auto', px: { xs: 2, md: 0 } }}>
            {[
              {
                question: 'How does Visafy help with my immigration process?',
                answer: 'Visafy provides personalized immigration roadmaps based on your profile, goals, and circumstances. We analyze your eligibility for various programs, help you manage required documents, track application progress, and provide step-by-step guidance throughout your immigration journey.'
              },
              {
                question: 'Is Visafy a substitute for immigration lawyers?',
                answer: 'While Visafy provides comprehensive guidance and tools to navigate the immigration process, we are not a substitute for legal advice. For complex cases or specific legal questions, we recommend consulting with a qualified immigration attorney. Visafy can help you understand the process and prepare better, potentially reducing legal costs.'
              },
              {
                question: 'How accurate are the immigration pathways recommended by Visafy?',
                answer: 'Our recommendations are based on current immigration policies and requirements from official government sources. We regularly update our database to reflect policy changes. However, immigration rules can change, and individual circumstances vary, so we always recommend verifying information with official sources.'
              },
              {
                question: 'How secure is my personal information on Visafy?',
                answer: 'We take data security very seriously. Visafy employs industry-standard encryption protocols to protect your personal information. We do not share your data with third parties without your consent, and we comply with relevant data protection regulations. You can review our Privacy Policy for more details.'
              },
              {
                question: 'Can I use Visafy for family immigration applications?',
                answer: 'Yes, Visafy supports family immigration applications. You can create profiles for family members, manage documents for the entire family, and receive guidance on family sponsorship programs and requirements specific to your destination country.'
              }
            ].map((faq, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  mb: 3,
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.95)',
                    },
                  }}
                  onClick={() => {
                    // In a real implementation, this would toggle the accordion
                    console.log(`Toggle FAQ ${index}`);
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      color: 'text.primary',
                      pr: 2,
                    }}
                  >
                    {faq.question}
                  </Typography>
                  <Box
                    sx={{
                      minWidth: { xs: 28, md: 32 },
                      height: { xs: 28, md: 32 },
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: 'primary.main',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(37, 99, 235, 0.2)',
                      },
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>+</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    background: 'white',
                  }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* CTA Section */}
          <Box
            sx={{
              mt: { xs: 8, md: 10 },
              textAlign: 'center',
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(124,58,237,0.05) 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Still have questions?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '0.95rem', md: '1rem' },
              }}
            >
              Our support team is here to help you with any questions you may have about immigration or using our platform.
            </Typography>
            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: { xs: '1rem', md: '1.1rem' },
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
                background: 'linear-gradient(90deg, #2563EB 0%, #4F46E5 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1E40AF 0%, #4338CA 100%)',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 30px rgba(37, 99, 235, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Container>
      </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
