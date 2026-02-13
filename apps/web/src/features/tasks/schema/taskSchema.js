import * as Yup from 'yup';

export const taskSchema = Yup.object({
title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .required('Task title is required'),
    description: Yup.string()
        .max(1000, 'Description is too long'),
    priority: Yup.number()
        .oneOf([0, 1, 2], 'Invalid priority')
        .required('Priority is required'),
});