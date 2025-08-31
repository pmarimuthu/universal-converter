import React, { useState, useCallback } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Grid,
  Chip,
  Alert,
  Button,
  IconButton,
} from "@mui/material";
import {
  Storage as ProtobufIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from "@mui/icons-material";
import {
  generateProtoSchema,
  calculateSizeComparison,
} from "../utils/protobufUtils";

const ProtobufConverter = () => {
  const [messageName, setMessageName] = useState("User");
  const [jsonInput, setJsonInput] = useState(
    '{\n  "name": "John",\n  "age": 30,\n  "isActive": true\n}'
  );
  const [protoSchema, setProtoSchema] = useState("");
  const [binaryOutput, setBinaryOutput] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [fullscreenSection, setFullscreenSection] = useState(null);

  const generateProtobuf = useCallback(() => {
    try {
      setError("");

      if (!messageName.trim()) {
        throw new Error("Message name is required");
      }

      if (!jsonInput.trim()) {
        throw new Error("JSON input is required");
      }

      const jsonData = JSON.parse(jsonInput);

      const schema = generateProtoSchema(messageName, jsonData);
      setProtoSchema(schema);

      const binaryData = new TextEncoder().encode(JSON.stringify(jsonData));
      const hexOutput = Array.from(binaryData)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(" ");
      setBinaryOutput(hexOutput);

      const sizeStats = calculateSizeComparison(jsonData, binaryData);
      setStats(sizeStats);
    } catch (err) {
      setError(err.message);
      setProtoSchema("");
      setBinaryOutput("");
      setStats(null);
    }
  }, [messageName, jsonInput]);

  const downloadProto = () => {
    const blob = new Blob([protoSchema], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${messageName.toLowerCase()}.proto`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = (section) => {
    setFullscreenSection(fullscreenSection === section ? null : section);
  };

  React.useEffect(() => {
    if (jsonInput && messageName) {
      generateProtobuf();
    }
  }, [jsonInput, messageName, generateProtobuf]);

  // Fullscreen Input Section
  const renderInputSection = (isFullscreen = false) => (
    <Paper
      elevation={isFullscreen ? 2 : 1}
      sx={{
        p: 2,
        height: isFullscreen ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        border: isFullscreen ? 2 : 1,
        borderColor: isFullscreen ? "primary.main" : "grey.200",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6">Input</Typography>
        <IconButton
          size="small"
          onClick={() => toggleFullscreen("input")}
          sx={{ "&:hover": { bgcolor: "action.hover" } }}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Box>

      <TextField
        label="Message Name"
        value={messageName}
        onChange={(e) => setMessageName(e.target.value)}
        fullWidth
        margin="normal"
        size="small"
      />

      <TextField
        label="Sample Data (JSON)"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        multiline
        minRows={isFullscreen ? 25 : 15}
        maxRows={isFullscreen ? 50 : 25}
        fullWidth
        sx={{
          mt: 1,
          flex: isFullscreen ? 1 : "none",
        }}
      />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        {jsonInput.length} characters
      </Typography>
    </Paper>
  );

  // Fullscreen Proto Schema Section
  const renderProtoSection = (isFullscreen = false) => (
    <Paper
      elevation={isFullscreen ? 2 : 1}
      sx={{
        p: 2,
        height: isFullscreen ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        border: isFullscreen ? 2 : 1,
        borderColor: isFullscreen ? "primary.main" : "grey.200",
      }}
    >
      <Box
        display="flex"
        justifyContent="between"
        alignItems="center"
        mb={1}
        gap={1}
      >
        <Typography variant="h6" sx={{ flex: 1 }}>
          Generated .proto Schema
        </Typography>
        <Box display="flex" gap={1}>
          {protoSchema && (
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={downloadProto}
            >
              Download
            </Button>
          )}
          <IconButton
            size="small"
            onClick={() => toggleFullscreen("proto")}
            sx={{ "&:hover": { bgcolor: "action.hover" } }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Box>
      </Box>

      <TextField
        value={protoSchema}
        multiline
        minRows={isFullscreen ? 25 : 8}
        maxRows={isFullscreen ? 50 : 15}
        fullWidth
        InputProps={{ readOnly: true }}
        sx={{
          flex: isFullscreen ? 1 : "none",
        }}
      />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        {protoSchema.length} characters
      </Typography>
    </Paper>
  );

  // Fullscreen Binary Section
  const renderBinarySection = (isFullscreen = false) => (
    <Paper
      elevation={isFullscreen ? 2 : 1}
      sx={{
        p: 2,
        height: isFullscreen ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        border: isFullscreen ? 2 : 1,
        borderColor: isFullscreen ? "primary.main" : "grey.200",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6">Binary Output & Stats</Typography>
        <IconButton
          size="small"
          onClick={() => toggleFullscreen("binary")}
          sx={{ "&:hover": { bgcolor: "action.hover" } }}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Box>

      {stats && (
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip
            label={`JSON: ${stats.jsonSize} bytes`}
            color="secondary"
            size="small"
          />
          <Chip
            label={`Binary: ${stats.binarySize} bytes`}
            color="primary"
            size="small"
          />
          <Chip
            label={`Savings: ${stats.savings}%`}
            color="success"
            size="small"
          />
        </Box>
      )}

      <TextField
        label="Binary (Hex)"
        value={binaryOutput}
        multiline
        minRows={isFullscreen ? 20 : 6}
        maxRows={isFullscreen ? 40 : 12}
        fullWidth
        InputProps={{
          readOnly: true,
          sx: {
            fontFamily: '"Courier New", monospace',
            fontSize: "12px",
          },
        }}
        sx={{
          flex: isFullscreen ? 1 : "none",
        }}
      />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        {binaryOutput.length} characters
      </Typography>
    </Paper>
  );

  // Handle fullscreen rendering
  if (fullscreenSection === "input") {
    return (
      <Box
        sx={{
          height: "100%",
          overflow: "auto",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        {renderInputSection(true)}
      </Box>
    );
  }

  if (fullscreenSection === "proto") {
    return (
      <Box
        sx={{
          height: "100%",
          overflow: "auto",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        {renderProtoSection(true)}
      </Box>
    );
  }

  if (fullscreenSection === "binary") {
    return (
      <Box
        sx={{
          height: "100%",
          overflow: "auto",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        {renderBinarySection(true)}
      </Box>
    );
  }

  // Normal view
  return (
    <Box
      sx={{ height: "100%", overflow: "auto", bgcolor: "background.default" }}
    >
      <Container maxWidth={false} sx={{ py: 2, px: 2 }}>
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <ProtobufIcon color="primary" />
            Protobuf Playground
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Auto-generate Protocol Buffer schemas from your data structures
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Input Section */}
          <Grid item xs={12} md={6}>
            {renderInputSection()}
          </Grid>

          {/* Output Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderProtoSection()}
              {renderBinarySection()}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProtobufConverter;
