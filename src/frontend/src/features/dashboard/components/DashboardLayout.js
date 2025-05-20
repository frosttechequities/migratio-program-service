import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { updateLayoutPreference } from '../dashboardSlice';

// Width provider enhances Responsive with width detection
const ResponsiveGridLayout = WidthProvider(Responsive);

// Memoized widget renderer component
const WidgetRenderer = memo(({ child, id }) => {
  try {
    return (
      <Box data-grid={{ i: id }}>
        <Paper
          elevation={1}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <Box
            className="widget-drag-handle"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
              cursor: 'move',
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default'
            }}
          >
            <Typography variant="subtitle2" component="div" sx={{ fontWeight: 'medium' }}>
              {child.props?.title || id}
            </Typography>
            <Tooltip title="Widget Settings">
              <IconButton size="small">
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
            {child}
          </Box>
        </Paper>
      </Box>
    );
  } catch (error) {
    console.error('Error rendering widget:', error);
    return null; // Skip rendering this widget
  }
});

// PropTypes for WidgetRenderer
WidgetRenderer.propTypes = {
  child: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired
};

// Add displayName for debugging
WidgetRenderer.displayName = 'WidgetRenderer';

/**
 * DashboardLayout component
 * Provides a responsive grid layout for dashboard widgets
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components (widgets)
 * @returns {React.ReactElement} DashboardLayout component
 */
const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();

  // Get dashboard preferences from Redux store with error handling
  const dashboardState = useSelector((state) => state.dashboard);
  const preferences = dashboardState?.preferences || {};

  // Memoize preferences to prevent unnecessary re-renders
  const visibleWidgets = React.useMemo(() => {
    return preferences.visibleWidgets || [];
  }, [preferences.visibleWidgets]);

  const layoutConfig = React.useMemo(() => {
    return preferences.layoutConfig || {};
  }, [preferences.layoutConfig]);

  // State for layout configuration
  const [layouts, setLayouts] = useState(layoutConfig);

  // Load saved layout from localStorage on mount
  useEffect(() => {
    try {
      const savedLayout = localStorage.getItem('dashboardLayout');
      if (savedLayout) {
        const parsedLayout = JSON.parse(savedLayout);
        setLayouts(parsedLayout);
        dispatch(updateLayoutPreference({ layoutConfig: parsedLayout }));
      }
    } catch (error) {
      console.error('Error loading dashboard layout from localStorage:', error);
    }
  }, [dispatch]);

  // Filter children based on visible widgets with error handling and memoization
  const visibleChildren = React.useMemo(() => {
    try {
      return React.Children.toArray(children).filter(child => {
        // If visibleWidgets is empty or not an array, show all widgets
        if (!Array.isArray(visibleWidgets) || visibleWidgets.length === 0) {
          return true;
        }

        // Check if child has props and id
        if (!child || !child.props || !child.props.id) {
          return true; // Include widgets without IDs
        }

        // Check if widget ID is in visibleWidgets array
        return visibleWidgets.includes(child.props.id);
      });
    } catch (error) {
      console.error('Error filtering visible children:', error);
      return React.Children.toArray(children); // Include all widgets on error
    }
  }, [children, visibleWidgets]);

  // Default layout configurations for different breakpoints with memoization
  const defaultLayouts = React.useMemo(() => {
    // Helper function to create layout items
    const createLayoutItem = (child, index, cols = 2) => {
      try {
        const id = child.props?.id || `widget-${index}`;
        const row = Math.floor(index / cols);
        const col = index % cols;
        const colWidth = 12 / cols;

        return {
          i: id,
          x: col * colWidth,
          y: row,
          w: colWidth,
          h: 2,
          minW: 3,
          maxW: 12,
          minH: 1,
          maxH: 4
        };
      } catch (error) {
        console.error('Error creating layout for child:', error);
        return {
          i: `widget-${index}`,
          x: 0,
          y: index,
          w: 12,
          h: 2
        };
      }
    };

    // Create layouts for different breakpoints
    return {
      lg: visibleChildren.map((child, index) => createLayoutItem(child, index, 2)),
      md: visibleChildren.map((child, index) => createLayoutItem(child, index, 2)),
      sm: visibleChildren.map((child, index) => createLayoutItem(child, index, 1)),
      xs: visibleChildren.map((child, index) => createLayoutItem(child, index, 1))
    };
  }, [visibleChildren]);

  // Handle layout change with error handling
  const handleLayoutChange = (_, allLayouts) => {
    try {
      // Update layouts state
      setLayouts(allLayouts);

      // Save to Redux store
      dispatch(updateLayoutPreference({ layoutConfig: allLayouts }));

      // Save to localStorage
      localStorage.setItem('dashboardLayout', JSON.stringify(allLayouts));
    } catch (error) {
      console.error('Error saving dashboard layout:', error);
    }
  };

  // Apply compact layout if specified in preferences with memoization
  const compactLayout = React.useMemo(() => {
    try {
      if (preferences.layout === 'compact') {
        return {
          lg: visibleChildren.map((child, index) => {
            try {
              const id = child.props?.id || `widget-${index}`;
              const row = Math.floor(index / 3);
              const col = index % 3;

              return {
                i: id,
                x: col * 4,
                y: row,
                w: 4,
                h: 2
              };
            } catch (error) {
              console.error('Error creating compact layout for child:', error);
              return {
                i: `widget-${index}`,
                x: 0,
                y: index,
                w: 4,
                h: 2
              };
            }
          })
        };
      }
      return null;
    } catch (error) {
      console.error('Error creating compact layout:', error);
      return null;
    }
  }, [preferences.layout, visibleChildren]);

  // Apply compact layout if specified
  useEffect(() => {
    if (compactLayout) {
      setLayouts(compactLayout);
      dispatch(updateLayoutPreference({ layoutConfig: compactLayout }));
    }
  }, [compactLayout, dispatch]);

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <ResponsiveGridLayout
        className="dashboard-layout"
        layouts={layouts || defaultLayouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
        rowHeight={100}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={true}
        useCSSTransforms={true}
        draggableHandle=".widget-drag-handle"
      >
        {/* Create a memoized widget renderer component */}
        {visibleChildren.map((child, index) => {
          // Extract widget ID for key
          const id = child.props?.id || `widget-${index}`;

          // Use key to ensure proper reconciliation
          return (
            <WidgetRenderer
              key={id}
              child={child}
              id={id}
            />
          );
        })}
      </ResponsiveGridLayout>
    </Box>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default DashboardLayout;