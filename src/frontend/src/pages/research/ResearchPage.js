import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper,
  Divider,
  Button,
  Card,
  CardContent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MainLayout from '../../components/layout/MainLayout';
import SemanticSearch from '../../components/search/SemanticSearch';
import ImmigrationChatbot from '../../components/chatbot/ImmigrationChatbot';

/**
 * ResearchPage Component
 * 
 * A page that provides access to immigration research tools including
 * semantic search and an AI-powered chatbot.
 */
const ResearchPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Immigration Research Center
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Access comprehensive immigration information through our AI-powered search and chat tools. 
            Find accurate, up-to-date information about immigration pathways, requirements, and processes.
          </Typography>
        </Box>

        <Paper sx={{ mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            aria-label="research tools tabs"
          >
            <Tab 
              icon={<SearchIcon />} 
              label="Semantic Search" 
              id="tab-0" 
              aria-controls="tabpanel-0" 
            />
            <Tab 
              icon={<ChatIcon />} 
              label="AI Assistant" 
              id="tab-1" 
              aria-controls="tabpanel-1" 
            />
            <Tab 
              icon={<LibraryBooksIcon />} 
              label="Research Library" 
              id="tab-2" 
              aria-controls="tabpanel-2" 
            />
          </Tabs>
        </Paper>

        <Box role="tabpanel" hidden={activeTab !== 0} id="tabpanel-0" aria-labelledby="tab-0">
          {activeTab === 0 && <SemanticSearch />}
        </Box>

        <Box role="tabpanel" hidden={activeTab !== 1} id="tabpanel-1" aria-labelledby="tab-1">
          {activeTab === 1 && (
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Immigration Assistant
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Chat with our AI assistant to get answers to your immigration questions. 
                The assistant uses our comprehensive database of immigration information to provide accurate responses.
              </Typography>
              <ImmigrationChatbot />
            </Box>
          )}
        </Box>

        <Box role="tabpanel" hidden={activeTab !== 2} id="tabpanel-2" aria-labelledby="tab-2">
          {activeTab === 2 && (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Research Library
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Browse our curated collection of immigration resources, guides, and articles.
              </Typography>
              
              <Grid container spacing={3}>
                {researchCategories.map((category, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {category.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {category.description}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => setActiveTab(0)} // Switch to search tab with pre-filled query
                        >
                          Browse Resources
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    </MainLayout>
  );
};

// Sample research categories
const researchCategories = [
  {
    title: 'Immigration Programs',
    description: 'Information about various immigration programs, including eligibility requirements and application processes.'
  },
  {
    title: 'Document Requirements',
    description: 'Guides on required documents for different immigration pathways and how to prepare them.'
  },
  {
    title: 'Language Testing',
    description: 'Information about language proficiency tests, scoring systems, and preparation resources.'
  },
  {
    title: 'Medical Examinations',
    description: 'Requirements and procedures for immigration medical examinations.'
  },
  {
    title: 'Credential Assessment',
    description: 'Information about educational credential assessment services and processes.'
  },
  {
    title: 'Job Markets',
    description: 'Data on job markets, in-demand occupations, and employment opportunities in different countries.'
  },
  {
    title: 'Legal Information',
    description: 'Legal aspects of immigration, including rights, responsibilities, and compliance requirements.'
  },
  {
    title: 'Settlement Services',
    description: 'Resources for settling in a new country, including housing, healthcare, and education.'
  },
  {
    title: 'Application Procedures',
    description: 'Step-by-step guides for completing and submitting immigration applications.'
  }
];

export default ResearchPage;
