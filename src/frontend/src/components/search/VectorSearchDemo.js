import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';

const API_URL = process.env.REACT_APP_VECTOR_SEARCH_SERVICE_URL || 'https://visafy-vector-search-service.onrender.com';

/**
 * VectorSearchDemo Component
 * 
 * A demo component to showcase the vector search and chat functionality.
 */
const VectorSearchDemo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  
  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    setSearchError('');
    
    try {
      const response = await axios.post(`${API_URL}/search`, {
        query: searchQuery,
        limit: 5,
        threshold: 0.6
      });
      
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchError('Failed to search. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };
  
  // Handle chat
  const handleChat = async () => {
    if (!chatMessage.trim()) return;
    
    setChatLoading(true);
    setChatError('');
    
    // Add user message to chat history
    const userMessage = { role: 'user', content: chatMessage };
    setChatHistory(prev => [...prev, userMessage]);
    
    try {
      const response = await axios.post(`${API_URL}/chat`, {
        messages: [...chatHistory, userMessage]
      });
      
      // Add assistant response to chat history
      const assistantMessage = { 
        role: 'assistant', 
        content: response.data.response,
        model: response.data.model,
        hasContext: response.data.hasContext
      };
      
      setChatHistory(prev => [...prev, assistantMessage]);
      setChatMessage(''); // Clear input
    } catch (error) {
      console.error('Error chatting:', error);
      setChatError('Failed to get a response. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vector Search Demo
      </Typography>
      
      <Grid container spacing={4}>
        {/* Search Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Semantic Search
              </Typography>
              
              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  fullWidth
                  label="Search Query"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={searchLoading}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  disabled={searchLoading}
                  startIcon={searchLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                  sx={{ ml: 1 }}
                >
                  Search
                </Button>
              </Box>
              
              {searchError && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {searchError}
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Results ({searchResults.length})
              </Typography>
              
              {searchResults.length > 0 ? (
                <List>
                  {searchResults.map((result, index) => (
                    <Paper key={index} elevation={1} sx={{ mb: 2, p: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        {result.metadata?.title || 'Untitled Document'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {result.content.length > 200 
                          ? `${result.content.substring(0, 200)}...` 
                          : result.content}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          {result.metadata?.tags?.map((tag, i) => (
                            <Chip 
                              key={i} 
                              label={tag} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }} 
                            />
                          ))}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Similarity: {(result.similarity * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No results found. Try a different query.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Chat Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Immigration Chatbot
              </Typography>
              
              <Box sx={{ height: 400, overflowY: 'auto', mb: 2, p: 1 }}>
                {chatHistory.length > 0 ? (
                  <List>
                    {chatHistory.map((message, index) => (
                      <ListItem 
                        key={index}
                        alignItems="flex-start"
                        sx={{ 
                          flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                          mb: 1 
                        }}
                      >
                        <Paper 
                          elevation={1}
                          sx={{ 
                            p: 2, 
                            maxWidth: '80%',
                            bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100',
                            color: message.role === 'user' ? 'white' : 'text.primary'
                          }}
                        >
                          <ListItemText
                            primary={message.content}
                            secondary={
                              message.role === 'assistant' && message.model ? (
                                <Typography variant="caption" component="span">
                                  {message.model} {message.hasContext ? '(with context)' : ''}
                                </Typography>
                              ) : null
                            }
                          />
                        </Paper>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      Start a conversation with the immigration chatbot.
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {chatError && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {chatError}
                </Typography>
              )}
              
              <Box sx={{ display: 'flex' }}>
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                  disabled={chatLoading}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChat}
                  disabled={chatLoading}
                  startIcon={chatLoading ? <CircularProgress size={20} /> : <ChatIcon />}
                  sx={{ ml: 1 }}
                >
                  Send
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VectorSearchDemo;
