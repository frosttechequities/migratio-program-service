import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Alert,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Public as PublicIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Language as LanguageIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  AttachMoney as AttachMoneyIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import ResearchBreadcrumbs from '../../components/immigration/ResearchBreadcrumbs';

/**
 * Program Detail Page component
 * Displays detailed information about a specific immigration program
 *
 * @returns {React.ReactElement} Program Detail Page component
 */
const ProgramDetailPage = () => {
  const theme = useTheme();
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch program data
  useEffect(() => {
    // Simulate API call to fetch program details
    const fetchProgramDetails = async () => {
      try {
        setLoading(true);

        // In a real app, this would be an API call
        // For now, we'll use mock data based on the programId
        const mockPrograms = {
          'prog1': {
            id: 'prog1',
            name: 'Express Entry System',
            country: 'Canada',
            countryCode: 'CA',
            flagImage: 'https://flagcdn.com/w320/ca.png',
            type: 'Skilled Worker',
            permanentResidency: true,
            overview: 'A points-based immigration system that manages applications for three federal economic immigration programs: Federal Skilled Worker Program, Canadian Experience Class, and Federal Skilled Trades Program.',
            processingTime: '6-12 months',
            successRate: 85,
            estimatedCost: 'CAD 2,300 - 4,500',
            eligibility: [
              {
                name: 'Age',
                description: 'Candidates between 20-29 years receive maximum points. Points decrease for ages above and below this range.',
                importance: 'high'
              },
              {
                name: 'Education',
                description: 'Bachelor\'s degree or higher is preferred. Additional points for Canadian education.',
                importance: 'high'
              },
              {
                name: 'Language Proficiency',
                description: 'CLB 7 or higher in English and/or French. Higher scores receive more points.',
                importance: 'high'
              },
              {
                name: 'Work Experience',
                description: 'At least 1 year of skilled work experience in NOC 0, A, or B categories.',
                importance: 'medium'
              },
              {
                name: 'Adaptability',
                description: 'Additional points for spouse qualifications, Canadian relatives, or previous study/work in Canada.',
                importance: 'low'
              }
            ],
            steps: [
              'Create an Express Entry profile',
              'Receive an Invitation to Apply (ITA) if selected from the pool',
              'Submit a complete application within 60 days',
              'Undergo medical examination and provide biometrics',
              'Wait for application processing (typically 6-12 months)',
              'Receive Confirmation of Permanent Residence (COPR) if approved',
              'Arrive in Canada and activate PR status'
            ],
            requiredDocuments: [
              'Valid passport',
              'Language test results (IELTS or CELPIP for English, TEF for French)',
              'Educational Credential Assessment (ECA) for foreign education',
              'Proof of work experience (reference letters, employment contracts)',
              'Police clearance certificates',
              'Medical examination results',
              'Proof of funds'
            ],
            benefits: [
              'Permanent residence status upon arrival',
              'Access to healthcare, education, and social services',
              'Ability to work for any employer in Canada',
              'Pathway to Canadian citizenship after 3 years',
              'Family members can be included in the application'
            ],
            officialWebsite: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html',
            lastUpdated: 'April 2025'
          },
          'prog2': {
            id: 'prog2',
            name: 'Provincial Nominee Program (PNP)',
            country: 'Canada',
            countryCode: 'CA',
            flagImage: 'https://flagcdn.com/w320/ca.png',
            type: 'Provincial/Regional',
            permanentResidency: true,
            overview: 'Each province and territory has its own PNP streams and criteria for selecting candidates that meet their specific economic needs.',
            processingTime: '6-18 months',
            successRate: 92,
            estimatedCost: 'CAD 2,000 - 3,500',
            eligibility: [
              {
                name: 'Provincial Selection Criteria',
                description: 'Varies by province but generally includes skills, education, work experience, and intention to settle in the province.',
                importance: 'high'
              },
              {
                name: 'Connection to Province',
                description: 'Some streams require a job offer, previous work/study in the province, or family connections.',
                importance: 'high'
              },
              {
                name: 'Language Proficiency',
                description: 'Requirements vary by province and stream, typically CLB 5-7.',
                importance: 'medium'
              },
              {
                name: 'Work Experience',
                description: 'Relevant work experience in an in-demand occupation for the province.',
                importance: 'medium'
              },
              {
                name: 'Education',
                description: 'Post-secondary education is typically required, with specific requirements varying by stream.',
                importance: 'medium'
              }
            ],
            steps: [
              'Identify the appropriate provincial stream',
              'Apply directly to the province or through Express Entry',
              'Receive provincial nomination if selected',
              'Apply for permanent residence to IRCC',
              'Undergo medical examination and provide biometrics',
              'Wait for application processing',
              'Receive Confirmation of Permanent Residence (COPR) if approved',
              'Arrive in Canada and activate PR status'
            ],
            requiredDocuments: [
              'Valid passport',
              'Language test results',
              'Educational credentials',
              'Proof of work experience',
              'Provincial nomination certificate',
              'Police clearance certificates',
              'Medical examination results',
              'Proof of funds'
            ],
            benefits: [
              'Permanent residence status upon approval',
              'Targeted pathway for specific regions in Canada',
              'May have lower eligibility requirements than federal programs',
              'Some streams don\'t require job offers',
              'Pathway to Canadian citizenship after 3 years'
            ],
            officialWebsite: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html',
            lastUpdated: 'March 2025'
          },
          'prog3': {
            id: 'prog3',
            name: 'EB-5 Immigrant Investor Program',
            country: 'United States',
            countryCode: 'US',
            flagImage: 'https://flagcdn.com/w320/us.png',
            type: 'Investor',
            permanentResidency: true,
            overview: 'For investors who make a qualifying investment in a U.S. commercial enterprise and plan to create or preserve 10 permanent full-time jobs for qualified U.S. workers.',
            processingTime: '24-36 months',
            successRate: 82,
            estimatedCost: 'USD 800,000 - 1,050,000 (investment) + USD 15,000 - 50,000 (legal fees)',
            eligibility: [
              {
                name: 'Investment Amount',
                description: 'Minimum $800,000 in a Targeted Employment Area (TEA) or $1,050,000 in a non-TEA.',
                importance: 'high'
              },
              {
                name: 'Job Creation',
                description: 'Investment must create or preserve at least 10 full-time jobs for qualifying U.S. workers.',
                importance: 'high'
              },
              {
                name: 'Source of Funds',
                description: 'Must demonstrate that investment funds were obtained through lawful means.',
                importance: 'high'
              },
              {
                name: 'Active Management',
                description: 'Investor must be engaged in management or policy formation of the enterprise.',
                importance: 'medium'
              }
            ],
            steps: [
              'Select an EB-5 project or direct investment opportunity',
              'Make the required investment',
              'File Form I-526 petition with USCIS',
              'Wait for I-526 approval (12-24 months)',
              'Apply for immigrant visa or adjustment of status',
              'Receive conditional green card valid for 2 years',
              'File Form I-829 to remove conditions 90 days before expiration',
              'Receive permanent green card if approved'
            ],
            requiredDocuments: [
              'Proof of investment',
              'Business plan showing job creation',
              'Source of funds documentation',
              'Personal identification documents',
              'Tax returns and financial statements',
              'Evidence of management role in the enterprise',
              'Birth and marriage certificates for family members'
            ],
            benefits: [
              'Permanent residence for investor and immediate family members',
              'No language, education, or business experience requirements',
              'Freedom to live and work anywhere in the United States',
              'Access to public education and healthcare',
              'Pathway to U.S. citizenship after 5 years'
            ],
            officialWebsite: 'https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program',
            lastUpdated: 'February 2025'
          }
        };

        // Find the program by ID
        const foundProgram = mockPrograms[programId];

        if (foundProgram) {
          setProgram(foundProgram);
        } else {
          setError('Program not found');
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load program details');
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [programId]);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/immigration/programs"
          startIcon={<ArrowBackIcon />}
        >
          Back to Programs
        </Button>
      </Container>
    );
  }

  // If program not found
  if (!program) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Program not found. The program may have been removed or the ID is incorrect.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/immigration/programs"
          startIcon={<ArrowBackIcon />}
        >
          Back to Programs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <ResearchBreadcrumbs
        currentPage={program.name}
        icon={<PublicIcon fontSize="small" />}
        additionalCrumbs={[
          {
            label: 'Immigration Programs',
            path: '/immigration/programs',
            icon: <PublicIcon fontSize="small" />
          }
        ]}
      />

      {/* Program header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.primary.main, 0.05)
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                component="img"
                src={program.flagImage}
                alt={`${program.country} flag`}
                sx={{
                  width: 48,
                  height: 32,
                  mr: 2,
                  objectFit: 'cover',
                  borderRadius: 1,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Typography variant="h4" component="h1">
                {program.name}
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {program.country}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                label={program.type}
                color="primary"
                size="medium"
                sx={{ fontWeight: 500 }}
              />
              <Chip
                label={program.permanentResidency ? 'Permanent Residency' : 'Temporary Residency'}
                color={program.permanentResidency ? 'success' : 'info'}
                variant="outlined"
                size="medium"
              />
              <Chip
                icon={<AccessTimeIcon />}
                label={`${program.processingTime} processing`}
                variant="outlined"
                size="medium"
              />
            </Box>
            <Typography variant="body1" paragraph>
              {program.overview}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component="a"
              href={program.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<LanguageIcon />}
              sx={{ mt: 1 }}
            >
              Official Website
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Program Highlights
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Success Rate
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {program.successRate}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Processing Time
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {program.processingTime}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Estimated Cost
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {program.estimatedCost}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {program.lastUpdated}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Program details */}
      <Grid container spacing={4}>
        {/* Eligibility criteria */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Eligibility Criteria
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List disablePadding>
              {program.eligibility.map((criterion, index) => (
                <ListItem
                  key={index}
                  alignItems="flex-start"
                  sx={{
                    px: 2,
                    py: 1.5,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: alpha(
                      criterion.importance === 'high'
                        ? theme.palette.error.main
                        : criterion.importance === 'medium'
                        ? theme.palette.warning.main
                        : theme.palette.success.main,
                      0.1
                    ),
                    border: '1px solid',
                    borderColor: alpha(
                      criterion.importance === 'high'
                        ? theme.palette.error.main
                        : criterion.importance === 'medium'
                        ? theme.palette.warning.main
                        : theme.palette.success.main,
                      0.3
                    )
                  }}
                >
                  <ListItemIcon sx={{ mt: 0.5 }}>
                    {criterion.name.toLowerCase().includes('age') ? (
                      <AccessTimeIcon color="primary" />
                    ) : criterion.name.toLowerCase().includes('education') ? (
                      <SchoolIcon color="primary" />
                    ) : criterion.name.toLowerCase().includes('language') ? (
                      <LanguageIcon color="primary" />
                    ) : criterion.name.toLowerCase().includes('work') ? (
                      <WorkIcon color="primary" />
                    ) : criterion.name.toLowerCase().includes('investment') ? (
                      <AttachMoneyIcon color="primary" />
                    ) : (
                      <CheckCircleIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {criterion.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={criterion.importance.charAt(0).toUpperCase() + criterion.importance.slice(1)}
                          color={
                            criterion.importance === 'high'
                              ? 'error'
                              : criterion.importance === 'medium'
                              ? 'warning'
                              : 'success'
                          }
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={criterion.description}
                    secondaryTypographyProps={{ sx: { mt: 0.5 } }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Application process */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Application Process
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List disablePadding>
              {program.steps.map((step, index) => (
                <ListItem
                  key={index}
                  alignItems="flex-start"
                  sx={{
                    px: 2,
                    py: 1.5,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.background.default, 0.7),
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600
                      }}
                    >
                      {index + 1}
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={step} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Required documents */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Required Documents
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List disablePadding>
              {program.requiredDocuments.map((document, index) => (
                <ListItem
                  key={index}
                  sx={{
                    px: 2,
                    py: 1
                  }}
                >
                  <ListItemIcon>
                    <AssignmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={document} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Benefits */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Program Benefits
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List disablePadding>
              {program.benefits.map((benefit, index) => (
                <ListItem
                  key={index}
                  sx={{
                    px: 2,
                    py: 1
                  }}
                >
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          color="primary"
          component={RouterLink}
          to="/immigration/programs"
          startIcon={<ArrowBackIcon />}
        >
          Back to Programs
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/assessment"
          endIcon={<ArrowForwardIcon />}
        >
          Take Eligibility Assessment
        </Button>
      </Box>
    </Container>
  );
};

export default ProgramDetailPage;
