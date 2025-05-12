import React from 'react';
import { Box, Typography, Paper, Button, Chip, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'; // Example icon

// TODO: Fetch actual subscription data dynamically
const SubscriptionStatusWidget = ({ subscription = {} }) => {
  const {
    tier = 'free', // Default to free if no data
    expiryDate = null,
    // Add other relevant fields like autoRenew status if needed
  } = subscription;

  const tierDisplayNames = {
    free: 'Free',
    pathfinder: 'Pathfinder',
    navigator: 'Navigator',
    concierge: 'Concierge',
    enterprise: 'Enterprise'
  };

  const nextTier = {
      free: 'Pathfinder',
      pathfinder: 'Navigator',
      navigator: 'Concierge',
      concierge: null, // No direct upgrade shown from Concierge in widget
      enterprise: null
  };

  const tierDisplayName = tierDisplayNames[tier] || 'Unknown';
  const nextTierName = nextTier[tier];
  const isFreeTier = tier === 'free';
  const isHighestTier = tier === 'concierge' || tier === 'enterprise'; // Assuming Concierge is highest user-upgradable

  // Format expiry date if it exists
  const formattedExpiry = expiryDate
    ? new Date(expiryDate).toLocaleDateString()
    : 'N/A';

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <Box>
         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <WorkspacePremiumIcon color="primary" sx={{ mr: 1 }}/>
            <Typography variant="h6" component="h3">
                Subscription Status
            </Typography>
         </Box>
         <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
            <Typography variant="body1">Current Plan:</Typography>
            <Chip label={tierDisplayName} color="primary" size="small" />
         </Box>
         {!isFreeTier && expiryDate && (
             <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Renews/Expires on: {formattedExpiry}
             </Typography>
         )}
      </Box>

      <Box>
        {!isHighestTier ? (
          <>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {isFreeTier
                ? `Upgrade to ${nextTierName} to unlock personalized roadmaps and more!`
                : `Upgrade to ${nextTierName} for premium features like ${tier === 'pathfinder' ? 'document management' : 'predictive analytics'}!`}
            </Typography>
            <Button component={RouterLink} to="/pricing" size="small" variant="contained">
              {isFreeTier ? 'Upgrade Plan' : `Upgrade to ${nextTierName}`}
            </Button>
          </>
        ) : (
           <Typography variant="body2" color="text.secondary">
              You have access to all premium features.
           </Typography>
        )}
         <Button component={RouterLink} to="/settings/subscription" size="small" variant="text" sx={{ mt: 1, display: 'block' }}>
            Manage Subscription
         </Button>
      </Box>
    </Paper>
  );
};

export default SubscriptionStatusWidget;
