import * as Yup from 'yup';

export const projectSchema = Yup.object({
    title: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .required('Project title is required'),
    key: Yup.string()
        .min(2, 'Must be at least 2 characters')
        .required('Project key is required')
        .max(10, 'Must be at most 10 characters')
        .uppercase("Must be uppercase")
        .matches(/^[A-Z0-9]+$/, 'Only uppercase letters and numbers allowed')
        .required('Project'),
    description: Yup.string()
        .max(500, 'Description is too long'),
});