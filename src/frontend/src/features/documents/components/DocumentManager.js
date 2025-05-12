import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  useTheme,
  alpha,
  ListItemIcon
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  updateDocument
} from '../documentsSlice';
import DocumentUploadDialog from './DocumentUploadDialog';

/**
 * DocumentManager component
 * A component for managing user documents
 *
 * @returns {React.ReactElement} DocumentManager component
 */
const DocumentManager = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { documents, loading, error } = useSelector((state) => state.documents);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentMenuAnchorEl, setDocumentMenuAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  // Fetch documents on mount
  useEffect(() => {
    dispatch(getDocuments());
  }, [dispatch]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle filter menu open
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Handle filter menu close
  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  // Handle category filter selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleFilterMenuClose();
  };

  // Handle document menu open
  const handleDocumentMenuOpen = (event, document) => {
    setSelectedDocument(document);
    setDocumentMenuAnchorEl(event.currentTarget);
  };

  // Handle document menu close
  const handleDocumentMenuClose = () => {
    setDocumentMenuAnchorEl(null);
  };

  // Handle upload dialog open
  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  // Handle upload dialog close
  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
  };

  // Handle document upload
  const handleDocumentUpload = (documentData) => {
    dispatch(uploadDocument(documentData));
    setUploadDialogOpen(false);
  };

  // Handle delete dialog open
  const handleDeleteDialogOpen = (document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
    handleDocumentMenuClose();
  };

  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  // Handle document deletion
  const handleDeleteDocument = () => {
    if (documentToDelete) {
      dispatch(deleteDocument(documentToDelete.id));
      handleDeleteDialogClose();
    }
  };

  // Handle document view
  const handleViewDocument = (document) => {
    // Open document in new tab
    window.open(document.fileUrl, '_blank');
    handleDocumentMenuClose();
  };

  // Handle document download
  const handleDownloadDocument = (document) => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = document.fileUrl;
    link.download = document.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleDocumentMenuClose();
  };

  // Get document icon based on file type
  const getDocumentIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />;
    } else if (fileType === 'application/pdf') {
      return <PictureAsPdfIcon fontSize="large" sx={{ color: theme.palette.error.main }} />;
    } else if (fileType.includes('word')) {
      return <DescriptionIcon fontSize="large" sx={{ color: theme.palette.info.main }} />;
    } else {
      return <InsertDriveFileIcon fontSize="large" sx={{ color: theme.palette.text.secondary }} />;
    }
  };

  // Get status chip based on document status
  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Approved"
            color="success"
            size="small"
          />
        );
      case 'rejected':
        return (
          <Chip
            icon={<ErrorIcon />}
            label="Rejected"
            color="error"
            size="small"
          />
        );
      case 'pending':
        return (
          <Chip
            label="Pending"
            color="warning"
            size="small"
          />
        );
      case 'expired':
        return (
          <Chip
            label="Expired"
            color="error"
            variant="outlined"
            size="small"
          />
        );
      default:
        return (
          <Chip
            label={status}
            size="small"
          />
        );
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Filter documents based on search term, category, and tab
  const filteredDocuments = Array.isArray(documents) ? documents.filter(doc => {
    // Filter by search term
    const matchesSearch = doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by category
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;

    // Filter by tab (status)
    let matchesTab = true;
    if (activeTab === 1) { // Pending
      matchesTab = doc.status === 'pending';
    } else if (activeTab === 2) { // Approved
      matchesTab = doc.status === 'approved';
    } else if (activeTab === 3) { // Rejected
      matchesTab = doc.status === 'rejected';
    } else if (activeTab === 4) { // Expired
      matchesTab = doc.status === 'expired';
    }

    return matchesSearch && matchesCategory && matchesTab;
  }) : [];

  // Document categories
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'identity', label: 'Identity Documents' },
    { value: 'education', label: 'Education Documents' },
    { value: 'work', label: 'Work Documents' },
    { value: 'language', label: 'Language Documents' },
    { value: 'financial', label: 'Financial Documents' },
    { value: 'other', label: 'Other Documents' }
  ];

  // If loading and no documents, show loading state
  if (loading && (!Array.isArray(documents) || documents.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
        <Button
          variant="outlined"
          color="error"
          size="small"
          sx={{ mt: 2 }}
          onClick={() => dispatch(getDocuments())}
        >
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header and actions */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>
        <TextField
          placeholder="Search documents..."
          variant="outlined"
          size="small"
          fullWidth
          sx={{ maxWidth: { sm: 300 } }}
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterMenuOpen}
          >
            {selectedCategory === 'all' ? 'Filter' : categories.find(c => c.value === selectedCategory)?.label}
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleUploadDialogOpen}
          >
            Upload
          </Button>
        </Box>

        {/* Filter menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterMenuClose}
        >
          {categories.map((category) => (
            <MenuItem
              key={category.value}
              onClick={() => handleCategorySelect(category.value)}
              selected={selectedCategory === category.value}
            >
              {category.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Documents" />
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
          <Tab label="Expired" />
        </Tabs>
      </Box>

      {/* Document grid */}
      {filteredDocuments.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.background.default, 0.7),
          }}
        >
          <UploadFileIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Documents Found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm || selectedCategory !== 'all' || activeTab !== 0
              ? 'No documents match your current filters. Try adjusting your search or filters.'
              : 'You haven\'t uploaded any documents yet. Click the Upload button to add your first document.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleUploadDialogOpen}
            sx={{ mt: 2 }}
          >
            Upload Document
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredDocuments.map((document) => (
            <Grid item xs={12} sm={6} md={4} key={document.id}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ maxWidth: '80%' }}>
                    {document.originalName}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDocumentMenuOpen(e, document)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Box sx={{ mr: 2 }}>
                      {getDocumentIcon(document.fileType)}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(document.fileSize)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Uploaded: {formatDate(document.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {document.description && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {document.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                      label={document.category.charAt(0).toUpperCase() + document.category.slice(1)}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={document.documentType.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                    {getStatusChip(document.status)}
                  </Box>

                  {document.expiryDate && (
                    <Typography variant="caption" color={new Date(document.expiryDate) < new Date() ? 'error' : 'text.secondary'}>
                      Expires: {formatDate(document.expiryDate)}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDocument(document)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadDocument(document)}
                  >
                    Download
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Document menu */}
      <Menu
        anchorEl={documentMenuAnchorEl}
        open={Boolean(documentMenuAnchorEl)}
        onClose={handleDocumentMenuClose}
      >
        <MenuItem onClick={() => handleViewDocument(selectedDocument)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          View
        </MenuItem>
        <MenuItem onClick={() => handleDownloadDocument(selectedDocument)}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
        <MenuItem onClick={() => {
          // Open edit dialog (not implemented in this example)
          handleDocumentMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Details
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeleteDialogOpen(selectedDocument)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Upload dialog */}
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onClose={handleUploadDialogClose}
        onUpload={handleDocumentUpload}
        categories={categories.filter(c => c.value !== 'all')}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{documentToDelete?.originalName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteDocument} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentManager;
