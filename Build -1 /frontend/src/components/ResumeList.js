import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Box
} from '@material-ui/core';
import {
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@material-ui/icons';
import axios from 'axios';
import ResumePreview from './ResumePreview';

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumes();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchResumes, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/resumes/');
      setResumes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 50 }} />
            <TableCell>ID</TableCell>
            <TableCell>Original File</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resumes.map((resume) => (
            <ResumeRow key={resume.id} resume={resume} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ResumeRow = ({ resume }) => {
  const [open, setOpen] = useState(false);
  const parsedContent = resume.parsed_content ? JSON.parse(resume.parsed_content) : null;

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{resume.id}</TableCell>
        <TableCell>{resume.original_file.split('/').pop()}</TableCell>
        <TableCell>
          <Chip
            label={resume.status}
            color={getStatusColor(resume.status)}
            size="small"
          />
        </TableCell>
        <TableCell>
          {new Date(resume.created_at).toLocaleString()}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {resume.error_message ? (
                <Typography color="error">
                  Error: {resume.error_message}
                </Typography>
              ) : (
                <ResumePreview parsedContent={parsedContent} />
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ResumeList; 