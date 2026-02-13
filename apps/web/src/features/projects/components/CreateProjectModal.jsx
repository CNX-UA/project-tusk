import React, { useState , useEffect } from "react";
import { useFormik } from "formik";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  Grid,
  MenuItem,
} from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import FolderIcon from "@mui/icons-material/Folder";

import { projectSchema } from "../schema/projectSchema";
import { useCreateProject } from "../hooks/useCreateProject";
import { useToast } from "@/context/ToastProvider";
import { useProjectMutation } from "../hooks/useProjectMutation";
import EntityModal from "@/components/ui/EntityModal";
import { useTeams } from "@/features/teams/hooks/useTeams";

const CreateProjectModal = ({ open, onClose, projectData, parentId }) => {
  const isEdit = !!projectData;
  const { showToast } = useToast();
  const { updateMutation } = useProjectMutation();
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const { data: teams, isLoading: isLoadingTeams } = useTeams();

  const createMutation = useCreateProject(() => {
    showToast("Project created successfully", "success");
    handleClose();
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      title: "",
      key: "",
      description: "",
      parent_id: parentId,
    },
    enableReinitialize: true,
    validationSchema: projectSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        team_id: values.team_id || null,
      };

      if (isEdit) {
        updateMutation.mutate(
          { id: projectData.id, projectData: values },
          {
            onSuccess: () => {
              showToast("Project updated successfully", "success");
              handleClose();
            },
            onError: (error) => {
              showToast("Failed to update project", "error");
              console.error(error);
            },
          },
        );
      } else {
        console.log("Sending payload:", values); 
        createMutation.mutate(values);
      }
    },
  });

  useEffect(() => {
    if (isEdit && projectData) {
      formik.setValues({
        title: projectData.title || "",
        key: projectData.key || "",
        description: projectData.description || "",
        team_id: projectData.team_id || "",
      });
    }
  }, [isEdit, projectData]);

  useEffect(() => {
    if (!isEdit && formik.values.title) {
      const cleanTitle = formik.values.title
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, "");
      const words = cleanTitle.split(/\s+/).filter(Boolean);

      let generatedKey = "";

      if (words.length >= 3) {
        generatedKey = words
          .map((w) => w[0])
          .join("")
          .slice(0, 5);
      } else {
        generatedKey = cleanTitle.replace(/\s/g, "").slice(0, 3);
      }

      formik.setFieldValue("key", generatedKey);
    }
  }, [formik.values.title, isEdit]);

  const handleClose = () => {
    formik.resetForm();
    createMutation.reset();
    updateMutation.reset();
    onClose();
  };

  const modalAction = (
    <>
      <Button onClick={handleClose} color="inherit" disabled={isLoading}>
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading || !formik.isValid}
        onClick={formik.handleSubmit}
      >
        {isLoading ? "Creating..." : isEdit ? "Save Changes" : "Create Project"}
      </Button>
    </>
  );

  return (
    <EntityModal
      open={open}
      onClose={handleClose}
      title={isEdit ? "Edit Project" : "Create New Project"}
      subtitle={
        isEdit
          ? "Update project details"
          : parentId
            ? "Create a new sub-project in this folder"
            : "Create a container for your work"
      }
      actions={modalAction}
      isLoading={isLoading}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              autoFocus
              fullWidth
              id="title"
              name="title"
              label="Project Name"
              placeholder="e.g. Website Redesign"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              sx={{ flexGrow: 1 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="key"
              name="key"
              label="Key"
              placeholder="WEB"
              value={formik.values.key}
              disabled={true}
              onBlur={formik.handleBlur}
              error={formik.touched.key && Boolean(formik.errors.key)}
              helperText={formik.touched.key && formik.errors.key}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <TagIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 140,
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#1976d2",
                  fontWeight: "bold",
                },
              }}
            />
          </Grid>
        </Grid>

        <TextField
          select
          fullWidth
          id="team_id"
          name="team_id"
          label="Assign to Team"
          value={formik.values.team_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isLoadingTeams}
        >
          <MenuItem value="">
            <Typography color="text.secondary" fontStyle="italic">
              Personal Project (No Team)
            </Typography>
          </MenuItem>

          {teams?.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Typography>{team.name}</Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  {team.department_type?.toUpperCase()}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        id="description"
        name="description"
        label="Description (Optional)"
        placeholder="What is this project about?"
        value={formik.values.description}
        onChange={formik.handleChange}
      />
    </EntityModal>
  );
};
export default CreateProjectModal;
