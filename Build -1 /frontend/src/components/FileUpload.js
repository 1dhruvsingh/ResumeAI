import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  LinearProgress,
  Button 
} from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    setError(null);
    const allowedTypes = ['.pdf', '.docx', '.txt', '.rtf'];
    const isValidType = allowedTypes.some(type => 
      file.name.toLowerCase().endsWith(type)
    );

    if (!isValidType) {
      setError('Invalid file type. Please upload PDF, DOCX, TXT, or RTF files.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/resumes/', formData);
      // Handle successful upload
      console.log('Upload successful:', response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3}>
      <Box
        p={3}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ textAlign: 'center' }}
      >
        <input
          type="file"
          id="file-input"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept=".pdf,.docx,.txt,.rtf"
        />
        
        <Typography variant="h6" gutterBottom>
          Upload Your Resume
        </Typography>

        <Box 
          border={2} 
          borderColor="grey.300" 
          borderStyle="dashed" 
          borderRadius={4}
          p={3}
          mb={2}
        >
          <CloudUpload style={{ fontSize: 48, color: 'grey.500' }} />
          <Typography variant="body1">
            Drag and drop your resume here or
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component="label"
            style={{ marginTop: 16 }}
          >
            Browse Files
            <input
              type="file"
              hidden
              onChange={handleFileSelect}
              accept=".pdf,.docx,.txt,.rtf"
            />
          </Button>
        </Box>

        {file && (
          <Typography variant="body2">
            Selected file: {file.name}
          </Typography>
        )}

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        {uploading && <LinearProgress />}

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{ marginTop: 16 }}
        >
          Upload Resume
        </Button>
      </Box>
    </Paper>
  );
};

export default FileUpload; 