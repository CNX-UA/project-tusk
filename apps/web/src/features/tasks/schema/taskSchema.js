import * as Yup from 'yup';

const taskSchema = Yup.object({
  title: Yup.string().required('Title is required').max(100),
  description: Yup.string().max(2000),
  priority: Yup.number().required(),
  status: Yup.string().required(),
});