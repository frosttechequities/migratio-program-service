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
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SendIcon from '@mui/icons-material/Send';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';

/**
 * StandaloneResearchPage Component
 * 
 * A standalone page that provides access to immigration research tools including
 * semantic search and an AI-powered chatbot. This page doesn't depend on any
 * external services or components.
 */
const StandaloneResearchPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Search state
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your immigration assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Mock search data
  const mockSearchData = [
    {
      id: 1,
      content: "The Express Entry system is used to manage applications for permanent residence under these federal economic immigration programs: the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class. Provinces and territories can also recruit candidates from the Express Entry system through their Provincial Nominee Programs to meet local labor market needs.",
      metadata: {
        title: "Express Entry Program Guide",
        source: "Immigration Canada",
        tags: ["canada", "express entry", "immigration"]
      },
      similarity: 0.92
    },
    {
      id: 2,
      content: "When applying for immigration, you typically need to provide various documents to support your application. These may include: valid passport or travel document, birth certificate, marriage certificate (if applicable), police certificates, proof of language proficiency, educational credentials assessment, proof of funds, medical examination results, and biometric information.",
      metadata: {
        title: "Document Requirements for Immigration",
        source: "Immigration Resources",
        tags: ["documents", "requirements", "immigration"]
      },
      similarity: 0.85
    },
    {
      id: 3,
      content: "Language proficiency is a key requirement for many immigration programs. Accepted language tests vary by country, but common ones include IELTS, CELPIP, TEF, and PTE. The test results are typically valid for 2 years. The required scores vary depending on the immigration program and the country.",
      metadata: {
        title: "Language Testing for Immigration",
        source: "Immigration Resources",
        tags: ["language testing", "proficiency", "immigration"]
      },
      similarity: 0.78
    }
  ];
  
  // Mock chat responses
  const mockChatResponses = {
    "express entry": "Express Entry is Canada's immigration system that manages applications for permanent residence under three federal economic immigration programs: the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class. It uses a Comprehensive Ranking System (CRS) to score candidates based on factors like age, education, work experience, and language skills. The highest-scoring candidates receive invitations to apply for permanent residence through regular draws.",
    "document": "For most immigration applications, you'll need several key documents: a valid passport, birth certificate, marriage certificate (if applicable), police clearance certificates from countries where you've lived, proof of language proficiency (like IELTS or CELPIP test results), educational credential assessments, proof of funds to support yourself, and medical examination results. Make sure all documents are properly translated and certified if they're not in English or French.",
    "language test": "Language proficiency is crucial for most immigration programs. For English, accepted tests include IELTS (International English Language Testing System) and CELPIP (Canadian English Language Proficiency Index Program). For French, you can take the TEF (Test d'Évaluation de Français) or TCF (Test de Connaissance du Français). Test results are typically valid for 2 years, and higher scores can significantly improve your chances in points-based immigration systems.",
    "medical exam": "Immigration medical examinations must be performed by approved physicians (often called panel physicians). The exam typically includes a physical examination, chest X-ray, blood tests for conditions like HIV and syphilis, and urinalysis. Results are usually valid for 12 months. You should only undergo the medical exam after being instructed to do so by immigration authorities, as timing is important.",
    "visa": "There are many types of visas depending on your purpose of travel and destination country. Common categories include tourist visas, student visas, work visas, and permanent residence visas. Application requirements, processing times, and fees vary widely. Most visa applications require proof of purpose for your visit, financial means to support yourself, and ties to your home country to demonstrate you'll return.",
    "points calculator": "Points-based immigration systems assign scores to candidates based on factors like age, education, work experience, language proficiency, and adaptability. Canada's Express Entry uses the Comprehensive Ranking System (CRS), Australia has the SkillSelect points test, and New Zealand uses the Skilled Migrant Category (SMC) points system. Each system has different criteria and minimum score requirements for eligibility."
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      // Filter mock results based on the query
      const filteredResults = mockSearchData.filter(result => 
        result.content.toLowerCase().includes(query.toLowerCase()) || 
        result.metadata.title.toLowerCase().includes(query.toLowerCase()) ||
        (result.metadata.tags && result.metadata.tags.some(tag => 
          tag.toLowerCase().includes(query.toLowerCase())
        ))
      );
      
      setSearchResults(filteredResults.length > 0 ? filteredResults : mockSearchData);
      setIsSearching(false);
    }, 1000);
  };
  
  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate a response based on the user's message
      const userMessageLower = userMessage.content.toLowerCase();
      let response = '';
      
      // Check if the user's message contains any of the keywords
      for (const [keyword, mockResponse] of Object.entries(mockChatResponses)) {
        if (userMessageLower.includes(keyword)) {
          response = mockResponse;
          break;
        }
      }
      
      // If no specific response was found, provide a general response
      if (!response) {
        response = "I'm an immigration assistant that can help answer questions about immigration processes, requirements, and pathways. You can ask me about specific immigration programs, document requirements, language testing, medical examinations, visa applications, and more. How can I assist you today?";
      }
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsSending(false);
    }, 1500);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 8, pb: 8 }}>
      <Container maxWidth="lg">
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

        {/* Search Tab */}
        <Box role="tabpanel" hidden={activeTab !== 0} id="tabpanel-0" aria-labelledby="tab-0">
          {activeTab === 0 && (
            <Box>
              <Paper sx={{ p: 3, mb: 3 }}>
                <form onSubmit={handleSearch}>
                  <TextField
                    fullWidth
                    label="Search for immigration information"
                    variant="outlined"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            type="submit" 
                            disabled={isSearching || !query.trim()}
                            color="primary"
                          >
                            {isSearching ? <CircularProgress size={24} /> : <SearchIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
              </Paper>
              
              {searchResults.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Search Results
                  </Typography>
                  <Grid container spacing={3}>
                    {searchResults.map((result) => (
                      <Grid item xs={12} key={result.id}>
                        <Paper sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            {result.metadata.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Source: {result.metadata.source}
                          </Typography>
                          <Typography variant="body1" paragraph>
                            {result.content}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {result.metadata.tags.map((tag, index) => (
                              <Chip key={index} label={tag} size="small" />
                            ))}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Chat Tab */}
        <Box role="tabpanel" hidden={activeTab !== 1} id="tabpanel-1" aria-labelledby="tab-1">
          {activeTab === 1 && (
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Paper sx={{ p: 3, mb: 3, height: 400, overflow: 'auto' }}>
                <List>
                  {messages.map((message, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      sx={{
                        flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                        mb: 2
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main' }}>
                          {message.role === 'user' ? <PersonIcon /> : <ChatIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={message.role === 'user' ? 'You' : 'Assistant'}
                        secondary={message.content}
                        sx={{
                          '& .MuiListItemText-primary': {
                            textAlign: message.role === 'user' ? 'right' : 'left',
                          },
                          '& .MuiListItemText-secondary': {
                            backgroundColor: message.role === 'user' ? 'primary.light' : 'grey.100',
                            padding: 2,
                            borderRadius: 2,
                            color: message.role === 'user' ? 'white' : 'text.primary',
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
              
              <Paper sx={{ p: 2 }}>
                <form onSubmit={handleSendMessage}>
                  <TextField
                    fullWidth
                    label="Type your message"
                    variant="outlined"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            type="submit" 
                            disabled={isSending || !input.trim()}
                            color="primary"
                          >
                            {isSending ? <CircularProgress size={24} /> : <SendIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Library Tab */}
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
                          onClick={() => {
                            setActiveTab(0);
                            setQuery(category.title);
                            handleSearch({ preventDefault: () => {} });
                          }}
                          startIcon={<SearchIcon />}
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
    </Box>
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
  }
];

// Define Chip component for tags
const Chip = ({ label, size }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      px: 1,
      py: 0.5,
      borderRadius: '16px',
      backgroundColor: 'primary.light',
      color: 'white',
      fontSize: size === 'small' ? '0.75rem' : '0.875rem',
      fontWeight: 'medium',
    }}
  >
    {label}
  </Box>
);

export default StandaloneResearchPage;
