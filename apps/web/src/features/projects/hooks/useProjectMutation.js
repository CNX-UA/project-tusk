import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject, deleteProject } from "../api/projectsRequests";

export const useProjectMutation = () => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: updateProject,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });

    const deleteMutation =  useMutation({
        mutationFn: deleteProject,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });

    return { updateMutation, deleteMutation}
};