import api from '@/api/axios';

export const createTask = async ({ projectId, taskData }) => {
  const response = await api.post(`/projects/${projectId}/tasks`, { 
      task: taskData 
  });
  return response.data;
};

export const fetchTasks = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/tasks`);
  return response.data;
};

export const updateTask = async ({ id, taskData }) => {
    const response = await api.patch(`/tasks/${id}`, { 
        task: taskData 
    });
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};