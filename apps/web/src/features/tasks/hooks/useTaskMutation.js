import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask, deleteTask } from "../api/tasksRequests";
import { useToast } from "@/context/ToastProvider";


export const useTaskMutation = (projectId) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const updateMutation = useMutation({
    mutationFn: updateTask,
    // ОПТИМІСТИЧНЕ ОНОВЛЕННЯ
    onMutate: async ({ id, taskData }) => {
      // 1. Скасовуємо запити саме для ЦЬОГО проєкту
      await queryClient.cancelQueries({ queryKey: ["projects", projectId] });

      // 2. Зберігаємо старі дані
      const previousProject = queryClient.getQueryData(["projects", projectId]);

      // 3. Оновлюємо кеш ВРУЧНУ
      queryClient.setQueryData(["projects", projectId], (oldProject) => {
        if (!oldProject || !oldProject.tasks) return oldProject;

        return {
          ...oldProject,
          tasks: oldProject.tasks.map((task) =>
            task.id === id ? { ...task, ...taskData } : task
          ),
        };
      });

      return { previousProject };
    },
    onError: (err, newTodo, context) => {
      // Якщо помилка - повертаємо як було
      if (context?.previousProject) {
        queryClient.setQueryData(["projects", projectId], context.previousProject);
      }
      showToast("Failed to update task", "error");
    },
    onSettled: () => {
      // Синхронізуємось з сервером
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      showToast("Task deleted", "success");
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
    onError: () => {
        showToast("Failed to delete task", "error");
    }
  });

  return { updateMutation, deleteMutation };
};