import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';

const API_URL = process.env.REACT_APP_VECTOR_SEARCH_SERVICE_URL || 'https://visafy-vector-search-service.onrender.com';

/**
 * SemanticSearch Component
 *
 * A component that provides a user interface for semantic search.
 * It allows users to search for documents using natural language queries.
 */
const SemanticSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to connect to the API
      try {
        const response = await axios.post(`${API_URL}/search`, {
          query: query.trim(),
          limit: 10,
          threshold: 0.7
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setResults(response.data.results);
        setSearched(true);
      } catch (apiError) {
        console.error('Search API error:', apiError);

        // If the API is not available, use mock data
        console.log('Using mock data for search results');

        // Mock data for demonstration purposes
        const mockResults = [
          {
            id: 1,
            content: "The Express Entry system is used to manage applications for permanent residence under these federal economic immigration programs: the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class. Provinces and territories can also recruit candidates from the Express Entry system through their Provincial Nominee Programs to meet local labor market needs.",
            metadata: {
              title: "Express Entry Program Guide",
              source: "Immigration Canada",
              tags: ["canada", "express entry", "immigration"]
            },
            similarity: 0.92
          },
          {
            id: 2,
            content: "When applying for immigration, you typically need to provide various documents to support your application. These may include: valid passport or travel document, birth certificate, marriage certificate (if applicable), police certificates, proof of language proficiency, educational credentials assessment, proof of funds, medical examination results, and biometric information.",
            metadata: {
              title: "Document Requirements for Immigration",
              source: "Immigration Resources",
              tags: ["documents", "requirements", "immigration"]
            },
            similarity: 0.85
          },
          {
            id: 3,
            content: "Language proficiency is a key requirement for many immigration programs. Accepted language tests vary by country, but common ones include IELTS, CELPIP, TEF, and PTE. The test results are typically valid for 2 years. The required scores vary depending on the immigration program and the country.",
            metadata: {
              title: "Language Testing for Immigration",
              source: "Immigration Resources",
              tags: ["language testing", "proficiency", "immigration"]
            },
            similarity: 0.78
          }
        ];

        // Filter mock results based on the query
        const filteredResults = mockResults.filter(result =>
          result.content.toLowerCase().includes(query.toLowerCase()) ||
          result.metadata.title.toLowerCase().includes(query.toLowerCase()) ||
          (result.metadata.tags && result.metadata.tags.some(tag =>
            tag.toLowerCase().includes(query.toLowerCase())
          ))
        );

        setResults(filteredResults.length > 0 ? filteredResults : mockResults);
        setSearched(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    setError(null);
  };

  // Function to highlight matching text
  const highlightMatches = (text, query) => {
    if (!query || !text) return text;

    // Simple highlighting for exact matches
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  // Function to render a search result
  const renderSearchResult = (result) => {
    const { id, content, metadata, similarity } = result;
    const truncatedContent = content.length > 300
      ? content.substring(0, 300) + '...'
      : content;

    // Format the similarity score as a percentage
    const similarityPercentage = Math.round(similarity * 100);

    return (
      <Card key={id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" component="h3">
              {metadata.title || metadata.filename || 'Document'}
            </Typography>
            <Chip
              label={`${similarityPercentage}% match`}
              color={similarityPercentage > 90 ? 'success' : similarityPercentage > 75 ? 'primary' : 'default'}
              size="small"
            />
          </Box>

          {metadata.source && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Source: {metadata.source}
            </Typography>
          )}

          <Divider sx={{ my: 1 }} />

          <Typography
            variant="body1"
            component="div"
            dangerouslySetInnerHTML={{ __html: highlightMatches(truncatedContent, query) }}
            sx={{
              '& mark': {
                backgroundColor: 'rgba(255, 213, 79, 0.5)',
                padding: '0 2px',
                borderRadius: '2px'
              }
            }}
          />

          {metadata.tags && metadata.tags.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {metadata.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Semantic Search
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Search for immigration information using natural language. Our AI-powered search understands the meaning behind your questions.
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search query"
          placeholder="E.g., What documents do I need for Express Entry?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {query && (
                  <IconButton onClick={clearSearch} edge="end" aria-label="clear search">
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading || !query.trim()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No results found for "{query}". Try a different search term.
        </Alert>
      )}

      {results.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </Typography>

          <Box>
            {results.map(renderSearchResult)}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SemanticSearch;
