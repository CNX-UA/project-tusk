import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import ProjectCard from './ProjectCard';

const SubprojectsList = ({ subprojects }) => {
  if (!subprojects || subprojects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'action.hover', borderRadius: 4 }}>
        <Typography color="text.secondary">Ця папка порожня. Створіть перший підпроєкт!</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {subprojects.map((sub) => (
        <Grid item xs={12} sm={6} md={4} key={sub.id}>
          <ProjectCard project={sub} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SubprojectsList;