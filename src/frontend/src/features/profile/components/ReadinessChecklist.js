import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // For notes tooltip
import { updateReadinessChecklistItem } from '../profileSlice'; // Import the action

const ReadinessChecklist = ({ profile }) => {
  const dispatch = useDispatch();
  // Optionally select loading/error state specific to checklist updates if added to slice
  // const { isLoadingUpdate, errorUpdate } = useSelector(state => state.profile);

  if (!profile || !profile.readinessChecklist) {
    return <Typography>Loading checklist...</Typography>; // Or handle loading state
  }

  const handleChecklistToggle = (itemId, currentStatus) => {
    const newStatus = !currentStatus; // Toggle boolean status
    dispatch(updateReadinessChecklistItem({
      itemId: itemId,
      updateData: { isComplete: newStatus }
    }));
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Immigration Readiness Checklist</Typography>
      <List dense>
        {profile.readinessChecklist.map((item) => (
          <ListItem
            key={item.itemId}
            secondaryAction={
              item.notes ? (
                <Tooltip title={item.notes}>
                  <IconButton size="small" edge="end">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : null
            }
            disablePadding
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
              <Checkbox
                edge="start"
                checked={item.isComplete || false}
                onChange={() => handleChecklistToggle(item.itemId, item.isComplete)}
                // TODO: Add disabled state while updating specific item
                // disabled={isLoadingUpdate && updatingItemId === item.itemId}
                size="small"
              />
            </ListItemIcon>
            <ListItemText
              primary={item.itemText}
              sx={{ textDecoration: item.isComplete ? 'line-through' : 'none', color: item.isComplete ? 'text.disabled' : 'text.primary' }}
            />
          </ListItem>
        ))}
      </List>
      {/* Optionally display global update errors here */}
      {/* {errorUpdate && <Alert severity="error" sx={{ mt: 1 }}>{errorUpdate}</Alert>} */}
    </Paper>
  );
};

export default ReadinessChecklist;
