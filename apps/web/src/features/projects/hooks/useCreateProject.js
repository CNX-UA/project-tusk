import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../api/projectsRequests";

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['projects']);

            if (onSuccessCallback) onSuccessCallback(data);
        },
    });
};