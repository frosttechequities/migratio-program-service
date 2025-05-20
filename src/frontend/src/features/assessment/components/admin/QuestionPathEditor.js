import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import assessmentService from '../../assessmentService';

/**
 * QuestionPathEditor component
 * Admin interface for configuring question paths
 */
const QuestionPathEditor = () => {
  // State for all questions
  const [questions, setQuestions] = useState([]);
  // State for the selected question
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  // State for the edited question
  const [editedQuestion, setEditedQuestion] = useState(null);
  // State for the branching logic
  const [branchingLogic, setBranchingLogic] = useState([]);
  // State for the default next question
  const [defaultNextQuestion, setDefaultNextQuestion] = useState('');
  // State for the question priority
  const [priority, setPriority] = useState(5);
  // State for the relevance condition
  const [relevanceCondition, setRelevanceCondition] = useState('');
  // State for the dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  // State for the condition dialog
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false);
  // State for the new condition
  const [newCondition, setNewCondition] = useState({
    condition: '',
    nextQuestionId: ''
  });
  // State for validation errors
  const [validationError, setValidationError] = useState('');

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, []);

  // Load questions from the service
  const loadQuestions = () => {
    const allQuestions = assessmentService.getAllQuestions();
    setQuestions(allQuestions);
  };

  // Handle question selection
  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setEditedQuestion({ ...question });
    setBranchingLogic(question.nextQuestionLogic || []);
    setDefaultNextQuestion(question.defaultNextQuestionId || '');
    setPriority(question.priority || 5);
    setRelevanceCondition(question.relevanceCondition || '');
    setValidationError('');
  };

  // Handle adding a new branching condition
  const handleAddCondition = () => {
    setNewCondition({
      condition: '',
      nextQuestionId: ''
    });
    setConditionDialogOpen(true);
  };

  // Handle saving a new branching condition
  const handleSaveCondition = () => {
    // Validate the condition
    if (!newCondition.condition) {
      setValidationError('Condition is required');
      return;
    }
    if (!newCondition.nextQuestionId) {
      setValidationError('Next question is required');
      return;
    }

    // Add the new condition to the branching logic
    setBranchingLogic([...branchingLogic, newCondition]);
    setConditionDialogOpen(false);
    setValidationError('');
  };

  // Handle removing a branching condition
  const handleRemoveCondition = (index) => {
    const updatedLogic = [...branchingLogic];
    updatedLogic.splice(index, 1);
    setBranchingLogic(updatedLogic);
  };

  // Handle saving the question
  const handleSaveQuestion = () => {
    // Validate the question
    if (!editedQuestion) {
      setValidationError('No question selected');
      return;
    }
    if (!defaultNextQuestion && branchingLogic.length === 0) {
      setValidationError('Either default next question or branching logic is required');
      return;
    }

    // Create the updated question
    const updatedQuestion = {
      ...editedQuestion,
      nextQuestionLogic: branchingLogic,
      defaultNextQuestionId: defaultNextQuestion,
      priority: priority,
      relevanceCondition: relevanceCondition
    };

    // TODO: Save the updated question to the service
    console.log('Saving question:', updatedQuestion);

    // Show success dialog
    setDialogOpen(true);
  };

  // Render the question list
  const renderQuestionList = () => {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Questions
        </Typography>
        <Grid container spacing={2}>
          {questions.map((question) => (
            <Grid item xs={12} sm={6} md={4} key={question.id}>
              <Card 
                variant="outlined"
                sx={{ 
                  cursor: 'pointer',
                  bgcolor: selectedQuestion?.id === question.id ? 'primary.light' : 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => handleSelectQuestion(question)}
              >
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {question.text.length > 50 ? question.text.substring(0, 50) + '...' : question.text}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {question.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {question.type}
                  </Typography>
                  {question.nextQuestionLogic && (
                    <Chip 
                      label={`${question.nextQuestionLogic.length} Paths`} 
                      size="small" 
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Render the question editor
  const renderQuestionEditor = () => {
    if (!selectedQuestion) {
      return (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            Select a question to edit its path configuration
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Edit Question Path
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {selectedQuestion.text}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ID: {selectedQuestion.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Type: {selectedQuestion.type}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Branching Logic
          </Typography>
          
          {branchingLogic.length === 0 ? (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              No branching logic defined
            </Typography>
          ) : (
            branchingLogic.map((logic, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Condition:</strong> {logic.condition}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Next Question:</strong> {logic.nextQuestionId}
                  </Typography>
                </Box>
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveCondition(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          )}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddCondition}
            sx={{ mt: 1 }}
          >
            Add Condition
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="default-next-question-label">Default Next Question</InputLabel>
            <Select
              labelId="default-next-question-label"
              value={defaultNextQuestion}
              onChange={(e) => setDefaultNextQuestion(e.target.value)}
              label="Default Next Question"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {questions.map((q) => (
                <MenuItem key={q.id} value={q.id}>
                  {q.id} - {q.text.substring(0, 30)}...
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Priority"
            type="number"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value))}
            helperText="Higher number = higher priority"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Relevance Condition"
            value={relevanceCondition}
            onChange={(e) => setRelevanceCondition(e.target.value)}
            helperText="JavaScript condition to determine if this question should be shown"
            sx={{ mb: 2 }}
          />
        </Box>

        {validationError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {validationError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveQuestion}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Question Path Editor
      </Typography>
      <Typography variant="body1" paragraph>
        Configure the branching logic and question paths for the assessment quiz
      </Typography>

      {renderQuestionList()}
      {renderQuestionEditor()}

      {/* Success Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Changes Saved</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            The question path configuration has been saved successfully.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Condition Dialog */}
      <Dialog open={conditionDialogOpen} onClose={() => setConditionDialogOpen(false)}>
        <DialogTitle>Add Branching Condition</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Condition"
            value={newCondition.condition}
            onChange={(e) => setNewCondition({ ...newCondition, condition: e.target.value })}
            helperText="JavaScript condition (e.g., answer === 'value')"
            sx={{ mb: 2, mt: 1 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="next-question-label">Next Question</InputLabel>
            <Select
              labelId="next-question-label"
              value={newCondition.nextQuestionId}
              onChange={(e) => setNewCondition({ ...newCondition, nextQuestionId: e.target.value })}
              label="Next Question"
            >
              {questions.map((q) => (
                <MenuItem key={q.id} value={q.id}>
                  {q.id} - {q.text.substring(0, 30)}...
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {validationError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {validationError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConditionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveCondition} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionPathEditor;
