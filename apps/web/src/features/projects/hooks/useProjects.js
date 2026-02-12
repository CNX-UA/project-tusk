import { useQuery } from "@tanstack/react-query";
import { fetchProjects, fetchProjectById } from '../api/projectsRequests';

export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        select: (data) => data?.data || [],
    });
};

export const useProject = (projectId) => {
    return useQuery({
        queryKey: ['projects', projectId],
        queryFn: () => fetchProjectById(projectId),
        staleTime: 5 * 60 * 1000,
        enabled: !!projectId,
    });
};
