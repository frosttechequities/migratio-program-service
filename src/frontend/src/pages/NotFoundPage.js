import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MapIcon from '@mui/icons-material/Map';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NotFoundPage = () => {
  useTheme(); // Theme used for styling
  const navigate = useNavigate();

  // Popular destinations
  const popularDestinations = [
    { title: 'Home Page', path: '/', icon: <HomeIcon color="primary" /> },
    { title: 'Assessment', path: '/assessment', icon: <SearchIcon color="primary" /> },
    { title: 'Features', path: '/features', icon: <MapIcon color="primary" /> },
    { title: 'Contact Support', path: '/contact', icon: <HelpOutlineIcon color="primary" /> },
  ];

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Grid container>
          {/* Left side - Illustration */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h1"
                  component="div"
                  sx={{
                    fontSize: { xs: '120px', md: '180px' },
                    fontWeight: 900,
                    background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1,
                    mb: 2,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '5px',
                      bottom: 0,
                      left: 0,
                      background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                      borderRadius: '5px',
                    },
                  }}
                >
                  404
                </Typography>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Page Not Found
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right side - Content */}
          <Grid item xs={12} md={7}>
            <Box sx={{ p: 6 }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Oops! We couldn't find that page.
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 4 }}>
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable. Here are some helpful links to get you back on track:
              </Typography>

              <List sx={{ mb: 4 }}>
                {popularDestinations.map((item, index) => (
                  <ListItem
                    button
                    component={RouterLink}
                    to={item.path}
                    key={index}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': {
                        bgcolor: 'rgba(37, 99, 235, 0.08)',
                      },
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleGoBack}
                  sx={{
                    borderRadius: '12px',
                    py: 1.2,
                    px: 3,
                    borderWidth: 2,
                  }}
                >
                  Go Back
                </Button>
                <Button
                  component={RouterLink}
                  to="/"
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: '12px',
                    py: 1.2,
                    px: 3,
                    background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                    boxShadow: '0 10px 15px rgba(37, 99, 235, 0.2)',
                  }}
                >
                  Back to Home
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
