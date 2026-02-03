import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { useProjects } from '../hooks/useProjects';
import ProjectCard from './ProjectCard';
import { useToast } from '../../../context/ToastProvider';

import CreateProjectModal from './CreateProjectModal';

const Projects = () => {
  const { data: projects, isLoading, isError, error } = useProjects();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (isError) {
      showToast(error.message || 'Failed to load projects', 'error');
    }
  }, [isError, error, showToast]);

  const handleProjectClick = (project) => {
    console.log('Project clicked:', project.id);
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  const projectList = Array.isArray(projects) ? projects : [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant='h4' fontWeight="bold">Projects</Typography>
          <Typography variant='body1' color='text.secondary'>Your workspace</Typography>
        </Box>
        <Button variant='contained'
        startIcon={<AddIcon />}
        size='large'
        sx={{ borderRadius: 2, textTransform: 'none', px: 3 }} 
        onClick={() => setIsModalOpen(true)}
        >
          Create New Project
        </Button>
      </Box>

      {projectList.length > 0 ? (
        <Grid container spacing={3} >
          {projectList.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
              <ProjectCard project={project} onClick={handleProjectClick} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">No projects found. Create a new project to get started!</Alert>
      )}

      <CreateProjectModal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};

export default Projects;