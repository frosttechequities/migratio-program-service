import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Collapse,
  Tabs,
  Tab,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {
  updateLayoutPreferences,
  saveDashboardView,
  deleteDashboardView,
  resetPreferences,
  selectLayoutPreferences,
  selectSavedViews,
  selectPersonalizationLoading,
  selectPersonalizationError
} from '../personalizationSlice';

/**
 * DashboardCustomizer component
 * Allows users to customize their dashboard layout
 *
 * @returns {React.ReactElement} DashboardCustomizer component
 */
const DashboardCustomizer = () => {
  const dispatch = useDispatch();

  // Get state from Redux
  const layoutPreferences = useSelector(selectLayoutPreferences);
  const savedViews = useSelector(selectSavedViews);
  const isLoading = useSelector(selectPersonalizationLoading);
  const error = useSelector(selectPersonalizationError);

  // Component state
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [viewName, setViewName] = useState('');
  const [visibleWidgets, setVisibleWidgets] = useState(layoutPreferences?.visibleWidgets || []);
  const [widgetOrder, setWidgetOrder] = useState(layoutPreferences?.widgetOrder || []);
  const [saveViewError, setSaveViewError] = useState('');

  // Widget display names
  const widgetDisplayNames = {
    welcome: 'Welcome',
    journeyProgress: 'Journey Progress',
    recommendations: 'Recommendations',
    tasks: 'Upcoming Tasks',
    documents: 'Documents',
    resources: 'Resources',
    opportunities: 'Global Opportunities',
    subscription: 'Subscription Status',
    readiness: 'Readiness Checklist',
    destinations: 'Destination Suggestions',
    successProbability: 'Success Probability',
    actionRecommendations: 'Action Recommendations'
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle visibility toggle
  const handleVisibilityToggle = (widgetKey) => {
    if (visibleWidgets.includes(widgetKey)) {
      setVisibleWidgets(visibleWidgets.filter(key => key !== widgetKey));
    } else {
      setVisibleWidgets([...visibleWidgets, widgetKey]);
    }
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(widgetOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgetOrder(items);
  };

  // Apply layout changes
  const applyLayoutChanges = () => {
    dispatch(updateLayoutPreferences({
      visibleWidgets,
      widgetOrder
    }));
  };

  // Reset layout to defaults
  const resetLayout = () => {
    dispatch(resetPreferences());
    // Get default preferences
    const defaultPreferences = {
      visibleWidgets: [
        'welcome',
        'journeyProgress',
        'recommendations',
        'tasks',
        'documents',
        'resources',
        'opportunities',
        'subscription',
        'readiness',
        'destinations',
        'successProbability',
        'actionRecommendations'
      ],
      widgetOrder: [
        'welcome',
        'journeyProgress',
        'recommendations',
        'tasks',
        'documents',
        'resources',
        'opportunities',
        'subscription',
        'readiness',
        'destinations',
        'successProbability',
        'actionRecommendations'
      ]
    };
    setVisibleWidgets(layoutPreferences?.visibleWidgets || defaultPreferences.visibleWidgets);
    setWidgetOrder(layoutPreferences?.widgetOrder || defaultPreferences.widgetOrder);
  };

  // Save current view
  const saveCurrentView = () => {
    if (!viewName.trim()) {
      setSaveViewError('Please enter a name for this view');
      return;
    }

    const view = {
      name: viewName,
      layout: {
        visibleWidgets,
        widgetOrder
      }
    };

    dispatch(saveDashboardView(view));
    setViewName('');
    setSaveViewError('');
  };

  // Load saved view
  const loadSavedView = (view) => {
    setVisibleWidgets(view.layout.visibleWidgets);
    setWidgetOrder(view.layout.widgetOrder);
    dispatch(updateLayoutPreferences(view.layout));
  };

  // Delete saved view
  const deleteSavedView = (viewId) => {
    dispatch(deleteDashboardView(viewId));
  };

  return (
    <>
      {/* Customization Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SettingsIcon />}
          onClick={() => setIsOpen(!isOpen)}
        >
          Customize Dashboard
        </Button>
      </Box>

      {/* Customization Panel */}
      <Collapse in={isOpen}>
        <Paper sx={{ p: 2, mb: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="dashboard customization tabs"
            sx={{ mb: 2 }}
          >
            <Tab label="Widgets" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Layout" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="Saved Views" id="tab-2" aria-controls="tabpanel-2" />
          </Tabs>

          {/* Widgets Tab */}
          <Box
            role="tabpanel"
            hidden={activeTab !== 0}
            id="tabpanel-0"
            aria-labelledby="tab-0"
          >
            {activeTab === 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Show/Hide Widgets
                </Typography>
                <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 1 }}>
                  {Object.keys(widgetDisplayNames).map((key) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Switch
                          checked={visibleWidgets.includes(key)}
                          onChange={() => handleVisibilityToggle(key)}
                          name={key}
                          size="small"
                        />
                      }
                      label={widgetDisplayNames[key]}
                    />
                  ))}
                </FormGroup>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<RefreshIcon />}
                    onClick={resetLayout}
                    sx={{ mr: 1 }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CheckIcon />}
                    onClick={applyLayoutChanges}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Apply'}
                  </Button>
                </Box>
              </>
            )}
          </Box>

          {/* Layout Tab */}
          <Box
            role="tabpanel"
            hidden={activeTab !== 1}
            id="tabpanel-1"
            aria-labelledby="tab-1"
          >
            {activeTab === 1 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Drag to Reorder Widgets
                </Typography>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="widgets">
                    {(provided) => (
                      <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{ mb: 2 }}
                      >
                        {widgetOrder.map((widgetKey, index) => (
                          <Draggable key={widgetKey} draggableId={widgetKey} index={index}>
                            {(provided) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                elevation={1}
                                sx={{
                                  p: 1,
                                  mb: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  opacity: visibleWidgets.includes(widgetKey) ? 1 : 0.5
                                }}
                              >
                                <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                                  <DragIndicatorIcon />
                                </Box>
                                <Typography sx={{ flexGrow: 1 }}>
                                  {widgetDisplayNames[widgetKey] || widgetKey}
                                </Typography>
                                <Tooltip title={visibleWidgets.includes(widgetKey) ? 'Hide' : 'Show'}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleVisibilityToggle(widgetKey)}
                                  >
                                    {visibleWidgets.includes(widgetKey) ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                  </IconButton>
                                </Tooltip>
                              </Paper>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<RefreshIcon />}
                    onClick={resetLayout}
                    sx={{ mr: 1 }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CheckIcon />}
                    onClick={applyLayoutChanges}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Apply'}
                  </Button>
                </Box>
              </>
            )}
          </Box>

          {/* Saved Views Tab */}
          <Box
            role="tabpanel"
            hidden={activeTab !== 2}
            id="tabpanel-2"
            aria-labelledby="tab-2"
          >
            {activeTab === 2 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Save Current Layout
                </Typography>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    size="small"
                    label="View Name"
                    value={viewName}
                    onChange={(e) => setViewName(e.target.value)}
                    error={!!saveViewError}
                    helperText={saveViewError}
                    sx={{ flexGrow: 1, mr: 1 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={saveCurrentView}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Saved Views
                </Typography>
                {savedViews.length > 0 ? (
                  savedViews.map((view) => (
                    <Paper
                      key={view.id}
                      elevation={1}
                      sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center' }}
                    >
                      <Typography sx={{ flexGrow: 1 }}>
                        {view.name}
                      </Typography>
                      <Tooltip title="Load View">
                        <IconButton
                          size="small"
                          onClick={() => loadSavedView(view)}
                          sx={{ mr: 1 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete View">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteSavedView(view.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No saved views yet. Save your current layout to create one.
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default DashboardCustomizer;
