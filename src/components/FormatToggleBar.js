// src/components/FormatToggleBar.js - Format visibility toggle controls
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  FormControlLabel,
  Checkbox,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { toggleFormatVisibility } from '../store/converterSlice';

const FormatToggleBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { visibleFormats } = useSelector((state) => state.converter);

  const formats = [
    { key: 'xml', label: 'XML' },
    { key: 'json', label: 'JSON' },
    { key: 'yaml', label: 'YAML' },
  ];

  const handleToggle = (format) => {
    dispatch(toggleFormatVisibility(format));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        bgcolor: 'grey.50',
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 2,
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        gap={{ xs: 1, sm: 3 }}
        flexWrap="wrap"
      >
        {formats.map(({ key, label }) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={visibleFormats[key]}
                onChange={() => handleToggle(key)}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
              />
            }
            label={label}
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              '& .MuiFormControlLabel-label': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default FormatToggleBar;