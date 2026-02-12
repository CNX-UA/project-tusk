import React from 'react';
import { useFormik } from 'formik';

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { useCreateTask } from '../hooks/useCreateTask';

const CreateTaskModal = ({ open, onClose, projectId }) => {
    const createTaskMutation = useCreateTask(projectId, onClose);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            priority: 1,
            status: 'todo',
        },
        validationSchema: taskSchema,
        onSubmit: (values) => {
            createTaskMutation.mutate(values);
            console.log(values);
            formik.resetForm();
        },
    });

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };
    
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm"></Dialog>
    )
}
