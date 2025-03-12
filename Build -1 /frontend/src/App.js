import React from 'react';
import { Container, Box, Typography } from '@material-ui/core';
import FileUpload from './components/FileUpload';
import ResumeList from './components/ResumeList';

function App() {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Resume Converter
        </Typography>
        
        <Box mb={4}>
          <FileUpload />
        </Box>

        <Typography variant="h5" gutterBottom>
          Your Resumes
        </Typography>
        <ResumeList />
      </Box>
    </Container>
  );
}

export default App; 