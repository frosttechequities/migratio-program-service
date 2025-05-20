import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

/**
 * VisualExplanation component
 * Provides visual explanations of match factors and success probability
 * 
 * @param {Object} props - Component props
 * @param {Object} props.program - Program data
 * @param {Array} props.matchFactors - Factors contributing to match score
 * @param {Array} props.successFactors - Factors contributing to success probability
 * @param {Array} props.comparisonPrograms - Programs to compare with (optional)
 * @param {string} props.chartType - Type of chart to display (radar, bar, pie)
 * @param {boolean} props.isLoading - Loading state
 * @returns {React.ReactElement} VisualExplanation component
 */
const VisualExplanation = ({
  program = {},
  matchFactors = [],
  successFactors = [],
  comparisonPrograms = [],
  chartType = 'radar',
  isLoading = false
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  // Colors for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main
  ];

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Prepare chart data when factors change
  useEffect(() => {
    // Ensure factors are arrays
    const safeMatchFactors = Array.isArray(matchFactors) ? matchFactors : [];
    const safeSuccessFactors = Array.isArray(successFactors) ? successFactors : [];

    // Prepare data for radar chart
    const radarData = safeMatchFactors.map(factor => ({
      subject: factor.name,
      A: Math.max(0, Math.min(100, factor.contribution > 0 ? factor.contribution : 0)),
      fullMark: 100
    }));

    // Prepare data for bar chart
    const barData = safeMatchFactors.map(factor => ({
      name: factor.name,
      value: factor.contribution,
      fill: factor.contribution > 0 ? theme.palette.success.main : theme.palette.error.main
    }));

    // Prepare data for pie chart
    const pieData = safeSuccessFactors.map(factor => ({
      name: factor.name,
      value: Math.abs(factor.impact),
      impact: factor.impact
    }));

    // Set chart data based on active tab
    if (activeTab === 0) {
      setChartData(radarData.length > 0 ? radarData : barData);
    } else if (activeTab === 1) {
      setChartData(barData);
    } else {
      setChartData(pieData);
    }

    // Prepare comparison data if comparison programs exist
    if (comparisonPrograms.length > 0) {
      const compData = [];
      
      // Add current program
      compData.push({
        name: program.programName,
        matchScore: program.matchScore || 0,
        successProbability: program.successProbability || 0
      });
      
      // Add comparison programs
      comparisonPrograms.forEach(prog => {
        compData.push({
          name: prog.programName,
          matchScore: prog.matchScore || 0,
          successProbability: prog.successProbability || 0
        });
      });
      
      setComparisonData(compData);
    }
  }, [matchFactors, successFactors, comparisonPrograms, activeTab, program, theme]);

  // Render radar chart
  const renderRadarChart = () => {
    if (chartData.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography variant="body2" color="text.secondary">
            No data available for visualization
          </Typography>
        </Box>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Match Factors" dataKey="A" stroke={theme.palette.primary.main} fill={theme.palette.primary.main} fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  // Render bar chart
  const renderBarChart = () => {
    if (chartData.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography variant="body2" color="text.secondary">
            No data available for visualization
          </Typography>
        </Box>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[-100, 100]} />
          <YAxis dataKey="name" type="category" width={120} />
          <Tooltip formatter={(value) => [`${value}%`, 'Contribution']} />
          <Legend />
          <Bar dataKey="value" name="Factor Impact" fill={theme.palette.primary.main}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || (entry.value > 0 ? theme.palette.success.main : theme.palette.error.main)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Render pie chart
  const renderPieChart = () => {
    if (chartData.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography variant="body2" color="text.secondary">
            No data available for visualization
          </Typography>
        </Box>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.impact > 0 ? theme.palette.success.main : theme.palette.error.main} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, 'Impact']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Render comparison chart
  const renderComparisonChart = () => {
    if (comparisonData.length <= 1) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography variant="body2" color="text.secondary">
            No comparison data available
          </Typography>
        </Box>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${value}%`, '']} />
          <Legend />
          <Bar dataKey="matchScore" name="Match Score" fill={theme.palette.primary.main} />
          <Bar dataKey="successProbability" name="Success Probability" fill={theme.palette.secondary.main} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Render chart based on type and active tab
  const renderChart = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress size={40} />
        </Box>
      );
    }

    if (activeTab === 3) {
      return renderComparisonChart();
    }

    switch (chartType) {
      case 'radar':
        return renderRadarChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderRadarChart();
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Visual Explanation
      </Typography>
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        <Tab label="Match Factors" />
        <Tab label="Impact Analysis" />
        <Tab label="Success Factors" />
        {comparisonPrograms.length > 0 && <Tab label="Comparison" />}
      </Tabs>
      
      {renderChart()}
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {activeTab === 0 && "This chart shows how well your profile matches the program requirements in different areas."}
          {activeTab === 1 && "This chart shows the positive and negative impacts of different factors on your match score."}
          {activeTab === 2 && "This chart shows the factors that contribute to your success probability."}
          {activeTab === 3 && "This chart compares your match score and success probability across different programs."}
        </Typography>
      </Box>
    </Paper>
  );
};

VisualExplanation.propTypes = {
  program: PropTypes.object,
  matchFactors: PropTypes.array,
  successFactors: PropTypes.array,
  comparisonPrograms: PropTypes.array,
  chartType: PropTypes.string,
  isLoading: PropTypes.bool
};

export default VisualExplanation;
