import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/tasksRequests';
import { useToast } from '@/context/ToastProvider';

export const useCreateTask = (projectId, onSuccessCallback) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (taskData) => createTask({ projectId, taskData }),
    onSuccess: () => {
      showToast('Task created successfully', 'success');
      // Оновлюємо список тасок саме цього проєкту
      queryClient.invalidateQueries(['tasks', projectId]);
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      console.error(error);
      showToast('Failed to create task', 'error');
    },
  });
};