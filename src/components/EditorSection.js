// src/components/EditorSection.js - Individual editor section with status chip and fullscreen
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  TextField,
  Typography,
  Chip,
  Paper,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import { setContent, setActiveFormat, setFullscreen, exitFullscreen } from '../store/converterSlice';
import { useConverter } from '../hooks/useConverter';

const EditorSection = ({ format, label, placeholder, isFullscreen = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { convert } = useConverter();
  
  const {
    xmlContent,
    jsonContent,
    yamlContent,
    activeFormat,
    isDataValid,
  } = useSelector((state) => state.converter);

  const getContent = () => {
    switch (format) {
      case 'xml': return xmlContent;
      case 'json': return jsonContent;
      case 'yaml': return yamlContent;
      default: return '';
    }
  };

  const isActive = activeFormat === format;
  const content = getContent();
  const isEmpty = !xmlContent && !jsonContent && !yamlContent;
  const canSwitchTo = isDataValid || isEmpty || isActive;

  const handleContentChange = (event) => {
    const newContent = event.target.value;
    dispatch(setContent({ format, content: newContent }));
    convert(format, newContent);
  };

  const handleChipClick = () => {
    if (canSwitchTo) {
      dispatch(setActiveFormat(format));
    }
  };

  const handleFullscreenToggle = () => {
    if (isFullscreen) {
      dispatch(exitFullscreen());
    } else {
      dispatch(setFullscreen(format));
    }
  };

  const getChipProps = () => {
    if (isActive) {
      return {
        label: 'Editable',
        color: 'success',
        icon: <EditIcon />,
        variant: 'filled',
        sx: { cursor: 'default' },
      };
    }
    
    if (canSwitchTo) {
      return {
        label: 'Enable Edit',
        color: 'primary',
        icon: <LockOpenIcon />,
        variant: 'outlined',
        clickable: true,
        onClick: handleChipClick,
        sx: {
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows[2],
          },
          transition: 'all 0.2s ease',
        },
      };
    }
    
    return {
      label: 'Disabled',
      color: 'default',
      icon: <LockIcon />,
      variant: 'outlined',
      disabled: true,
      sx: { cursor: 'not-allowed' },
    };
  };

  return (
    <Paper
      elevation={isActive ? 2 : 1}
      sx={{
        p: { xs: 1, sm: 1.5 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: isActive ? 2 : 1,
        borderColor: isActive ? 'primary.main' : 'grey.200',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography
          variant="subtitle2"
          component="label"
          fontWeight="bold"
          color="text.primary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          {label} {isActive ? 'Input:' : 'Output:'}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip size="small" {...getChipProps()} />
          <IconButton
            size="small"
            onClick={handleFullscreenToggle}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Box>
      </Box>

      <TextField
        multiline
        value={content}
        onChange={handleContentChange}
        placeholder={placeholder}
        disabled={!isActive}
        fullWidth
        variant="outlined"
        sx={{
          flex: 1,
          '& .MuiInputBase-root': {
            height: '100%',
            alignItems: 'flex-start',
            fontFamily: '"Courier New", monospace',
            fontSize: { xs: '12px', sm: '14px' },
            lineHeight: 1.4,
          },
          '& .MuiInputBase-input': {
            height: '100% !important',
            overflow: 'auto !important',
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />

      <Box
        display="flex"
        justifyContent="flex-end"
        mt={0.5}
        sx={{ 
          color: 'text.secondary', 
          fontSize: { xs: '0.6rem', sm: '0.75rem' },
        }}
      >
        {content.length} characters
      </Box>
    </Paper>
  );
};

export default EditorSection;