import React, { useState, useEffect } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import { Box, CircularProgress, Fab, Dialog, IconButton, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

// Define theme for the chatbot
const theme = {
  background: '#f5f8fb',
  fontFamily: 'Arial, Helvetica, sans-serif',
  headerBgColor: '#0066FF', // Visafy blue
  headerFontColor: '#fff',
  headerFontSize: '16px',
  botBubbleColor: '#0066FF',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

// Custom component for handling API-based responses
const ApiResponse = ({ previousStep, triggerNextStep }) => {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        // Use the deployed chatbot service URL
        const chatbotServiceUrl = 'https://visafy-chatbot.onrender.com/ask';
        const res = await fetch(chatbotServiceUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: previousStep.value }),
        });

        if (!res.ok) {
          throw new Error('Failed to get response from chatbot service');
        }

        const data = await res.json();
        setResponse(data.answer || 'I couldn\'t find an answer to that question.');
      } catch (err) {
        console.error('Error fetching answer:', err);
        setError(true);
        setResponse('Sorry, I\'m having trouble connecting to my knowledge base right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnswer();
  }, [previousStep.value]);

  useEffect(() => {
    if (!loading) {
      triggerNextStep();
    }
  }, [loading, triggerNextStep]);

  return (
    <div style={{ width: '100%' }}>
      {loading ? (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={20} />
        </Box>
      ) : (
        response
      )}
    </div>
  );
};

// Define the steps for the conversation
const steps = [
  {
    id: '1',
    message: 'Hello! I am Visafy Assistant. How can I help you today?',
    trigger: '2',
  },
  {
    id: '2',
    options: [
      { value: 'roadmap_help', label: 'Help with my Roadmap', trigger: 'roadmap_info' },
      { value: 'document_help', label: 'Help with Documents', trigger: 'document_info' },
      { value: 'assessment_help', label: 'Help with Assessment', trigger: 'assessment_info' },
      { value: 'immigration_question', label: 'Immigration Question', trigger: 'ask_immigration_question' },
    ],
  },
  {
    id: 'roadmap_info',
    message: 'Your roadmap shows the steps for your chosen program. You can mark tasks and documents as complete directly on the Roadmap page.',
    trigger: 'more_help',
  },
  {
    id: 'document_info',
    message: 'You can upload and manage your documents in the Documents section. Check the roadmap for required documents for each phase.',
    trigger: 'more_help',
  },
  {
    id: 'assessment_info',
    message: 'The assessment helps determine program eligibility. You can retake it if your profile changes significantly.',
    trigger: 'more_help',
  },
  {
    id: 'ask_immigration_question',
    message: 'What would you like to know about immigration programs or requirements?',
    trigger: 'user_immigration_query',
  },
  {
    id: 'user_immigration_query',
    user: true,
    trigger: 'api_response',
  },
  {
    id: 'api_response',
    component: <ApiResponse />,
    asMessage: true,
    waitAction: true,
    trigger: 'more_help',
  },
  {
    id: 'more_help',
    message: 'Can I help with anything else?',
    trigger: '2', // Loop back to options
  },
];

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Custom floating button when chatbot is closed */}
      {!open && (
        <Fab
          color="primary"
          aria-label="chat"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
          onClick={handleToggle}
        >
          <ChatIcon />
        </Fab>
      )}

      {/* Chatbot dialog */}
      <Dialog
        open={open}
        onClose={handleToggle}
        PaperProps={{
          style: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            margin: 0,
            width: '350px',
            maxWidth: '100%',
            height: '500px',
            maxHeight: '80vh',
            borderRadius: '10px',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: '#0066FF', color: 'white' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '16px' }}>
            Visafy Assistant
          </Typography>
          <IconButton size="small" color="inherit" onClick={handleToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <ThemeProvider theme={theme}>
          <ChatBot
            steps={steps}
            hideHeader={true}
            hideSubmitButton={true}
            botAvatar="https://astonishing-smakager-d8c61d.netlify.app/favicon.svg"
            userAvatar="https://ui-avatars.com/api/?background=random"
            bubbleStyle={{ maxWidth: '80%' }}
            style={{ width: '100%', height: 'calc(100% - 48px)' }}
          />
        </ThemeProvider>
      </Dialog>
    </>
  );
};

export default ChatbotWidget;
