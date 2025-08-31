// src/components/ConverterLayout.js - Main layout component
import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  DataObject as XmlIcon,
  Code as JsonIcon,
  Description as YamlIcon,
} from '@mui/icons-material';
import FormatToggleBar from './FormatToggleBar';
import EditorPanel from './EditorPanel';
import StatusAlert from './StatusAlert';

const ConverterLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Container 
        maxWidth={false} 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 1, sm: 2 },
          px: { xs: 1, sm: 2 },
          maxWidth: '100vw',
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: { xs: 1.5, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box textAlign="center" mb={2}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                flexWrap: 'wrap',
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                mb: 1,
              }}
            >
              <XmlIcon color="primary" />
              <Typography component="span" sx={{ mx: 0.5 }}>
                ⟷
              </Typography>
              <JsonIcon color="secondary" />
              <Typography component="span" sx={{ mx: 0.5 }}>
                ⟷
              </Typography>
              <YamlIcon color="action" />
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Convert between XML, JSON, and YAML formats with real-time bi-directional editing
            </Typography>
          </Box>

          <FormatToggleBar />
          
          <StatusAlert />

          <Box sx={{ flex: 1, mt: 1, overflow: 'hidden' }}>
            <EditorPanel />
          </Box>

          <Box
            component="footer"
            textAlign="center"
            mt={1}
            py={1}
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}
          >
            Universal Data Format Converter • Open Source • Convert seamlessly
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ConverterLayout;