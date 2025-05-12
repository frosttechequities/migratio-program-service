import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import { Box } from '@mui/material'; // Use MUI Box for positioning if needed

// Define theme for the chatbot (optional, customize as needed)
const theme = {
  background: '#f5f8fb',
  fontFamily: 'Arial, Helvetica, sans-serif',
  headerBgColor: '#007bff', // Example primary color
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#007bff',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

// Define the steps for the conversation
const steps = [
  {
    id: '1',
    message: 'Hello! I am Migratio Assistant. How can I help you today?',
    trigger: '2',
  },
  {
    id: '2',
    options: [
      { value: 'roadmap_help', label: 'Help with my Roadmap', trigger: 'roadmap_info' },
      { value: 'document_help', label: 'Help with Documents', trigger: 'document_info' },
      { value: 'assessment_help', label: 'Help with Assessment', trigger: 'assessment_info' },
      { value: 'other_help', label: 'Something else', trigger: 'other_info' },
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
    id: 'other_info',
    message: 'Okay, please describe what you need help with, and I\'ll do my best or suggest contacting support.',
    trigger: 'user_query', // Trigger user input step
  },
  {
      id: 'user_query',
      user: true, // Marks this step as waiting for user input
      trigger: 'query_received',
  },
  {
      id: 'query_received',
      message: 'Thanks! While I am still learning, you might find answers in our Help Center or by contacting support for complex issues.',
      trigger: 'more_help',
  },
  {
    id: 'more_help',
    message: 'Can I help with anything else?',
    trigger: '2', // Loop back to options
  },
];

const ChatbotWidget = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* The floating prop makes it appear as a floating button */}
      <ChatBot
        steps={steps}
        floating={true} // Enable floating button mode
        headerTitle="Migratio Assistant"
        // Optionally add userAvatar, botAvatar etc.
        // userAvatar={'path/to/user/avatar.png'}
        // botAvatar={'path/to/bot/avatar.png'}
        // Customize bubble styles, etc.
        bubbleStyle={{ maxWidth: '80%' }}
        // Add recognitionEnable={true} for speech recognition (requires browser support)
      />
    </ThemeProvider>
  );
};

export default ChatbotWidget;
