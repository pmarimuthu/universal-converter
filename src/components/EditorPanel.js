// src/components/EditorPanel.js - Main editor panel with dynamic layout and fullscreen
import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Box } from '@mui/material';
import EditorSection from './EditorSection';

const EditorPanel = () => {
  const { visibleFormats, fullscreenFormat } = useSelector((state) => state.converter);

  const formats = [
    { key: 'xml', label: 'XML', placeholder: 'Paste your XML here or convert from JSON/YAML...' },
    { key: 'json', label: 'JSON', placeholder: 'Paste your JSON here or convert from XML/YAML...' },
    { key: 'yaml', label: 'YAML', placeholder: 'Paste your YAML here or convert from XML/JSON...' },
  ];

  const visibleFormatsArray = formats.filter(format => visibleFormats[format.key]);
  const visibleCount = visibleFormatsArray.length;

  const getGridSize = () => {
    if (visibleCount === 1) return 12;
    if (visibleCount === 2) return 6;
    return 4;
  };

  if (fullscreenFormat) {
    const fullscreenFormatData = formats.find(f => f.key === fullscreenFormat);
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <EditorSection
          format={fullscreenFormatData.key}
          label={fullscreenFormatData.label}
          placeholder={fullscreenFormatData.placeholder}
          isFullscreen={true}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Grid container spacing={1} sx={{ height: '100%' }}>
        {visibleFormatsArray.map((format) => (
          <Grid
            key={format.key}
            item
            xs={12}
            sm={visibleCount === 1 ? 12 : 6}
            md={getGridSize()}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '12px !important',
            }}
          >
            <EditorSection
              format={format.key}
              label={format.label}
              placeholder={format.placeholder}
              isFullscreen={false}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EditorPanel;