 
// src/components/StatusAlert.js - Status and error message display
import React from 'react';
import { useSelector } from 'react-redux';
import { Alert, Collapse } from '@mui/material';

const StatusAlert = () => {
  const { error, status } = useSelector((state) => state.converter);

  if (!error && !status) {
    return null;
  }

  const getSeverity = () => {
    if (error) return 'error';
    if (status === 'success') return 'success';
    if (status === 'info') return 'info';
    return 'warning';
  };

  const getMessage = () => {
    return error || status;
  };

  return (
    <Collapse in={!!(error || status)}>
      <Alert 
        severity={getSeverity()} 
        sx={{ 
          mb: 2,
          '& .MuiAlert-message': {
            fontWeight: 500,
          }
        }}
      >
        {getMessage()}
      </Alert>
    </Collapse>
  );
};

export default StatusAlert;