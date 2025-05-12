import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import SupportIcon from '@mui/icons-material/Support';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DevicesIcon from '@mui/icons-material/Devices';
import TranslateIcon from '@mui/icons-material/Translate';

const FeaturesPage = () => {
  const theme = useTheme();

  // Main features
  const mainFeatures = [
    {
      title: 'Personalized Assessment',
      description: 'Our comprehensive assessment analyzes your background, goals, and circumstances to identify the best immigration pathways for your unique situation.',
      icon: <AssessmentIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      benefits: [
        'Customized recommendations based on your profile',
        'Identifies eligibility for multiple immigration programs',
        'Highlights potential challenges and solutions',
        'Updates as your situation changes'
      ]
    },
    {
      title: 'Interactive Roadmaps',
      description: 'Receive a step-by-step visual guide to your immigration journey, with clear timelines, requirements, and actionable tasks.',
      icon: <MapIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      benefits: [
        'Clear visualization of your entire immigration process',
        'Interactive timeline with key milestones',
        'Automatic updates based on your progress',
        'Shareable with family members or advisors'
      ]
    },
    {
      title: 'Document Management',
      description: 'Securely store, organize, and manage all your immigration documents in one centralized location.',
      icon: <DescriptionIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      benefits: [
        'Secure cloud storage for all documents',
        'Document checklists for each application',
        'Automatic reminders for expiring documents',
        'Easy document sharing with authorized parties'
      ]
    },
    {
      title: 'Smart Notifications',
      description: 'Stay on track with timely alerts about deadlines, required actions, and important updates to immigration policies.',
      icon: <NotificationsIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      benefits: [
        'Deadline reminders for applications and documents',
        'Policy change alerts relevant to your case',
        'Progress tracking notifications',
        'Customizable notification preferences'
      ]
    },
  ];

  // Additional features
  const additionalFeatures = [
    {
      title: 'Multi-Device Access',
      description: 'Access your immigration plan from any device, anywhere, anytime.',
      icon: <DevicesIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
    },
    {
      title: 'Advanced Security',
      description: 'Bank-level encryption and security protocols to protect your sensitive information.',
      icon: <SecurityIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
    },
    {
      title: 'Expert Support',
      description: 'Connect with immigration specialists when you need additional guidance.',
      icon: <SupportIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
    },
    {
      title: 'Multi-Language Support',
      description: 'Platform available in multiple languages to serve diverse users.',
      icon: <TranslateIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
    },
  ];

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.dark',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              Powerful Features for Your Immigration Journey
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Discover the tools and capabilities that make Visafy the leading platform for immigration planning and management.
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                background: 'white',
                color: 'primary.dark',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Try All Features Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Core Features
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto' }}
          >
            Comprehensive tools designed specifically for the immigration process
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {mainFeatures.map((feature, index) => (
            <Grid item xs={12} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {feature.icon}
                      <Typography
                        variant="h4"
                        component="h3"
                        sx={{ ml: 2, fontWeight: 700 }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{ fontSize: '1.1rem', mb: 3 }}
                    >
                      {feature.description}
                    </Typography>
                    <List>
                      {feature.benefits.map((benefit, idx) => (
                        <ListItem key={idx} sx={{ p: 0, mb: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={benefit} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        height: '300px',
                        width: '100%',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                        Feature illustration placeholder
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Additional Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Additional Features
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '800px', mx: 'auto' }}
            >
              More ways Visafy enhances your immigration experience
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {additionalFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Comparison Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Choose Visafy
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto' }}
          >
            See how our platform compares to traditional immigration methods
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 800, p: 2 }}>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="h6" fontWeight={600} sx={{ p: 2 }}>
                    Feature
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      p: 2,
                      color: theme.palette.primary.main,
                      textAlign: 'center',
                    }}
                  >
                    Visafy Platform
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ p: 2, textAlign: 'center' }}
                  >
                    Traditional Methods
                  </Typography>
                </Grid>
              </Grid>

              <Divider />

              {[
                {
                  feature: 'Personalized Guidance',
                  visafy: 'AI-powered recommendations tailored to your specific situation',
                  traditional: 'Generic information or expensive consultations',
                },
                {
                  feature: 'Document Management',
                  visafy: 'Secure cloud storage with organization by application type',
                  traditional: 'Physical storage or scattered digital files',
                },
                {
                  feature: 'Process Tracking',
                  visafy: 'Real-time updates and progress visualization',
                  traditional: 'Manual tracking with no centralized system',
                },
                {
                  feature: 'Cost',
                  visafy: 'Affordable subscription with all features included',
                  traditional: 'High hourly rates for consultants or attorneys',
                },
                {
                  feature: 'Accessibility',
                  visafy: '24/7 access from any device, anywhere',
                  traditional: 'Limited to business hours and appointments',
                },
              ].map((row, index) => (
                <React.Fragment key={index}>
                  <Grid container sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}>
                    <Grid item xs={4}>
                      <Typography variant="body1" fontWeight={500} sx={{ p: 2 }}>
                        {row.feature}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircleIcon
                          sx={{ color: theme.palette.success.main, mr: 1 }}
                        />
                        <Typography variant="body1">{row.visafy}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        variant="body1"
                        sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}
                      >
                        {row.traditional}
                      </Typography>
                    </Grid>
                  </Grid>
                  {index < 4 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'secondary.dark',
          py: 10,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(135deg, rgba(124, 58, 237, 0.8) 0%, rgba(37, 99, 235, 0.8) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            color="white"
            sx={{
              fontWeight: 700,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            Ready to Experience These Features?
          </Typography>
          <Typography
            variant="h6"
            paragraph
            color="white"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Start your immigration journey with the most comprehensive platform available.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              bgcolor: 'white',
              color: 'secondary.dark',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '12px',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default FeaturesPage;
