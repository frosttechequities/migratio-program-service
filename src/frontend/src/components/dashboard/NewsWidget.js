import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Skeleton,
  Link,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Article as ArticleIcon,
  OpenInNew as OpenInNewIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import axios from 'axios';

/**
 * News widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Array} props.data - News data
 * @returns {React.ReactNode} News widget component
 */
const NewsWidget = ({ data: propData }) => {
  const [news, setNews] = useState(propData || []);
  const [loading, setLoading] = useState(!propData);
  const [error, setError] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('all');

  const isFilterMenuOpen = Boolean(filterAnchorEl);

  // Countries for filtering
  const countries = [
    { code: 'all', name: 'All Countries' },
    { code: 'ca', name: 'Canada' },
    { code: 'us', name: 'United States' },
    { code: 'au', name: 'Australia' },
    { code: 'uk', name: 'United Kingdom' },
    { code: 'nz', name: 'New Zealand' }
  ];

  // Fetch news if not provided as props
  useEffect(() => {
    if (propData) {
      setNews(propData);
      setLoading(false);
      return;
    }

    const fetchNews = async () => {
      try {
        setLoading(true);

        // In a real app, this would be an API call to fetch news
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockNews = [
          {
            id: '1',
            title: 'Canada Announces New Express Entry Draw',
            summary: 'The latest Express Entry draw invited 4,500 candidates with CRS scores above 470.',
            source: 'Immigration News',
            date: '2023-06-15',
            url: 'https://example.com/news/1',
            country: 'ca'
          },
          {
            id: '2',
            title: 'Australia Revises Skilled Occupation List',
            summary: 'The Australian government has updated its skilled occupation list, adding 22 new occupations.',
            source: 'Migration Daily',
            date: '2023-06-10',
            url: 'https://example.com/news/2',
            country: 'au'
          },
          {
            id: '3',
            title: 'US Immigration Policy Changes',
            summary: 'New policies aim to streamline the immigration process for skilled workers.',
            source: 'Immigration Times',
            date: '2023-06-05',
            url: 'https://example.com/news/3',
            country: 'us'
          },
          {
            id: '4',
            title: 'UK Announces New Points-Based System',
            summary: 'The UK has introduced a new points-based immigration system following Brexit.',
            source: 'Global Migration',
            date: '2023-06-01',
            url: 'https://example.com/news/4',
            country: 'uk'
          },
          {
            id: '5',
            title: 'New Zealand Reopens Skilled Worker Category',
            summary: 'After a temporary pause, New Zealand is accepting new applications for skilled workers.',
            source: 'NZ Herald',
            date: '2023-05-28',
            url: 'https://example.com/news/5',
            country: 'nz'
          }
        ];

        setNews(mockNews);
        setLoading(false);
      } catch (err) {
        setError('Failed to load immigration news');
        setLoading(false);
      }
    };

    fetchNews();
  }, [propData]);

  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    handleFilterClose();
  };

  // Filter news by selected country
  const filteredNews = selectedCountry === 'all'
    ? news
    : news.filter(item => item.country === selectedCountry);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get country name from code
  const getCountryName = (code) => {
    const country = countries.find(c => c.code === code);
    return country ? country.name : code.toUpperCase();
  };

  // Get country flag emoji
  const getCountryFlag = (code) => {
    const flagEmojis = {
      ca: '🇨🇦',
      us: '🇺🇸',
      au: '🇦🇺',
      uk: '🇬🇧',
      nz: '🇳🇿'
    };

    return flagEmojis[code] || '';
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          <ArticleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Immigration News
        </Typography>
        <Box>
          <Tooltip title="Filter by country">
            <IconButton
              size="small"
              onClick={handleFilterClick}
              aria-controls={isFilterMenuOpen ? 'country-filter-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isFilterMenuOpen ? 'true' : undefined}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          <Menu
            id="country-filter-menu"
            anchorEl={filterAnchorEl}
            open={isFilterMenuOpen}
            onClose={handleFilterClose}
            MenuListProps={{
              'aria-labelledby': 'country-filter-button',
            }}
          >
            {countries.map((country) => (
              <MenuItem
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                selected={selectedCountry === country.code}
              >
                {country.code !== 'all' && (
                  <span style={{ marginRight: 8 }}>{getCountryFlag(country.code)}</span>
                )}
                {country.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* News list */}
      {loading ? (
        // Loading skeleton
        <Box>
          {[1, 2, 3].map((item) => (
            <Box key={item} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="80%" height={24} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="60%" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Box>
      ) : error ? (
        // Error message
        <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>
          {error}
        </Typography>
      ) : filteredNews.length === 0 ? (
        // No news message
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', my: 4 }}>
          No immigration news available
          {selectedCountry !== 'all' && ` for ${getCountryName(selectedCountry)}`}
        </Typography>
      ) : (
        // News items
        <List disablePadding>
          {filteredNews.map((item) => (
            <ListItem
              key={item.id}
              disablePadding
              sx={{
                display: 'block',
                mb: 2,
                '&:not(:last-child)': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  pb: 2
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="subtitle2" component="div">
                  {item.title}
                </Typography>
                <Chip
                  size="small"
                  label={getCountryFlag(item.country)}
                  title={getCountryName(item.country)}
                  sx={{ height: 24, minWidth: 24 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1 }}>
                {item.summary}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {item.source} • {formatDate(item.date)}
                </Typography>
                <IconButton
                  size="small"
                  component="a"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {/* View all news button */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          component="a"
          href="https://www.canada.ca/en/immigration-refugees-citizenship/news.html"
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          size="small"
          endIcon={<OpenInNewIcon />}
          fullWidth
        >
          View More Immigration News
        </Button>
      </Box>
    </Paper>
  );
};

NewsWidget.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired
    })
  )
};

export default NewsWidget;
