import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  makeStyles
} from '@material-ui/core';
import {
  Email,
  Phone,
  LinkedIn,
  Work,
  School,
  Code
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  section: {
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  skillChip: {
    margin: theme.spacing(0.5),
  },
  companyTitle: {
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
  },
  description: {
    whiteSpace: 'pre-line',
    marginTop: theme.spacing(1),
  },
}));

const ResumePreview = ({ parsedContent }) => {
  const classes = useStyles();

  if (!parsedContent) {
    return null;
  }

  const { contact, experience, education, skills } = parsedContent;

  return (
    <Paper elevation={2}>
      <Box p={3}>
        {/* Contact Information */}
        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionTitle}>
            <Email /> Contact Information
          </Typography>
          {contact && (
            <>
              {contact.email && (
                <div className={classes.contactItem}>
                  <Email fontSize="small" />
                  <Typography>{contact.email}</Typography>
                </div>
              )}
              {contact.phone && (
                <div className={classes.contactItem}>
                  <Phone fontSize="small" />
                  <Typography>{contact.phone}</Typography>
                </div>
              )}
              {contact.linkedin && (
                <div className={classes.contactItem}>
                  <LinkedIn fontSize="small" />
                  <Typography>{contact.linkedin}</Typography>
                </div>
              )}
            </>
          )}
        </div>

        <Divider />

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className={classes.section}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <Work /> Experience
            </Typography>
            <List>
              {experience.map((exp, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemText
                    primary={exp.title}
                    secondary={
                      <>
                        <Typography component="span" className={classes.companyTitle}>
                          {exp.company}
                        </Typography>
                        <Typography className={classes.description}>
                          {exp.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </div>
        )}

        <Divider />

        {/* Education */}
        {education && education.length > 0 && (
          <div className={classes.section}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <School /> Education
            </Typography>
            <List>
              {education.map((edu, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={edu.degree}
                    secondary={
                      <>
                        <Typography component="span" className={classes.companyTitle}>
                          {edu.institution}
                        </Typography>
                        <Typography className={classes.description}>
                          {edu.details}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </div>
        )}

        <Divider />

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className={classes.section}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <Code /> Skills
            </Typography>
            <Box display="flex" flexWrap="wrap">
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  className={classes.skillChip}
                  variant="outlined"
                />
              ))}
            </Box>
          </div>
        )}
      </Box>
    </Paper>
  );
};

export default ResumePreview; 