import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
  Container,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useProject } from "../hooks/useProjects";
import FolderIcon from "@mui/icons-material/Folder";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ActionMenu from "@/components/ui/ActionMenu";
import AddIcon from "@mui/icons-material/Add";
import ProjectCard from "./ProjectCard";
import TaskCard from "@/features/tasks/components/TaskCard";
import { useTaskMutation } from "@/features/tasks/hooks/useTaskMutation";
import { useProjectMutation } from "../hooks/useProjectMutation";
import CreateProjectModal from "./CreateProjectModal";
import CreateTaskModal from "@/features/tasks/components/CreateTaskModal";
import KanbanBoard from "@/features/tasks/components/KanbanBoard";

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskToEdit, setTaskToEdit] = useState(null);
  const { deleteMutation: deleteTaskMutation } = useTaskMutation();

  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const { data: project, isLoading, isError } = useProject(id);
  const { deleteMutation } = useProjectMutation();

  const handleProjectClick = (subProject) => {
    navigate(`/projects/${subProject.id}`);
  };

  const handleEditClick = (subProject) => {
    setProjectToEdit(subProject);
    setProjectModalOpen(true);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Delete this task?")) {
      try {
        await deleteTaskMutation.mutateAsync(taskId);
        showToast("Task deleted", "success");
      } catch (e) {
        showToast("Failed to delete task", "error");
      }
    }
  };

  const handleCloseTaskModal = () => {
    setTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeleteClick = async (subProjectId) => {
    if (window.confirm("Are you sure you want to delete this sub-project?")) {
      try {
        await deleteMutation.mutateAsync(subProjectId);
        showToast("Sub-project deleted successfully", "success");
      } catch (e) {
        showToast("Failed to delete sub-project", "error");
      }
    }
  };

  const handleCloseProjectModal = () => {
    setProjectModalOpen(false);
    setProjectToEdit(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !project) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/projects")}
          sx={{ mb: 2 }}
        >
          Back to Projects
        </Button>
        <Typography color="error">Project not found</Typography>
      </Container>
    );
  }

  const hasSubprojects = project.subprojects && project.subprojects.length > 0;
  const hasTasks = project.tasks && project.tasks.length > 0;

  const addActions = [
    {
      label: "New Sub-project",
      icon: <FolderIcon fontSize="small" />,
      onClick: () => {
        setProjectToEdit(null);
        setProjectModalOpen(true);
      },
      disabled: hasTasks,
      color: hasTasks ? "text.disabled" : "primary.main",
    },
    {
      label: "New Task",
      icon: <DashboardIcon fontSize="small" />,
      onClick: () => setTaskModalOpen(true),
      disabled: hasSubprojects,
      color: hasSubprojects ? "text.disabled" : "primary.main",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/projects")}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold">
            {project?.title}
            <Typography component="span" variant="h5" color="text.secondary">
              #{project?.key}
            </Typography>
          </Typography>
          {project?.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {project.description}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: "50%",
            boxShadow: 1,
          }}
        >
          <ActionMenu actions={addActions} icon={AddIcon} />
        </Box>
      </Box>

      <Box sx={{ minHeight: "50vh" }}>
        {hasSubprojects && (
          <Grid container spacing={3}>
            {project.subprojects.map((sub) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={sub.id}>
                <ProjectCard
                  project={{ ...sub, parent_id: project.id }}
                  onClick={() => handleProjectClick(sub)}
                  onEdit={() => handleEditClick(sub)}
                  onDelete={() => handleDeleteClick(sub.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {hasTasks && (
          <KanbanBoard 
              tasks={project.tasks}
              projectId={project.id}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
           />
        )}

        {!hasSubprojects && !hasTasks && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "40vh",
              opacity: 0.6,
            }}
          >
            <FolderIcon
              sx={{ fontSize: 60, mb: 2, color: "action.disabled" }}
            />
            <Typography variant="h6" color="text.secondary">
              This project is empty
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use the + menu above to add content
            </Typography>
          </Box>
        )}
      </Box>

      <CreateProjectModal
        open={isProjectModalOpen}
        onClose={handleCloseProjectModal}
        projectData={projectToEdit}
        parentId={project?.id}
      />

      <CreateTaskModal
        open={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        projectId={project.id}
        taskData={taskToEdit}
      />
    </Container>
  );
};

export default ProjectPage;
