import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
  Divider,
  Tooltip,
  Button,
  Card,
  CardContent
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const API_URL = process.env.REACT_APP_VECTOR_SEARCH_SERVICE_URL || 'https://visafy-vector-search-service.onrender.com';

/**
 * ImmigrationChatbot Component
 *
 * A chatbot component that uses the vector database to provide relevant answers
 * to immigration-related questions.
 */
const ImmigrationChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your immigration assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      let relevantDocuments = [];
      let assistantResponse = '';

      // Try to connect to the API
      try {
        // First, search for relevant documents
        const searchResponse = await axios.post(`${API_URL}/search`, {
          query: userMessage.content,
          limit: 3,
          threshold: 0.6
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        relevantDocuments = searchResponse.data.results || [];

        // Then, generate a response using the relevant documents as context
        const chatResponse = await axios.post(`${API_URL}/chat`, {
          messages: [
            ...messages.slice(-6).map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: userMessage.content }
          ],
          context: relevantDocuments.map(doc => doc.content).join('\n\n')
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        assistantResponse = chatResponse.data.response;
      } catch (apiError) {
        console.error('API error:', apiError);

        // If the API is not available, use mock data
        console.log('Using mock data for chat response');

        // Mock data for demonstration purposes
        const mockResponses = {
          "express entry": "Express Entry is Canada's immigration system that manages applications for permanent residence under three federal economic immigration programs: the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class. It uses a Comprehensive Ranking System (CRS) to score candidates based on factors like age, education, work experience, and language skills. The highest-scoring candidates receive invitations to apply for permanent residence through regular draws.",
          "document": "For most immigration applications, you'll need several key documents: a valid passport, birth certificate, marriage certificate (if applicable), police clearance certificates from countries where you've lived, proof of language proficiency (like IELTS or CELPIP test results), educational credential assessments, proof of funds to support yourself, and medical examination results. Make sure all documents are properly translated and certified if they're not in English or French.",
          "language test": "Language proficiency is crucial for most immigration programs. For English, accepted tests include IELTS (International English Language Testing System) and CELPIP (Canadian English Language Proficiency Index Program). For French, you can take the TEF (Test d'Évaluation de Français) or TCF (Test de Connaissance du Français). Test results are typically valid for 2 years, and higher scores can significantly improve your chances in points-based immigration systems.",
          "medical exam": "Immigration medical examinations must be performed by approved physicians (often called panel physicians). The exam typically includes a physical examination, chest X-ray, blood tests for conditions like HIV and syphilis, and urinalysis. Results are usually valid for 12 months. You should only undergo the medical exam after being instructed to do so by immigration authorities, as timing is important.",
          "visa": "There are many types of visas depending on your purpose of travel and destination country. Common categories include tourist visas, student visas, work visas, and permanent residence visas. Application requirements, processing times, and fees vary widely. Most visa applications require proof of purpose for your visit, financial means to support yourself, and ties to your home country to demonstrate you'll return.",
          "points calculator": "Points-based immigration systems assign scores to candidates based on factors like age, education, work experience, language proficiency, and adaptability. Canada's Express Entry uses the Comprehensive Ranking System (CRS), Australia has the SkillSelect points test, and New Zealand uses the Skilled Migrant Category (SMC) points system. Each system has different criteria and minimum score requirements for eligibility."
        };

        // Generate a response based on the user's message
        const userMessageLower = userMessage.content.toLowerCase();
        let foundResponse = false;

        // Check if the user's message contains any of the keywords
        for (const [keyword, response] of Object.entries(mockResponses)) {
          if (userMessageLower.includes(keyword)) {
            assistantResponse = response;
            foundResponse = true;
            break;
          }
        }

        // If no specific response was found, provide a general response
        if (!foundResponse) {
          assistantResponse = "I'm an immigration assistant that can help answer questions about immigration processes, requirements, and pathways. You can ask me about specific immigration programs, document requirements, language testing, medical examinations, visa applications, and more. How can I assist you today?";
        }

        // Mock relevant documents
        relevantDocuments = [
          {
            id: 1,
            content: "Immigration processes vary by country but generally involve several steps: determining eligibility for a specific immigration program, gathering required documents, submitting an application, undergoing medical and security checks, and attending an interview if required.",
            metadata: {
              title: "Immigration Process Overview",
              source: "Immigration Resources",
              tags: ["immigration", "process", "overview"]
            }
          }
        ];
      }

      // Add assistant response to chat
      const assistantMessage = {
        role: 'assistant',
        content: assistantResponse,
        sources: relevantDocuments.length > 0 ? relevantDocuments : null
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Sorry, I encountered an error. Please try again.');

      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          error: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Function to render a message
  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';

    return (
      <Box
        key={index}
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            maxWidth: '70%',
          }}
        >
          {!isUser && (
            <Avatar
              sx={{
                bgcolor: message.error ? 'error.main' : 'primary.main',
                mr: 1,
                alignSelf: 'flex-start'
              }}
            >
              <SmartToyIcon />
            </Avatar>
          )}

          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: isUser ? 'primary.light' : 'background.paper',
              color: isUser ? 'primary.contrastText' : 'text.primary',
            }}
          >
            <Typography variant="body1" component="div">
              {message.content}
            </Typography>

            {message.sources && (
              <Box sx={{ mt: 1 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Sources:
                </Typography>
                {message.sources.map((source, idx) => (
                  <Tooltip
                    key={idx}
                    title={source.content.substring(0, 200) + '...'}
                    arrow
                  >
                    <Button
                      variant="text"
                      size="small"
                      sx={{ ml: 1, textTransform: 'none' }}
                    >
                      {source.metadata?.title || source.metadata?.filename || `Source ${idx + 1}`}
                    </Button>
                  </Tooltip>
                ))}
              </Box>
            )}
          </Paper>

          {isUser && (
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
                ml: 1,
                alignSelf: 'flex-start'
              }}
            >
              <PersonIcon />
            </Avatar>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 2, flexGrow: 0 }}>
        <Typography variant="h6" component="div">
          Immigration Assistant
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ask me anything about immigration processes and requirements
        </Typography>
      </CardContent>

      <Divider />

      <Box sx={{
        p: 2,
        flexGrow: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.map(renderMessage)}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            size="small"
            autoComplete="off"
          />
          <IconButton
            color="primary"
            type="submit"
            disabled={loading || !input.trim()}
            sx={{ ml: 1 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default ImmigrationChatbot;
