import api from '@/api/axios'

export const fetchTeams = async() => {
    const response = await api.get("/teams");
    return Array.isArray(response.data) ? response.data : [response.data];
};

export const fetchTeamsById  = async(id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
};

export const createTeam = async(teamData) => {
    const response = await api.post("/teams", { team: teamData });
    return response.data;
};

export const updateTeam = async({ id, teamData }) => {
    const response = await api.patch(`/teams/${id}`, { team: teamData });
    return response.data;
};

export const deleteTeam = async(id) => {
    return api.delete(`/teams/${id}`);
};

export const fetchTeamMembers = async(teamId) => {
    const response = await api.get(`/teams/${teamId}/memberships`);
    return response.data;
};
export const addTeamMember = async({ teamId, email, role = 'member' }) => {
    const response = await api.post(`/teams/${teamId}/memberships`, { email, role });
    return response.data;
};

export const removeTeamMember = async({ teamId, membershipId }) => {
    return api.delete(`/teams/${teamId}/memberships/${membershipId}`);
};