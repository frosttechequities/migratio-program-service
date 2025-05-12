import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import GavelIcon from '@mui/icons-material/Gavel';

/**
 * Legal page component that displays different legal content based on the URL parameter
 * @returns {React.ReactElement} Legal page component
 */
const LegalPage = () => {
  const theme = useTheme();
  const { pageType } = useParams();
  
  // Define content for different legal pages
  const legalContent = {
    'terms-of-service': {
      title: 'Terms of Service',
      lastUpdated: 'May 1, 2025',
      content: [
        {
          heading: 'Introduction',
          text: 'Welcome to Visafy. By using our services, you agree to these Terms of Service. Please read them carefully.'
        },
        {
          heading: 'Use of Services',
          text: 'Our services are designed to help you navigate immigration processes. We provide information and tools, but we are not a substitute for professional legal advice.'
        },
        {
          heading: 'User Accounts',
          text: 'You are responsible for safeguarding your account credentials and for any activities that occur under your account.'
        },
        {
          heading: 'Content and Conduct',
          text: 'You retain ownership of any content you submit to our platform. However, by submitting content, you grant us a license to use, modify, and display that content.'
        },
        {
          heading: 'Termination',
          text: 'We reserve the right to suspend or terminate your access to our services if you violate these terms or engage in fraudulent activity.'
        }
      ]
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      lastUpdated: 'May 1, 2025',
      content: [
        {
          heading: 'Information We Collect',
          text: 'We collect information you provide directly to us, such as your name, email address, and other personal information necessary for immigration processes.'
        },
        {
          heading: 'How We Use Information',
          text: 'We use your information to provide and improve our services, communicate with you, and comply with legal obligations.'
        },
        {
          heading: 'Information Sharing',
          text: 'We do not sell your personal information. We may share information with service providers who help us operate our platform or when required by law.'
        },
        {
          heading: 'Data Security',
          text: 'We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.'
        },
        {
          heading: 'Your Rights',
          text: 'Depending on your location, you may have rights to access, correct, or delete your personal information. Contact us to exercise these rights.'
        }
      ]
    },
    'cookie-policy': {
      title: 'Cookie Policy',
      lastUpdated: 'May 1, 2025',
      content: [
        {
          heading: 'What Are Cookies',
          text: 'Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience.'
        },
        {
          heading: 'Types of Cookies We Use',
          text: 'We use essential cookies for site functionality, analytics cookies to understand how you use our site, and preference cookies to remember your settings.'
        },
        {
          heading: 'Managing Cookies',
          text: 'You can control cookies through your browser settings. However, disabling certain cookies may affect your experience on our site.'
        },
        {
          heading: 'Third-Party Cookies',
          text: 'Some cookies are placed by third-party services that appear on our pages. We do not control these cookies.'
        },
        {
          heading: 'Updates to This Policy',
          text: 'We may update this Cookie Policy from time to time. We will notify you of any significant changes.'
        }
      ]
    },
    'disclaimer': {
      title: 'Disclaimer',
      lastUpdated: 'May 1, 2025',
      content: [
        {
          heading: 'Not Legal Advice',
          text: 'The information provided on Visafy is for general informational purposes only and should not be construed as legal advice.'
        },
        {
          heading: 'Accuracy of Information',
          text: 'While we strive to provide accurate and up-to-date information, we make no representations or warranties about the completeness, reliability, or accuracy of this information.'
        },
        {
          heading: 'External Links',
          text: 'Our platform may contain links to external websites. We are not responsible for the content or practices of these sites.'
        },
        {
          heading: 'Limitation of Liability',
          text: 'Visafy shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or use of our platform.'
        },
        {
          heading: 'Changes to Disclaimer',
          text: 'We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting on our platform.'
        }
      ]
    }
  };

  // Get content based on page type
  const pageContent = legalContent[pageType] || {
    title: 'Legal Information',
    lastUpdated: 'May 1, 2025',
    content: [
      {
        heading: 'Page Not Found',
        text: 'The legal page you are looking for does not exist. Please check the URL or navigate to one of our other legal pages.'
      }
    ]
  };

  // Format page title for breadcrumbs
  const formatTitle = (slug) => {
    if (!slug) return 'Legal';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 4 }}
      >
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/legal" color="inherit">
          Legal
        </Link>
        <Typography color="text.primary">{formatTitle(pageType)}</Typography>
      </Breadcrumbs>

      {/* Main Content */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          mb: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <GavelIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h4" component="h1" fontWeight={700}>
              {pageContent.title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Last Updated: {pageContent.lastUpdated}
          </Typography>
          <Divider sx={{ mt: 2 }} />
        </Box>

        {/* Content Sections */}
        {pageContent.content.map((section, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
              {section.heading}
            </Typography>
            <Typography variant="body1" paragraph>
              {section.text}
            </Typography>
            {index < pageContent.content.length - 1 && (
              <Divider sx={{ mt: 3, mb: 3, opacity: 0.6 }} />
            )}
          </Box>
        ))}

        {/* Contact Information */}
        <Box
          sx={{
            mt: 6,
            p: 3,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.1)
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Questions About Our Legal Policies?
          </Typography>
          <Typography variant="body2">
            If you have any questions about these policies, please contact us at{' '}
            <Link href="mailto:legal@visafy.com" color="primary">
              legal@visafy.com
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Related Legal Documents */}
      <Typography variant="h6" gutterBottom>
        Other Legal Documents
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        {Object.keys(legalContent)
          .filter(key => key !== pageType)
          .map(key => (
            <Paper
              key={key}
              component={RouterLink}
              to={`/legal/${key}`}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                textDecoration: 'none',
                color: 'text.primary',
                flex: { xs: '1 0 100%', sm: '1 0 calc(50% - 8px)', md: '1 0 calc(33.333% - 11px)' },
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {legalContent[key].title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: {legalContent[key].lastUpdated}
              </Typography>
            </Paper>
          ))}
      </Box>
    </Container>
  );
};

export default LegalPage;
