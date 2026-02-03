import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from '../api/projectsRequests';

export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};