import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Tooltip,
  Collapse,
  Zoom,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ChatBubble as ChatBubbleIcon,
  QuestionAnswer as QuestionAnswerIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Assistant as AssistantIcon,
  Person as PersonIcon,
  Lightbulb as LightbulbIcon,
  Help as HelpIcon,
  PlayArrow as PlayArrowIcon,
  List as ListIcon
} from '@mui/icons-material';

import {
  sendMessage,
  addUserMessage,
  createConversation,
  getConversationHistory,
  getConversations,
  deleteConversation,
  getGuidedWorkflows,
  startGuidedWorkflow,
  setTyping,
  selectMessages,
  selectConversation,
  selectConversations,
  selectSuggestions,
  selectIsTyping,
  selectGuidedWorkflows,
  selectActiveWorkflow,
  selectChatbotLoading,
  selectChatbotError
} from '../chatbotSlice';

import GuidedWorkflow from './GuidedWorkflow';
import ContextualHelp from './ContextualHelp';

/**
 * EnhancedChatbotWidget component
 * Provides an enhanced chat interface for interacting with the AI assistant
 * 
 * @returns {React.ReactElement} EnhancedChatbotWidget component
 */
const EnhancedChatbotWidget = () => {
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'history', 'workflows'
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && !conversation.id) {
      dispatch(createConversation());
    }
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
    
    // Focus input
    inputRef.current?.focus();
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
    setActiveTab('chat');
  };
  
  // Handle load conversation
  const handleLoadConversation = (conversationId) => {
    dispatch(getConversationHistory(conversationId));
    setActiveTab('chat');
  };
  
  // Handle delete conversation
  const handleDeleteConversation = (conversationId, e) => {
    e.stopPropagation();
    dispatch(deleteConversation(conversationId));
  };
  
  // Handle open workflow dialog
  const handleOpenWorkflowDialog = () => {
    dispatch(getGuidedWorkflows());
    setIsWorkflowDialogOpen(true);
  };
  
  // Handle start workflow
  const handleStartWorkflow = (workflowId) => {
    dispatch(startGuidedWorkflow(workflowId));
    setIsWorkflowDialogOpen(false);
    setActiveTab('chat');
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
  
  // Load conversations on mount
  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);
  
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
            width: 32,
            height: 32,
            mr: isUser ? 0 : 1,
            ml: isUser ? 1 : 0
          }}
        >
          {isUser ? <PersonIcon fontSize="small" /> : <AssistantIcon fontSize="small" />}
        </Avatar>
        <Box
          sx={{
            maxWidth: '75%',
            p: 1.5,
            borderRadius: 2,
            bgcolor: isUser ? theme.palette.primary.light : theme.palette.grey[100],
            color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
            position: 'relative'
          }}
        >
          <Typography variant="body2">{message.content}</Typography>
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: 2,
              right: isUser ? 'auto' : 8,
              left: isUser ? 8 : 'auto',
              color: isUser ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary,
              fontSize: '0.7rem'
            }}
          >
            {message.timestamp && formatTimestamp(message.timestamp)}
          </Typography>
        </Box>
      </Box>
    );
  };
  
  return (
    <>
      {/* Floating Chat Button */}
      <Zoom in={!isExpanded}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
        >
          <Tooltip title="Chat with AI Assistant">
            <IconButton
              color="primary"
              size="large"
              onClick={toggleExpand}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: 3,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark
                }
              }}
            >
              <ChatBubbleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Zoom>
      
      {/* Chat Widget */}
      <Fade in={isExpanded}>
        <Paper
          elevation={4}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            width: 360,
            height: 480,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            borderRadius: 2
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AssistantIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                {activeTab === 'history' ? 'Conversation History' : 
                 activeTab === 'workflows' ? 'Guided Workflows' : 
                 activeWorkflow ? activeWorkflow.title : 
                 conversation.title || 'AI Assistant'}
              </Typography>
            </Box>
            <Box>
              <Tooltip title="Guided Workflows">
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={handleOpenWorkflowDialog}
                  sx={{ mr: 1 }}
                >
                  <PlayArrowIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={activeTab === 'history' ? 'Back to Chat' : 'Conversation History'}>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => setActiveTab(activeTab === 'history' ? 'chat' : 'history')}
                  sx={{ mr: 1 }}
                >
                  {activeTab === 'history' ? <QuestionAnswerIcon fontSize="small" /> : <HistoryIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={toggleExpand}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Conversation History */}
          <Collapse in={activeTab === 'history'} sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Box sx={{ p: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleNewConversation}
                fullWidth
                sx={{ mb: 2 }}
              >
                New Conversation
              </Button>
              
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <Paper
                    key={conv.id}
                    elevation={1}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      cursor: 'pointer',
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
            </Box>
          </Collapse>
          
          {/* Guided Workflow */}
          <Collapse in={activeTab === 'workflows'} sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Select a guided workflow:
              </Typography>
              
              {guidedWorkflows.length > 0 ? (
                guidedWorkflows.map((workflow) => (
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
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                  No guided workflows available.
                </Typography>
              )}
            </Box>
          </Collapse>
          
          {/* Messages */}
          <Collapse in={activeTab === 'chat'} sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
              {activeWorkflow && (
                <Paper
                  elevation={0}
                  sx={{ 
                    p: 1.5, 
                    mb: 2, 
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PlayArrowIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" fontWeight="medium">
                      {activeWorkflow.title} - Step {activeWorkflow.currentStep} of {activeWorkflow.totalSteps}
                    </Typography>
                  </Box>
                  <Typography variant="caption">
                    {activeWorkflow.steps[activeWorkflow.currentStep - 1]?.title}
                  </Typography>
                </Paper>
              )}
              
              {messages.length > 0 ? (
                messages.map((message, index) => renderMessage(message, index))
              ) : (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                  <AssistantIcon color="primary" sx={{ fontSize: 48, mb: 2, opacity: 0.7 }} />
                  <Typography variant="body1" gutterBottom>
                    How can I help you today?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
                      width: 32,
                      height: 32,
                      mr: 1
                    }}
                  >
                    <AssistantIcon fontSize="small" />
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
                    <CircularProgress size={16} thickness={6} />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      Typing...
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {/* Anchor for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </Box>
          </Collapse>
          
          {/* Contextual Help */}
          {activeTab === 'chat' && (
            <ContextualHelp />
          )}
          
          {/* Suggestions */}
          {activeTab === 'chat' && suggestions.length > 0 && (
            <Box sx={{ p: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {suggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    size="small"
                    onClick={() => handleSuggestionClick(suggestion)}
                    icon={<LightbulbIcon fontSize="small" />}
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Input */}
          {activeTab === 'chat' && (
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                variant="outlined"
                size="small"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                inputRef={inputRef}
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
          )}
        </Paper>
      </Fade>
      
      {/* Guided Workflow Dialog */}
      <Dialog
        open={isWorkflowDialogOpen}
        onClose={() => setIsWorkflowDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PlayArrowIcon sx={{ mr: 1 }} />
            Guided Workflows
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Select a guided workflow to get step-by-step assistance with common immigration tasks.
          </Typography>
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : guidedWorkflows.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {guidedWorkflows.map((workflow) => (
                <Paper
                  key={workflow.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onClick={() => handleStartWorkflow(workflow.id)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 1.5, width: 32, height: 32 }}>
                        <PlayArrowIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle1">
                        {workflow.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flexGrow: 1 }}>
                      {workflow.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={`${workflow.steps} steps`}
                        size="small"
                        variant="outlined"
                      />
                      <Button
                        size="small"
                        endIcon={<PlayArrowIcon />}
                      >
                        Start
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No guided workflows available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsWorkflowDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EnhancedChatbotWidget;
