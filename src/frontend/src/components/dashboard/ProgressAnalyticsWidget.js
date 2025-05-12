import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  ToggleButtonGroup, 
  ToggleButton,
  useTheme
} from '@mui/material';
import { 
  InsightsOutlined as InsightsIcon,
  TrendingUp as TrendingUpIcon,
  CalendarViewMonth as CalendarViewMonthIcon,
  CalendarViewWeek as CalendarViewWeekIcon
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

/**
 * Progress Analytics widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Object} props.data - Dashboard data for analytics
 * @returns {React.ReactNode} Progress Analytics widget component
 */
const ProgressAnalyticsWidget = ({ data }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState('progress');
  const [timeRange, setTimeRange] = useState('month');
  
  // Handle chart type change
  const handleChartTypeChange = (event, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };
  
  // Handle time range change
  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };
  
  // Generate progress data
  const generateProgressData = () => {
    if (!data) return [];
    
    // In a real app, this would come from the backend
    // For demo purposes, we'll generate mock data
    
    if (timeRange === 'week') {
      return [
        { name: 'Mon', progress: 10 },
        { name: 'Tue', progress: 15 },
        { name: 'Wed', progress: 20 },
        { name: 'Thu', progress: 25 },
        { name: 'Fri', progress: 30 },
        { name: 'Sat', progress: 35 },
        { name: 'Sun', progress: 40 }
      ];
    } else {
      return [
        { name: 'Week 1', progress: 10 },
        { name: 'Week 2', progress: 20 },
        { name: 'Week 3', progress: 30 },
        { name: 'Week 4', progress: 40 }
      ];
    }
  };
  
  // Generate task completion data
  const generateTaskData = () => {
    if (!data) return [];
    
    // In a real app, this would come from the backend
    // For demo purposes, we'll generate mock data
    
    if (timeRange === 'week') {
      return [
        { name: 'Mon', completed: 2, total: 5 },
        { name: 'Tue', completed: 3, total: 5 },
        { name: 'Wed', completed: 4, total: 6 },
        { name: 'Thu', completed: 5, total: 7 },
        { name: 'Fri', completed: 6, total: 8 },
        { name: 'Sat', completed: 7, total: 9 },
        { name: 'Sun', completed: 8, total: 10 }
      ];
    } else {
      return [
        { name: 'Week 1', completed: 5, total: 10 },
        { name: 'Week 2', completed: 10, total: 15 },
        { name: 'Week 3', completed: 15, total: 20 },
        { name: 'Week 4', completed: 20, total: 25 }
      ];
    }
  };
  
  // Generate milestone data for pie chart
  const generateMilestoneData = () => {
    if (!data) return [];
    
    // In a real app, this would come from the backend
    // For demo purposes, we'll use mock data
    return [
      { name: 'Completed', value: data?.overview?.tasksCompleted || 8 },
      { name: 'In Progress', value: data?.overview?.totalTasks ? 
        Math.max(0, data.overview.totalTasks - data.overview.tasksCompleted - 2) : 5 },
      { name: 'Not Started', value: 2 }
    ];
  };
  
  // Colors for pie chart
  const COLORS = [theme.palette.success.main, theme.palette.primary.main, theme.palette.grey[400]];
  
  // Render the appropriate chart based on the selected type
  const renderChart = () => {
    switch (chartType) {
      case 'progress':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={generateProgressData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="progress" 
                name="Progress (%)" 
                stroke={theme.palette.primary.main} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'tasks':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={generateTaskData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" name="Completed Tasks" fill={theme.palette.success.main} />
              <Bar dataKey="total" name="Total Tasks" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'milestones':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={generateMilestoneData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {generateMilestoneData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Milestones`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };
  
  // Generate analytics summary
  const generateAnalyticsSummary = () => {
    if (!data) return null;
    
    const overview = data.overview || {};
    const { profileCompletion, roadmapProgress, tasksCompleted, totalTasks } = overview;
    
    let summaryText = '';
    let summaryColor = 'text.primary';
    
    if (roadmapProgress < 25) {
      summaryText = "You're just getting started! Complete more tasks to make progress on your immigration journey.";
      summaryColor = 'text.secondary';
    } else if (roadmapProgress < 50) {
      summaryText = "You're making good progress! Keep going to reach your immigration goals.";
      summaryColor = 'primary.main';
    } else if (roadmapProgress < 75) {
      summaryText = "You're well on your way! Continue completing tasks to stay on track.";
      summaryColor = 'primary.dark';
    } else {
      summaryText = "You're almost there! Just a few more steps to complete your immigration journey.";
      summaryColor = 'success.main';
    }
    
    return (
      <Typography variant="body2" color={summaryColor} sx={{ mt: 2, fontStyle: 'italic' }}>
        {summaryText}
      </Typography>
    );
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          <InsightsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Progress Analytics
        </Typography>
        
        <ToggleButtonGroup
          size="small"
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label="time range"
        >
          <ToggleButton value="week" aria-label="week view">
            <CalendarViewWeekIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="month" aria-label="month view">
            <CalendarViewMonthIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      {/* Chart type selector */}
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          size="small"
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          aria-label="chart type"
          fullWidth
        >
          <ToggleButton value="progress" aria-label="progress chart">
            <TrendingUpIcon fontSize="small" sx={{ mr: 1 }} />
            Progress
          </ToggleButton>
          <ToggleButton value="tasks" aria-label="tasks chart">
            <CalendarViewWeekIcon fontSize="small" sx={{ mr: 1 }} />
            Tasks
          </ToggleButton>
          <ToggleButton value="milestones" aria-label="milestones chart">
            <InsightsIcon fontSize="small" sx={{ mr: 1 }} />
            Milestones
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* Chart */}
      {renderChart()}
      
      {/* Analytics summary */}
      {generateAnalyticsSummary()}
      
      {/* Key metrics */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main">
            {data?.overview?.profileCompletion || 0}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Profile
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main">
            {data?.overview?.roadmapProgress || 0}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Roadmap
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main">
            {data?.overview?.tasksCompleted || 0}/{data?.overview?.totalTasks || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tasks
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

ProgressAnalyticsWidget.propTypes = {
  data: PropTypes.object
};

export default ProgressAnalyticsWidget;
