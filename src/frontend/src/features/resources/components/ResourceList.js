import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Link as MuiLink,
  Chip
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import ChecklistIcon from '@mui/icons-material/Checklist';
import LinkIcon from '@mui/icons-material/Link';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Default icon

const ResourceList = ({ resources = [], title = "Resources" }) => {

  if (!resources || resources.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">{title}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>No resources available.</Typography>
      </Paper>
    );
  }

  const getIcon = (contentType) => {
    switch (contentType) {
      case 'guide':
      case 'article':
        return <ArticleIcon />;
      case 'checklist':
        return <ChecklistIcon />;
      case 'link':
        return <LinkIcon />;
      default:
        return <HelpOutlineIcon />;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <List dense>
        {resources.map((resource) => (
          <ListItem
            key={resource._id}
            button // Make item clickable
            component={resource.contentType === 'link' ? 'a' : undefined} // Use 'a' tag for links
            href={resource.contentType === 'link' ? resource.content : undefined} // Set href for links
            target={resource.contentType === 'link' ? '_blank' : undefined} // Open links in new tab
            rel={resource.contentType === 'link' ? 'noopener noreferrer' : undefined}
            // TODO: Add onClick handler for non-link types to navigate to a detail view or open a modal
            // onClick={() => resource.contentType !== 'link' ? handleViewResource(resource._id) : null}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
              {getIcon(resource.contentType)}
            </ListItemIcon>
            <ListItemText
              primary={resource.title}
              secondary={resource.summary || (resource.contentType === 'link' ? resource.content : null)}
            />
            {/* Optionally display tags */}
            {/* {resource.tags && resource.tags.length > 0 && (
              <Box sx={{ ml: 1 }}>
                {resource.tags.slice(0, 2).map(tag => <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />)}
              </Box>
            )} */}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ResourceList;
