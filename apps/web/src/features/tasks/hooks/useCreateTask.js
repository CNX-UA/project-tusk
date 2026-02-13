import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/tasksRequests';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
        mutationFn: createTask,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(["projects", variables.projectId]);
            
            queryClient.invalidateQueries(["tasks"]);
        },
        onError: (error) => {
            console.error("Failed to create task:", error);
        },
    });
};