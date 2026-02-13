import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask, deleteTask } from "../api/tasksRequests";

export const useTaskMutation = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["projects", data.project_id]);
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, variables) => {
       queryClient.invalidateQueries(["projects"]);
    },
  });

  return { updateMutation, deleteMutation };
};