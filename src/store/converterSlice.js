// src/store/converterSlice.js - Converter state management
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  xmlContent: '',
  jsonContent: '',
  yamlContent: '',
  activeFormat: 'xml',
  visibleFormats: { xml: true, json: true, yaml: true },
  isDataValid: false,
  error: null,
  status: null,
  fullscreenFormat: null,
};

const converterSlice = createSlice({
  name: 'converter',
  initialState,
  reducers: {
    setContent: (state, action) => {
      const { format, content } = action.payload;
      switch (format) {
        case 'xml':
          state.xmlContent = content;
          break;
        case 'json':
          state.jsonContent = content;
          break;
        case 'yaml':
          state.yamlContent = content;
          break;
      }
    },
    setActiveFormat: (state, action) => {
      state.activeFormat = action.payload;
    },
    toggleFormatVisibility: (state, action) => {
      const format = action.payload;
      state.visibleFormats[format] = !state.visibleFormats[format];
      if (state.activeFormat === format && !state.visibleFormats[format]) {
        const visibleFormats = Object.entries(state.visibleFormats)
          .filter(([_, visible]) => visible)
          .map(([format]) => format);
        if (visibleFormats.length > 0) {
          state.activeFormat = visibleFormats[0];
        }
      }
    },
    setDataValid: (state, action) => {
      state.isDataValid = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = action.payload ? 'error' : null;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    clearAll: (state) => {
      state.xmlContent = '';
      state.jsonContent = '';
      state.yamlContent = '';
      state.error = null;
      state.status = null;
      state.isDataValid = false;
    },
    setFullscreen: (state, action) => {
      state.fullscreenFormat = action.payload;
    },
    exitFullscreen: (state) => {
      state.fullscreenFormat = null;
    },
  },
});

export const {
  setContent,
  setActiveFormat,
  toggleFormatVisibility,
  setDataValid,
  setError,
  setStatus,
  clearAll,
  setFullscreen,
  exitFullscreen,
} = converterSlice.actions;

export default converterSlice.reducer;