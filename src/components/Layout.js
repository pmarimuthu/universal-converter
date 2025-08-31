import React from 'react';
import { Box } from '@mui/material';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <Box 
      component="main" 
      role="main"
      sx={{ height: '100vh', display: 'flex' }}
    >
      <Navigation />
      <Box 
        component="section"
        sx={{ flex: 1, overflow: 'hidden' }}
        aria-label="Main content area"
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;