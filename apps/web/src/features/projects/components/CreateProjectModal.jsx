import React, {useEffect} from 'react';
import { useFormik } from 'formik';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, Typography, InputAdornment 
} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import { projectSchema } from '../schema/projectSchema';
import { useCreateProject } from '../hooks/useCreateProject';
import { useToast } from '@/context/ToastProvider';

const CreateProjectModal = ({ open, onClose }) => {
    const { showToast } = useToast();

    const createMutation = useCreateProject(() => {
        showToast('Project created successfully', 'success');
        handleClose();
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            key: '',
            description: ''
        },
        validationSchema: projectSchema,
        onSubmit: (values) => {
            createMutation.mutate(values);
        },
    });

    useEffect(() => {
        if (!formik.touched.key && formik.values.title) {
            const generatedKey = formik.values.title
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice (0,4);
            
            formik.setFieldValue('key', generatedKey)
        }
    }, [formik.values.title]);

    const handleClose = () => {
        formik.resetForm();
        createMutation.reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Project</DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                        Create a workspace to track everything
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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

                        <TextField 
                        sx={{ width: 140 }}
                        id="key"
                        name="key"
                        label="Key"
                        placeholder="WEB"
                        value={formik.values.key}
                        onChange={(e) => {
                            formik.setFieldValue('key', e.target.value.toUpperCase());
                        }}
                        onBlur={formik.handleBlur}
                        error={formik.touched.key && Boolean(formik.errors.key)}
                        helperText={formik.touched.key && formik.errors.key}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <TagIcon fontSize="small" />
                            </InputAdornment>
                            ),
                        }} 
                        />
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

                   {createMutation.isError && (         
                    <Typography color='error' variant='body2' sx={{ mt: 2 }}>
                        {createMutation.error?.response?.data?.status?.message || "Failed to create project"}
                    </Typography>
                   )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} color='inherit'>Cancel</Button>
                    <Button type='submit' variant='contained' disabled={createMutation.isPending || !formik.isValid}
                    >
                        {createMutation.isPending ? 'Creating...' : 'Create Project'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default CreateProjectModal;