import React from 'react';
import { Box, Typography, Link, Container, Grid, Divider, useTheme, alpha } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)',
        backgroundColor: alpha('#FFFFFF', 0.9),
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ py: 6 }}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary.main" gutterBottom fontWeight={600}>
              Visafy
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Simplifying immigration processes with personalized roadmaps, document management, and expert guidance every step of the way.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Link href="#" color="inherit" sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}>
                <FacebookIcon fontSize="small" />
              </Link>
              <Link href="#" color="inherit" sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}>
                <TwitterIcon fontSize="small" />
              </Link>
              <Link href="#" color="inherit" sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}>
                <LinkedInIcon fontSize="small" />
              </Link>
              <Link href="#" color="inherit" sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}>
                <InstagramIcon fontSize="small" />
              </Link>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom fontWeight={600}>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              {['Home', 'About', 'Pricing', 'Contact'].map((item) => (
                <Box component="li" key={item} sx={{ py: 0.5 }}>
                  <Link
                    component={RouterLink}
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    color="inherit"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom fontWeight={600}>
              Resources
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              {['Research', 'Programs', 'Countries', 'Calculator'].map((item) => (
                <Box component="li" key={item} sx={{ py: 0.5 }}>
                  <Link
                    component={RouterLink}
                    to={item === 'Research' ? '/research' : `/immigration/${item.toLowerCase()}`}
                    color="inherit"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom fontWeight={600}>
              Legal
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Disclaimer'].map((item) => (
                <Box component="li" key={item} sx={{ py: 0.5 }}>
                  <Link
                    component={RouterLink}
                    to={`/legal/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    color="inherit"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ py: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            © {currentYear} Visafy. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'right' }, mt: { xs: 1, sm: 0 } }}>
            Made with ❤️ for immigrants worldwide
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
