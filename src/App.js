import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store";
import Layout from "./components/Layout";
import ConverterLayout from "./components/ConverterLayout";
import ProtobufConverter from "./components/ProtobufConverter";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3498db",
      dark: "#2980b9",
    },
    secondary: {
      main: "#28a745",
    },
    error: {
      main: "#721c24",
      light: "#f8d7da",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#495057",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h4: {
      fontWeight: 600,
      color: "#2c3e50",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            fontFamily: '"Courier New", monospace',
            fontSize: "14px",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0px", // Changed from '10px' to '0px'
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<ConverterLayout />} />
              <Route path="/converter" element={<ConverterLayout />} />
              <Route path="/protobuf" element={<ProtobufConverter />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
