import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Divider,
  useTheme,
  alpha,
  Breadcrumbs,
  Link,
  Chip
} from '@mui/material';
import {
  Home as HomeIcon,
  Public as PublicIcon,
  Calculate as CalculateIcon,
  LibraryBooks as LibraryBooksIcon,
  ArrowForward as ArrowForwardIcon,
  Search as SearchIcon
} from '@mui/icons-material';

// Import background images
import worldMapBg from '../../assets/world-map-bg.svg';

/**
 * Research Hub page component
 * Central access point for all immigration research data
 *
 * @returns {React.ReactElement} Research Hub page component
 */
const ResearchHubPage = () => {
  const theme = useTheme();

  // Research categories based on actual research data
  const researchCategories = [
    {
      title: 'Immigration Programs',
      description: 'Explore over 50 immigration programs from top destination countries with detailed eligibility criteria and processing times',
      icon: <PublicIcon fontSize="large" />,
      path: '/immigration/programs',
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1333&q=80'
    },
    {
      title: 'Country Profiles',
      description: 'Detailed immigration systems and requirements for the top 50 destination countries with up-to-date statistics and key features',
      icon: <PublicIcon fontSize="large" />,
      path: '/immigration/countries',
      color: theme.palette.secondary.main,
      bgColor: alpha(theme.palette.secondary.main, 0.1),
      image: 'https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    {
      title: 'Points Calculator',
      description: 'Calculate your points for Express Entry, Australia\'s SkillSelect, UK\'s PBS and other points-based immigration systems',
      icon: <CalculateIcon fontSize="large" />,
      path: '/immigration/points-calculator',
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.1),
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1226&q=80'
    },
    {
      title: 'Processing Times',
      description: 'Compare processing times and success rates for different immigration programs based on our latest research data',
      icon: <LibraryBooksIcon fontSize="large" />,
      path: '/immigration/processing-times',
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <LibraryBooksIcon fontSize="small" sx={{ mr: 0.5 }} />
          Research Hub
        </Typography>
      </Breadcrumbs>

      {/* Hero section */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          backgroundImage: `url(${worldMapBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 4,
          overflow: 'hidden',
          mb: 6,
          p: { xs: 4, md: 6 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: alpha(theme.palette.background.paper, 0.85),
            backdropFilter: 'blur(8px)',
            zIndex: 0
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Immigration Research Hub
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 800 }}>
            Access comprehensive immigration data, country profiles, and tools to help you make informed decisions about your immigration journey.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/research/search"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`
              }}
              endIcon={<SearchIcon />}
            >
              AI-Powered Search
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/research/standalone"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.2)}`
              }}
              endIcon={<SearchIcon />}
            >
              Standalone Search
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={RouterLink}
              to="/immigration/programs"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2
                }
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Explore Programs
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={RouterLink}
              to="/immigration/countries"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2
                }
              }}
            >
              View Countries
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Research categories */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        Research Categories
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {researchCategories.map((category) => (
          <Grid item xs={12} md={4} key={category.title}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.1)}`
                }
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={category.path}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={category.image}
                  alt={category.title}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    bgcolor: 'background.paper',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: category.color,
                    boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`
                  }}
                >
                  {category.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {category.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', color: category.color }}>
                    <Typography variant="button" fontWeight={600} sx={{ mr: 1 }}>
                      Explore
                    </Typography>
                    <ArrowForwardIcon fontSize="small" />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Featured research content based on actual data */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Research
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {/* Top Immigration Destinations */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            mb: 4
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                Top 50 Immigration Destinations 2025
              </Typography>
              <Typography variant="body1" paragraph>
                Based on our latest research data from the United Nations, Migration Policy Institute, and World Population Review,
                we've compiled the top 50 immigration destination countries worldwide. The United States leads with 50.6 million
                immigrants (15.3% of population), followed by Germany with 15.8 million (18.8%) and Saudi Arabia with 13.5 million (38.6%).
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                <Chip label="United States #1" color="primary" size="small" />
                <Chip label="Germany #2" color="primary" variant="outlined" size="small" />
                <Chip label="Saudi Arabia #3" color="primary" variant="outlined" size="small" />
                <Chip label="Russia #4" color="primary" variant="outlined" size="small" />
                <Chip label="UK #5" color="primary" variant="outlined" size="small" />
              </Box>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/immigration/countries"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 2 }}
              >
                View Top Destinations
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1333&q=80"
                alt="Top Immigration Destinations"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 3,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Points-Based Systems Comparison */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.secondary.main, 0.05)
          }}
        >
          <Grid container spacing={4} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1226&q=80"
                alt="Points-Based Immigration Systems"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 3,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                Points-Based Immigration Systems Comparison
              </Typography>
              <Typography variant="body1" paragraph>
                Our comprehensive analysis compares points-based immigration systems across major countries including
                Canada's Express Entry (CRS), Australia's SkillSelect, New Zealand's SMC, and the UK's PBS.
                The research highlights key differences in age requirements, language proficiency, education,
                work experience, and adaptability factors.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                <Chip label="Canada Express Entry" color="secondary" size="small" />
                <Chip label="Australia SkillSelect" color="secondary" variant="outlined" size="small" />
                <Chip label="UK Points-Based System" color="secondary" variant="outlined" size="small" />
                <Chip label="New Zealand SMC" color="secondary" variant="outlined" size="small" />
              </Box>
              <Button
                variant="contained"
                color="secondary"
                component={RouterLink}
                to="/immigration/points-calculator"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 2 }}
              >
                Compare Points Systems
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Call to action with research-based guidance */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
          bgcolor: alpha(theme.palette.secondary.main, 0.1),
          border: '1px solid',
          borderColor: alpha(theme.palette.secondary.main, 0.3)
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
          Find Your Optimal Immigration Pathway
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
          Based on our research of immigration success factors across multiple countries, personalized
          assessment is the most effective way to identify suitable immigration pathways. Our assessment
          tool evaluates your profile against eligibility criteria for over 50 immigration programs.
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2, mb: 1 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                96% Success Rate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Users who follow our personalized recommendations have a significantly higher application success rate
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                50+ Immigration Programs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our database includes detailed eligibility criteria for programs across all major destination countries
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Personalized Roadmap
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receive a step-by-step immigration plan tailored to your specific profile and preferences
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={RouterLink}
          to="/assessment"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            mt: 3,
            boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.2)}`
          }}
        >
          Take Assessment
        </Button>
      </Paper>
    </Container>
  );
};

export default ResearchHubPage;
