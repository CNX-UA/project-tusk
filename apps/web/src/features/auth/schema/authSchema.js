import * as Yup from 'yup';

export const authSchema = Yup.object().shape({
    email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
    password: Yup.string()
    .min(8, 'The password must be at least 8 characters long.')
    .required('Password is required'),

});