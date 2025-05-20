import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  ContentCopy as ContentCopyIcon,
  Add as AddIcon
} from '@mui/icons-material';

import {
  updateLayoutPreferences,
  saveDashboardView,
  deleteDashboardView,
  selectSavedViews,
  selectLayoutPreferences,
  selectPersonalizationLoading,
  selectPersonalizationError
} from '../personalizationSlice';

/**
 * SavedViewsManager component
 * Manages saved dashboard views
 * 
 * @returns {React.ReactElement} SavedViewsManager component
 */
const SavedViewsManager = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  // Get state from Redux
  const savedViews = useSelector(selectSavedViews);
  const currentLayout = useSelector(selectLayoutPreferences);
  const isLoading = useSelector(selectPersonalizationLoading);
  const error = useSelector(selectPersonalizationError);
  
  // Component state
  const [viewName, setViewName] = useState('');
  const [viewDescription, setViewDescription] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const [dialogAction, setDialogAction] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  
  // Handle dialog open
  const handleOpenDialog = (action, view = null) => {
    setDialogAction(action);
    setSelectedView(view);
    
    if (action === 'save') {
      setViewName('');
      setViewDescription('');
    } else if (action === 'edit' && view) {
      setViewName(view.name);
      setViewDescription(view.description || '');
    } else if (action === 'share' && view) {
      // Generate share URL
      const baseUrl = window.location.origin;
      const viewData = encodeURIComponent(JSON.stringify(view.layout));
      setShareUrl(`${baseUrl}/dashboard?view=${viewData}`);
    }
    
    setIsDialogOpen(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSaveError('');
  };
  
  // Handle save view
  const handleSaveView = () => {
    if (!viewName.trim()) {
      setSaveError('Please enter a name for this view');
      return;
    }
    
    const view = {
      name: viewName.trim(),
      description: viewDescription.trim(),
      layout: currentLayout,
      createdAt: new Date().toISOString()
    };
    
    dispatch(saveDashboardView(view));
    handleCloseDialog();
  };
  
  // Handle update view
  const handleUpdateView = () => {
    if (!viewName.trim()) {
      setSaveError('Please enter a name for this view');
      return;
    }
    
    if (!selectedView) return;
    
    const updatedView = {
      ...selectedView,
      name: viewName.trim(),
      description: viewDescription.trim(),
      updatedAt: new Date().toISOString()
    };
    
    dispatch(saveDashboardView(updatedView));
    handleCloseDialog();
  };
  
  // Handle delete view
  const handleDeleteView = () => {
    if (!selectedView) return;
    
    dispatch(deleteDashboardView(selectedView.id));
    handleCloseDialog();
  };
  
  // Handle load view
  const handleLoadView = (view) => {
    dispatch(updateLayoutPreferences(view.layout));
  };
  
  // Handle copy share URL
  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    // TODO: Show success message
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Check for URL params on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    
    if (viewParam) {
      try {
        const viewData = JSON.parse(decodeURIComponent(viewParam));
        dispatch(updateLayoutPreferences(viewData));
      } catch (error) {
        console.error('Error parsing view data from URL:', error);
      }
    }
  }, [dispatch]);
  
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Saved Dashboard Views
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('save')}
        >
          Save Current View
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : savedViews.length > 0 ? (
        <Grid container spacing={3}>
          {savedViews.map((view) => (
            <Grid item xs={12} sm={6} md={4} key={view.id}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {view.name}
                    </Typography>
                    <Chip 
                      label={formatDate(view.createdAt)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  
                  {view.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {view.description}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    Widgets: {view.layout.visibleWidgets.length}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Tooltip title="Load View">
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleLoadView(view)}
                    >
                      Load
                    </Button>
                  </Tooltip>
                  <Box sx={{ flexGrow: 1 }} />
                  <Tooltip title="Share">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog('share', view)}
                    >
                      <ShareIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog('edit', view)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDialog('delete', view)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            You don't have any saved dashboard views yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customize your dashboard and save the layout for quick access later.
          </Typography>
        </Box>
      )}
      
      {/* Save/Edit Dialog */}
      <Dialog open={isDialogOpen && (dialogAction === 'save' || dialogAction === 'edit')} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogAction === 'save' ? 'Save Current View' : 'Edit View'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === 'save' 
              ? 'Save your current dashboard layout as a named view for quick access later.'
              : 'Update the details of this saved view.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="View Name"
            type="text"
            fullWidth
            variant="outlined"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            error={!!saveError}
            helperText={saveError}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={viewDescription}
            onChange={(e) => setViewDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={dialogAction === 'save' ? handleSaveView : handleUpdateView}
            variant="contained"
            startIcon={dialogAction === 'save' ? <SaveIcon /> : <EditIcon />}
          >
            {dialogAction === 'save' ? 'Save View' : 'Update View'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen && dialogAction === 'delete'} onClose={handleCloseDialog}>
        <DialogTitle>Delete Saved View</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the saved view "{selectedView?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteView}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={isDialogOpen && dialogAction === 'share'} onClose={handleCloseDialog}>
        <DialogTitle>Share Dashboard View</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Share this dashboard view with others by copying the link below:
          </DialogContentText>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={shareUrl}
              InputProps={{
                readOnly: true,
              }}
            />
            <Tooltip title="Copy Link">
              <IconButton onClick={handleCopyShareUrl} sx={{ ml: 1 }}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SavedViewsManager;
