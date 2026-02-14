import React, { useEffect } from "react";
import { useFormik } from "formik";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  ListItemIcon,
  Typography,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import EntityModal from "@/components/ui/EntityModal";
import { useTaskMutation } from "../hooks/useTaskMutation";
import { useCreateTask } from "../hooks/useCreateTask";
import { useToast } from "@/context/ToastProvider";
import { taskSchema } from "../schema/taskSchema";

const PRIORITIES = [
  { value: 0, label: "Low", color: "#4caf50" }, // Green
  { value: 1, label: "Medium", color: "#ff9800" }, // Orange
  { value: 2, label: "High", color: "#f44336" }, // Red
];

const getPriorityValue = (p) => {
    if (p === 'high' || p === 2) return 2;
    if (p === 'medium' || p === 1) return 1;
    return 0; // low або default
};

const CreateTaskModal = ({ open, onClose, projectId, taskData }) => {
  const { showToast } = useToast();
  const isEdit = !!taskData;

  const createMutation = useCreateTask();
  const { updateMutation } = useTaskMutation();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      priority: 1,
      deadline: "",
    },
    validationSchema: taskSchema,
    onSubmit: (values) => {
      const payload = { ...values, priority: Number(values.priority) };

      if (isEdit) {
        updateMutation.mutate(
          { id: taskData.id, taskData: values },
          {
            onSuccess: () => {
              showToast("Task updated successfully", "success");
              handleClose();
            },
            onError: () => showToast("Failed to update task", "error"),
          },
        );
      } else {
        createMutation.mutate(
          { projectId: projectId, taskData: values },
          {
            onSuccess: () => {
              showToast("Task created successfully", "success");
              handleClose();
            },
            onError: () => {
              showToast("Failed to create task", "error");
            },
          },
        );
      }
    },
  });

  useEffect(() => {
    if (isEdit && taskData) {
      formik.setValues({
        title: taskData.title || "",
        description: taskData.description || "",
        priority: taskData.priority ?? 1,
        deadline: taskData.deadline ? taskData.deadline.split("T")[0] : "",
      });
    } else {
        if (open) formik.resetForm();
    }
  }, [isEdit, taskData, open]);

  const handleClose = () => {
    formik.resetForm();
    createMutation.reset();
    updateMutation.reset();
    onClose();
  };

  const modalActions = (
    <>
      <Button
        onClick={handleClose}
        color="inherit"
        disabled={createMutation.isPending}
      >
        Cancel
      </Button>
      <Button
        onClick={formik.handleSubmit}
        variant="contained"
        disabled={createMutation.isPending || !formik.isValid}
      >
        {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Task"}
      </Button>
    </>
  );

  return (
    <EntityModal
      open={open}
      onClose={handleClose}
      title="New Task"
      subtitle="Add a new task to the board"
      actions={modalActions}
      isLoading={createMutation.isPending}
    >
      <Box sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              autoFocus
              fullWidth
              id="title"
              name="title"
              label="Task Title"
              placeholder="e.g. Fix login bug"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                id="priority"
                name="priority"
                value={formik.values.priority}
                label="Priority"
                onChange={formik.handleChange}
                renderValue={(selected) => {
                  const priority = PRIORITIES.find(p => p.value === Number(selected)) || PRIORITIES[1];

                  if (!priority) {
                    return selected;
                  }
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FlagIcon sx={{ color: priority.color, fontSize: 20 }} />
                      {priority?.label}
                    </Box>
                  );
                }}
              >
                {PRIORITIES.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    <ListItemIcon>
                      <FlagIcon sx={{ color: priority.color }} />
                    </ListItemIcon>
                    <Typography variant="inherit">{priority.label}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          type="date"
          id="deadline"
          name="deadline"
          label="Deadline"
          InputLabelProps={{ shrink: true }}
          value={formik.values.deadline}
          onChange={formik.handleChange}
          sx={{ mt: 3 }}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          id="description"
          name="description"
          label="Description (Optional)"
          placeholder="Add more details..."
          value={formik.values.description}
          onChange={formik.handleChange}
          sx={{ mt: 3 }}
        />
      </Box>
    </EntityModal>
  );
};

export default CreateTaskModal;
