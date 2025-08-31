 
// src/store/index.js - Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import converterReducer from './converterSlice';

export const store = configureStore({
  reducer: {
    converter: converterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});