import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';

// Placeholder component for displaying comparison data

const ComparisonTable = ({ data }) => {
  // Assuming data is an array of objects, where each object represents a program/country
  // And each object has properties to compare (e.g., name, cost, processingTime, eligibilityHighlights)

  if (!data || data.length === 0) {
    return <Typography>No comparison data available.</Typography>;
  }

  // Determine headers dynamically based on the keys of the first item?
  // Or define fixed headers for V1 based on expected comparison points.
  // Headers: First column is "Feature", subsequent columns are program names.
  const headers = ['Feature', ...data.map(item => item.name || `Program ${item.id}`)];
  
  // Define the rows (features to compare) based on the keys from backend response
  const features = [
    { key: 'country', label: 'Country' },
    { key: 'category', label: 'Category' },
    { key: 'descriptionSummary', label: 'Description Summary' },
    { key: 'processingTime', label: 'Processing Time' },
    { key: 'estimatedApplicationCost', label: 'Est. Application Cost' },
    { key: 'baseSuccessRate', label: 'Base Success Rate' },
    { key: 'pathwayToResidency', label: 'Pathway to Residency' },
    { key: 'pathwayToCitizenship', label: 'Pathway to Citizenship' },
    { key: 'eligibilityHighlights', label: 'Key Eligibility Highlights' },
    { key: 'officialWebsite', label: 'Official Website' },
  ];

  // Helper to render eligibility highlights object
  const renderEligibilityHighlights = (highlights) => {
    if (!highlights || typeof highlights !== 'object' || Object.keys(highlights).length === 0) {
      return 'N/A';
    }
    return (
      <Box component="ul" sx={{ margin: 0, paddingLeft: '20px' }}>
        {Object.entries(highlights).map(([key, value]) => (
          <li key={key}>
            <Typography variant="caption"><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}</Typography>
          </li>
        ))}
      </Box>
    );
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }} aria-label="comparison table">
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index} sx={{ fontWeight: 'bold', minWidth: index === 0 ? '150px' : '200px', verticalAlign: 'top' }}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', verticalAlign: 'top' }}>
                {feature.label}
              </TableCell>
              {data.map((item) => (
                <TableCell key={item.id} sx={{ verticalAlign: 'top' }}>
                  {feature.key === 'eligibilityHighlights'
                    ? renderEligibilityHighlights(item[feature.key])
                    : feature.key === 'officialWebsite' && item[feature.key] && item[feature.key] !== 'N/A'
                    ? <a href={item[feature.key]} target="_blank" rel="noopener noreferrer">{item[feature.key]}</a>
                    : typeof item[feature.key] === 'boolean'
                    ? item[feature.key] ? 'Yes' : 'No'
                    : item[feature.key] !== undefined && item[feature.key] !== null ? String(item[feature.key]) : 'N/A'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ComparisonTable;
