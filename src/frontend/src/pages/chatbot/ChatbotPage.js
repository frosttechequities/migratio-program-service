import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  Breadcrumbs,
  Link,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  QuestionAnswer as QuestionAnswerIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Assistant as AssistantIcon,
  Person as PersonIcon,
  PlayArrow as PlayArrowIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

import {
  sendMessage,
  addUserMessage,
  createConversation,
  getConversationHistory,
  getConversations,
  deleteConversation,
  getGuidedWorkflows,
  startGuidedWorkflow,
  selectMessages,
  selectConversation,
  selectConversations,
  selectSuggestions,
  selectIsTyping,
  selectGuidedWorkflows,
  selectActiveWorkflow,
  selectChatbotLoading,
  selectChatbotError
} from '../../features/chatbot/chatbotSlice';

import GuidedWorkflow from '../../features/chatbot/components/GuidedWorkflow';
import ContextualHelp from '../../features/chatbot/components/ContextualHelp';
import SuggestionSystem from '../../features/chatbot/components/SuggestionSystem';

/**
 * ChatbotPage component
 * Full-page chatbot interface with guided workflows and conversation history
 *
 * @returns {React.ReactElement} ChatbotPage component
 */
const ChatbotPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  // Get state from Redux
  const messages = useSelector(selectMessages);
  const conversation = useSelector(selectConversation);
  const conversations = useSelector(selectConversations);
  const suggestions = useSelector(selectSuggestions);
  const isTyping = useSelector(selectIsTyping);
  const guidedWorkflows = useSelector(selectGuidedWorkflows);
  const activeWorkflow = useSelector(selectActiveWorkflow);
  const isLoading = useSelector(selectChatbotLoading);
  const error = useSelector(selectChatbotError);

  // Component state
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Refs
  const messagesEndRef = React.useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    dispatch(addUserMessage(inputValue));

    // Send message to chatbot
    dispatch(sendMessage(inputValue));

    // Clear input
    setInputValue('');
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    // Add user message to chat
    dispatch(addUserMessage(suggestion));

    // Send message to chatbot
    dispatch(sendMessage(suggestion));
  };

  // Handle new conversation
  const handleNewConversation = () => {
    dispatch(createConversation());
  };

  // Handle load conversation
  const handleLoadConversation = (conversationId) => {
    dispatch(getConversationHistory(conversationId));
  };

  // Handle delete conversation
  const handleDeleteConversation = (conversationId, e) => {
    e.stopPropagation();
    dispatch(deleteConversation(conversationId));
  };

  // Handle start workflow
  const handleStartWorkflow = (workflowId) => {
    dispatch(startGuidedWorkflow(workflowId));
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Load conversations and workflows on mount
  useEffect(() => {
    dispatch(getConversations());
    dispatch(getGuidedWorkflows());

    // Create a new conversation if none exists
    if (!conversation.id) {
      dispatch(createConversation());
    }
  }, [dispatch, conversation.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Render message
  const renderMessage = (message, index) => {
    const isUser = message.sender === 'user';

    return (
      <Box
        key={message.id || index}
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          mb: 2
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? theme.palette.primary.main : theme.palette.secondary.main,
            width: 40,
            height: 40,
            mr: isUser ? 0 : 1.5,
            ml: isUser ? 1.5 : 0
          }}
        >
          {isUser ? <PersonIcon /> : <AssistantIcon />}
        </Avatar>
        <Box
          sx={{
            maxWidth: '75%',
            p: 2,
            borderRadius: 2,
            bgcolor: isUser ? theme.palette.primary.light : theme.palette.grey[100],
            color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
            position: 'relative'
          }}
        >
          <Typography variant="body1">{message.content}</Typography>
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: 4,
              right: isUser ? 'auto' : 12,
              left: isUser ? 12 : 'auto',
              color: isUser ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary
            }}
          >
            {message.timestamp && formatTimestamp(message.timestamp)}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          color="inherit"
          component={RouterLink}
          to="/dashboard"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Dashboard
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <QuestionAnswerIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          AI Assistant
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          AI Immigration Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get personalized guidance and answers to your immigration questions.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="chatbot tabs"
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              <Tab
                icon={<HistoryIcon />}
                label="History"
                id="tab-0"
                aria-controls="tabpanel-0"
              />
              <Tab
                icon={<PlayArrowIcon />}
                label="Guides"
                id="tab-1"
                aria-controls="tabpanel-1"
              />
            </Tabs>

            {/* Conversation History Tab */}
            <Box
              role="tabpanel"
              hidden={activeTab !== 0}
              id="tabpanel-0"
              aria-labelledby="tab-0"
            >
              {activeTab === 0 && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleNewConversation}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    New Conversation
                  </Button>

                  <List sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                    {conversations.length > 0 ? (
                      conversations.map((conv) => (
                        <Paper
                          key={conv.id}
                          elevation={1}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            cursor: 'pointer',
                            bgcolor: conv.id === conversation.id ? theme.palette.action.selected : 'inherit',
                            '&:hover': {
                              bgcolor: theme.palette.action.hover
                            }
                          }}
                          onClick={() => handleLoadConversation(conv.id)}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" fontWeight="medium">
                              {conv.title}
                            </Typography>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => handleDeleteConversation(conv.id, e)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {conv.createdAt && formatDate(conv.createdAt)}
                          </Typography>
                        </Paper>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                        No conversation history yet.
                      </Typography>
                    )}
                  </List>
                </>
              )}
            </Box>

            {/* Guided Workflows Tab */}
            <Box
              role="tabpanel"
              hidden={activeTab !== 1}
              id="tabpanel-1"
              aria-labelledby="tab-1"
            >
              {activeTab === 1 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Select a guided workflow:
                  </Typography>

                  {isLoading && !guidedWorkflows.length ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : guidedWorkflows.length > 0 ? (
                    <List sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                      {guidedWorkflows.map((workflow) => (
                        <Paper
                          key={workflow.id}
                          elevation={1}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: theme.palette.action.hover
                            }
                          }}
                          onClick={() => handleStartWorkflow(workflow.id)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 1.5, width: 32, height: 32 }}>
                              <PlayArrowIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {workflow.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {workflow.description}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                      No guided workflows available.
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Main Chat Area */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssistantIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {activeWorkflow ? activeWorkflow.title : conversation.title || 'AI Assistant'}
                </Typography>
              </Box>
              {activeWorkflow && (
                <Chip
                  label={`Step ${activeWorkflow.currentStep} of ${activeWorkflow.totalSteps}`}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>

            {/* Active Workflow */}
            {activeWorkflow && (
              <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <GuidedWorkflow onComplete={() => {}} />
              </Box>
            )}

            {/* Messages */}
            <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
              {messages.length > 0 ? (
                messages.map((message, index) => renderMessage(message, index))
              ) : (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                  <AssistantIcon color="primary" sx={{ fontSize: 64, mb: 2, opacity: 0.7 }} />
                  <Typography variant="h5" gutterBottom>
                    How can I help you today?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Ask me anything about immigration, visa processes, or settlement.
                  </Typography>
                </Box>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      width: 40,
                      height: 40,
                      mr: 1.5
                    }}
                  >
                    <AssistantIcon />
                  </Avatar>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: theme.palette.grey[100],
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <CircularProgress size={20} thickness={6} />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      Typing...
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Anchor for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </Box>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="subtitle2" gutterBottom>
                  Suggested Questions:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Input */}
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                variant="outlined"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                    >
                      {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                    </IconButton>
                  )
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatbotPage;
