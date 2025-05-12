import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Paper,
  useTheme,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SecurityIcon from '@mui/icons-material/Security';

const AboutPage = () => {
  const theme = useTheme();

  // Team members data
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former immigration attorney with 15+ years of experience helping families navigate complex immigration processes.',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Tech innovator with a passion for creating solutions that simplify complex legal and administrative processes.',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Immigration Services',
      bio: 'Certified immigration consultant with expertise in multiple immigration pathways across North America and Europe.',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      name: 'David Okafor',
      role: 'User Experience Director',
      bio: 'Specializes in creating intuitive digital experiences for users from diverse cultural backgrounds.',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
  ];

  // Company values
  const values = [
    {
      title: 'Global Perspective',
      description: 'We understand the unique challenges of immigration across different countries and cultures.',
      icon: <PublicIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
    },
    {
      title: 'Human-Centered',
      description: 'We put people first, designing our platform around real human needs and experiences.',
      icon: <PeopleIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
    },
    {
      title: 'Innovation',
      description: 'We constantly evolve our technology to provide the most effective immigration solutions.',
      icon: <LightbulbIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
    },
    {
      title: 'Trust & Security',
      description: 'We maintain the highest standards of data protection and privacy for our users.',
      icon: <SecurityIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
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
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                Our Mission
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, maxWidth: '800px', lineHeight: 1.6 }}
              >
                At Visafy, we're dedicated to transforming the immigration experience through technology,
                making it more accessible, transparent, and human-centered for people around the world.
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
                Join Our Community
              </Button>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  height: '400px',
                  width: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.2)',
                    zIndex: 1,
                  },
                }}
              >
                <img
                  src="/hero-image.png"
                  alt="Diverse group of people"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                height: '500px',
                width: '100%',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                alt="Global journey"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
              }}
            >
              Our Story
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
              Visafy was born from personal experience. Our founder, Sarah Johnson, witnessed firsthand the challenges and frustrations of the immigration process while helping her own family members relocate.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
              As an immigration attorney, she saw countless families struggle with complex paperwork, confusing requirements, and a lack of clear guidance. She envisioned a better way - a platform that could provide personalized roadmaps for each individual's unique immigration journey.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
              In 2020, Sarah partnered with tech innovator Michael Chen to bring this vision to life. Together, they assembled a team of immigration experts, technologists, and designers committed to transforming the immigration experience.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
              Today, Visafy helps thousands of people navigate their immigration journeys with confidence and clarity.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Our Values Section */}
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
              Our Values
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '800px', mx: 'auto' }}
            >
              The principles that guide everything we do at Visafy
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {values.map((value, index) => (
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
                  <Box sx={{ mb: 2 }}>{value.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                    {value.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
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
            Meet Our Team
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto' }}
          >
            The passionate experts behind Visafy
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                  },
                }}
                elevation={2}
              >
                <Box sx={{ position: 'relative', pt: '100%' }}>
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 2,
                      color: 'primary.main',
                      fontWeight: 500,
                    }}
                  >
                    {member.role}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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
            Join Us in Our Mission
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
            Be part of a community that's making immigration more accessible and humane for everyone.
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
            Start Your Journey
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
