import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const PricingPage = () => {
  const theme = useTheme();
  const [annual, setAnnual] = useState(true);

  // Pricing plans
  const plans = [
    {
      title: 'Free',
      price: {
        monthly: 0,
        annual: 0,
      },
      description: 'Basic tools to start your immigration journey',
      features: [
        { name: 'Basic Assessment', included: true },
        { name: 'Limited Roadmap', included: true },
        { name: 'Document Storage (100MB)', included: true },
        { name: 'Email Support', included: true },
        { name: 'Advanced Recommendations', included: false },
        { name: 'Priority Support', included: false },
        { name: 'Document Templates', included: false },
        { name: 'Progress Tracking', included: false },
      ],
      buttonText: 'Sign Up Free',
      buttonVariant: 'outlined',
      popular: false,
    },
    {
      title: 'Premium',
      price: {
        monthly: 19.99,
        annual: 14.99,
      },
      description: 'Everything you need for a successful immigration process',
      features: [
        { name: 'Comprehensive Assessment', included: true },
        { name: 'Full Interactive Roadmap', included: true },
        { name: 'Document Storage (5GB)', included: true },
        { name: 'Priority Email Support', included: true },
        { name: 'Advanced Recommendations', included: true },
        { name: 'Document Templates', included: true },
        { name: 'Progress Tracking', included: true },
        { name: 'Policy Change Alerts', included: true },
      ],
      buttonText: 'Get Premium',
      buttonVariant: 'contained',
      popular: true,
    },
    {
      title: 'Family',
      price: {
        monthly: 29.99,
        annual: 24.99,
      },
      description: 'Ideal for families immigrating together',
      features: [
        { name: 'Multiple User Profiles (up to 5)', included: true },
        { name: 'Family Roadmap Integration', included: true },
        { name: 'Document Storage (10GB)', included: true },
        { name: 'Priority Phone Support', included: true },
        { name: 'Advanced Recommendations', included: true },
        { name: 'Document Templates', included: true },
        { name: 'Progress Tracking', included: true },
        { name: 'Policy Change Alerts', included: true },
      ],
      buttonText: 'Choose Family Plan',
      buttonVariant: 'outlined',
      popular: false,
    },
  ];

  // FAQ items
  const faqItems = [
    {
      question: 'Can I upgrade or downgrade my plan later?',
      answer: 'Yes, you can change your plan at any time. When upgrading, you will have immediate access to new features. When downgrading, the change will take effect at the end of your current billing cycle.',
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer: 'Yes, all paid plans come with a 14-day free trial. You can explore all features without commitment, and we will only charge you if you decide to continue after the trial period.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and in select countries, we offer local payment options.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time from your account settings. There are no cancellation fees or long-term commitments.',
    },
    {
      question: 'Do you offer discounts for non-profits or educational institutions?',
      answer: 'Yes, we offer special pricing for non-profit organizations, educational institutions, and immigration assistance programs. Please contact our sales team for more information.',
    },
  ];

  const handleBillingToggle = () => {
    setAnnual(!annual);
  };

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
              Simple, Transparent Pricing
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Choose the plan that fits your immigration journey, with no hidden fees or surprises.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="body1" sx={{ mr: 1 }}>Monthly</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={annual}
                    onChange={handleBillingToggle}
                    color="default"
                  />
                }
                label=""
              />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Annual
                <Chip
                  label="Save 25%"
                  size="small"
                  color="secondary"
                  sx={{
                    ml: 1,
                    bgcolor: 'white',
                    color: 'primary.dark',
                    fontWeight: 'bold',
                  }}
                />
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Pricing Plans Section */}
      <Container maxWidth="lg" sx={{ py: 10, mt: -6 }}>
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{
                display: 'flex',
              }}
            >
              <Card
                elevation={plan.popular ? 8 : 2}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  borderRadius: 4,
                  position: 'relative',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  border: plan.popular ? `2px solid ${theme.palette.primary.main}` : '1px solid',
                  borderColor: plan.popular ? 'primary.main' : 'divider',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: plan.popular ? '0 20px 30px rgba(0, 0, 0, 0.2)' : '0 12px 20px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                {plan.popular && (
                  <Chip
                    label="Most Popular"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: -15,
                      right: 20,
                      fontWeight: 'bold',
                      px: 2,
                    }}
                  />
                )}
                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                  <Typography variant="h4" component="h2" gutterBottom fontWeight={700}>
                    {plan.title}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" component="p" fontWeight={800}>
                      ${annual ? plan.price.annual : plan.price.monthly}
                      <Typography variant="body1" component="span" color="text.secondary">
                        {plan.price.monthly > 0 ? (annual ? '/mo (billed annually)' : '/month') : ''}
                      </Typography>
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {plan.description}
                  </Typography>
                  <Divider sx={{ my: 3 }} />
                  <List sx={{ mb: 2 }}>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {feature.included ? (
                            <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                          ) : (
                            <CancelIcon sx={{ color: theme.palette.text.disabled }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.name}
                          primaryTypographyProps={{
                            color: feature.included ? 'text.primary' : 'text.disabled',
                            fontWeight: feature.included ? 500 : 400,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant={plan.buttonVariant}
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      ...(plan.popular && {
                        background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                        boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)',
                      }),
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Enterprise Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
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
                }}
              >
                Enterprise Solutions
              </Typography>
              <Typography variant="h6" paragraph>
                Custom solutions for immigration law firms, corporations, and organizations
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                We offer tailored enterprise plans for organizations that need to manage multiple immigration cases,
                integrate with existing systems, or require custom features and dedicated support.
              </Typography>
              <List>
                {[
                  'Unlimited user accounts with role-based permissions',
                  'Custom branding and white-label options',
                  'API access for integration with your existing systems',
                  'Dedicated account manager and priority support',
                  'Custom reporting and analytics',
                  'Bulk document processing and management',
                ].map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                }}
              >
                Contact Sales
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: '400px',
                  width: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  Enterprise illustration placeholder
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
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
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto' }}
          >
            Everything you need to know about our pricing and plans
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {faqItems.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <HelpOutlineIcon sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }} />
                  <Typography variant="h6" component="h3" fontWeight={600}>
                    {item.question}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ pl: 5 }}>
                  {item.answer}
                </Typography>
              </Paper>
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
            Start Your Immigration Journey Today
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
            Try Visafy free for 14 days. No credit card required.
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
            Start Free Trial
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default PricingPage;
