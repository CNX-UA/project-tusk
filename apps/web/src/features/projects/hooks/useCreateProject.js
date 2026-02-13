import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../api/projectsRequests";

export const useCreateProject = (onSuccessCallback) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });

            if (onSuccessCallback) onSuccessCallback(data?.data);
        },
    });
};