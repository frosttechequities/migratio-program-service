import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Home as HomeIcon, LibraryBooks as LibraryBooksIcon } from '@mui/icons-material';

/**
 * ResearchBreadcrumbs component
 * Provides consistent breadcrumb navigation for research pages
 * 
 * @param {Object} props Component props
 * @param {string} props.currentPage Current page name
 * @param {React.ReactNode} props.icon Icon for the current page
 * @param {Array} props.additionalCrumbs Additional breadcrumb items (optional)
 * @returns {React.ReactElement} ResearchBreadcrumbs component
 */
const ResearchBreadcrumbs = ({ currentPage, icon, additionalCrumbs = [] }) => {
  return (
    <Breadcrumbs sx={{ mb: 2 }}>
      <Link
        component={RouterLink}
        to="/"
        color="inherit"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
        Home
      </Link>
      
      <Link
        component={RouterLink}
        to="/research"
        color="inherit"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <LibraryBooksIcon fontSize="small" sx={{ mr: 0.5 }} />
        Research Hub
      </Link>
      
      {additionalCrumbs.map((crumb, index) => (
        <Link
          key={index}
          component={RouterLink}
          to={crumb.path}
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {crumb.icon && <Box sx={{ mr: 0.5, display: 'flex' }}>{crumb.icon}</Box>}
          {crumb.label}
        </Link>
      ))}
      
      <Typography
        color="text.primary"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        {icon && <Box sx={{ mr: 0.5, display: 'flex' }}>{icon}</Box>}
        {currentPage}
      </Typography>
    </Breadcrumbs>
  );
};

ResearchBreadcrumbs.propTypes = {
  currentPage: PropTypes.string.isRequired,
  icon: PropTypes.node,
  additionalCrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.node
    })
  )
};

export default ResearchBreadcrumbs;
