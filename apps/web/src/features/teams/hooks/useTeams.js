import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import 
{ fetchTeams, fetchTeamsById, createTeam, deleteTeam, addTeamMember, removeTeamMember, fetchTeamMembers } 
from "../api/teamsRequests";
import { useToast } from "@/context/ToastProvider";

export const useTeams = () => {
    return useQuery({
        queryKey: ["teams"],
        queryFn: fetchTeams,
    });
};
export const useTeam = (id) => {
    return useQuery({
        queryKey: ["teams", id, ],
        queryFn: () => fetchTeamsById(id),
        enabled: !!id,
    });
};

export const useTeamMembers = (teamId) => {
    return useQuery({
        queryKey: ["teams", teamId, "members"],
        queryFn: () => fetchTeamMembers(teamId),
        enabled: !!teamId,
    });
};

export const useTeamMutation = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const createMutation = useMutation({
        mutationFn: createTeam,
        onSuccess: () => {
            queryClient.invalidateQueries(["teams"]);
            showToast("Team created successfully", "success")
        },
        onError: (error) => {
            showToast(error.message, "error");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTeam,
        onSuccess: () => {
            queryClient.invalidateQueries(["teams"]);
            showToast("Team deleted successfully", "success")
        },
        onError: (error) => {
            showToast(error.message, "error");
        },
    });

    const addMemberMutation = useMutation({
        mutationFn: addTeamMember,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["teams", variables.teamId, "members"]);
            queryClient.invalidateQueries(["teams", variables.teamId])
            showToast("Member added", "success");
        },
        onError: (error) => {
            showToast(error.response?.data?.error || "Failed to add member", "error");
        },
    });

    const removeMemberMutation = useMutation({
        mutationFn: removeTeamMember,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["teams", variables.teamId, "members"]);
            queryClient.invalidateQueries(["teams", variables.teamId]);
            showToast("Member removed", "info");
        },
         onError: (error) => {
            showToast(error.response?.data?.error || "Failed to remove member", "error");
        },
    });

    return {
        createMutation,
        deleteMutation,
        addMemberMutation,
        removeMemberMutation,
    }
};


