import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Stack, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useProject } from '../hooks/useProjects';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = useProject(id);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !project) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{ mb: 2 }}
        >
          Back to Projects
        </Button>
        <Typography color="error">Project not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/projects')}
        sx={{ mb: 3 }}
      >
        Back to Projects
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold">
          {project?.title} <Typography component="span" variant="h5" color="text.secondary">#{project?.key}</Typography>
        </Typography>
        {project?.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {project.description}
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 4, p: 3, border: '1px dashed grey', borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography color="text.secondary" align="center" sx={{ py: 10 }}>
          Таски для проєкту "{project?.title}" будуть тут
        </Typography>
      </Box>
    </Container>
  );
};

export default ProjectPage;