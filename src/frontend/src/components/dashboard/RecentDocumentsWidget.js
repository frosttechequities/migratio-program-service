import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Button,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const RecentDocumentsWidget = () => {
  const { documents } = useSelector((state) => state.documents);
  const navigate = useNavigate();

  // Sort documents by upload date (newest first)
  const sortedDocuments = [...documents].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Recent Documents
      </Typography>

      {sortedDocuments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            You haven't uploaded any documents yet.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/documents')}
            startIcon={<DescriptionIcon />}
          >
            Upload Documents
          </Button>
        </Box>
      ) : (
        <>
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {sortedDocuments.slice(0, 5).map((document, index) => (
              <React.Fragment key={document._id}>
                <ListItem button onClick={() => window.open(document.fileUrl, '_blank')}>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={document.name}
                    secondary={
                      <>
                        <Typography component="span" variant="caption" color="text.secondary">
                          {document.category || 'Uncategorized'}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          Uploaded: {new Date(document.createdAt).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < sortedDocuments.length - 1 && index < 4 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>

          {sortedDocuments.length > 5 && (
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/documents')}
              >
                View All Documents
              </Button>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default RecentDocumentsWidget;
