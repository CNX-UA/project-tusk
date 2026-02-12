import React, { use, useEffect } from "react";
import { useFormik } from "formik";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  Grid, 
} from "@mui/material";

import TagIcon from "@mui/icons-material/Tag";
import FolderIcon from "@mui/icons-material/Folder";

import { projectSchema } from "../schema/projectSchema";
import { useCreateProject } from "../hooks/useCreateProject";
import { useToast } from "@/context/ToastProvider";
import { useProjectMutation } from "../hooks/useProjectMutation";
import  ProjectTypeCard from "./ProjectTypeCard";

import EntityModal from "@/components/ui/EntityModal";

const CreateProjectModal = ({ open, onClose, projectData }) => {
  const isEdit = !!projectData;
  const { showToast } = useToast();
  const { updateMutation } = useProjectMutation();
  const createMutation = useCreateProject(() => {
    showToast("Project created successfully", "success");
    handleClose();
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      key: "",
      description: "",
      // project_type: "board",
    },
    enableReinitialize: isEdit,
    validationSchema: projectSchema,
    onSubmit: (values) => {
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
      } else createMutation.mutate(values);
    },
  });

  useEffect(() => {
    if (isEdit && projectData) {
      formik.setValues({
        title: projectData.title || "",
        key: projectData.key || "",
        description: projectData.description || "",
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
    onClose();
  };

  const modalAction = (
    <>
      <Button onClick={handleClose} color="inherit">
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={createMutation.isPending || !formik.isValid}
        onClick={formik.handleSubmit}
      >
        {createMutation.isPending
          ? "Creating..."
          : isEdit
            ? "Save Changes"
            : "Create Project"}
      </Button>
    </>
  );

  return (
    <EntityModal
      open={open}
      onClose={handleClose}
      title={isEdit ? "Edit Project" : "Create New Project"}
      actions={modalAction}
    >
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1.5, display: "block", fontWeight: "bold" }}
        >
          PROJECT TYPE
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ProjectTypeCard
              label="Task Board"
              value="board"
              // selected={formik.values.project_type === "board"}
              onClick={(val) => formik.setFieldValue("project_type", val)}
              disabled={true}
            />
          </Grid>
          <Grid item xs={6}>
            <ProjectTypeCard
              label="Folder"
              icon={FolderIcon}
              value="folder"
              // selected={formik.values.project_type === "folder"}
              onClick={(val) => formik.setFieldValue("project_type", val)}
              disabled={true}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography
          variant="caption"
          fontWeight="bold"
          color="text.secondary"
          sx={{ mb: 1.5, display: "block" }}
        >
          DETAILS
        </Typography>
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
                  WebkitTextFillColor: "#1976d2", // Робимо текст ключа синім (колір бренду), щоб підсвітити його
                  fontWeight: "bold",
                },
              }}
            />
          </Grid>
        </Grid>
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
    /* <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>{isEdit ? 'Edit Project' : 'Create New Project'}</DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isEdit ? 'Update your workspace details' : 'Create a workspace to track everything'}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>


            
          </Box>

          

          {createMutation.isError && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {createMutation.error?.response?.data?.status?.message ||
                console.log(createMutation.error)}
            </Typography>
          )}
        </DialogContent>
    </Dialog> */
  );
};
export default CreateProjectModal;
