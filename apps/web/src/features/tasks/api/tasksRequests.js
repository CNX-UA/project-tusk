import api from '@/api/axios';

// Створення таски
export const createTask = async ({ projectId, taskData }) => {
  // Бекенд чекає { task: { ... } }
  const response = await api.post(`/api/v1/projects/${projectId}/tasks`, { task: taskData });
  return response.data;
};

// Отримання списку тасок (знадобиться для відображення)
export const fetchTasks = async (projectId) => {
  const response = await api.get(`/api/v1/projects/${projectId}/tasks`);
  return response.data;
};