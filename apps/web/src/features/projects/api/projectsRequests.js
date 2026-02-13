import api from "@/api/axios"

export const fetchProjects = async (params = {}) => {
    const response =  await api.get("/projects", { params });
    // Wrap response in data object for consistency
    return { data: Array.isArray(response.data) ? response.data : [response.data] };
};

export const fetchProjectById = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

export const createProject = async (projectData) => {
    const response = await api.post("/projects", {project: projectData});
    return { data: response.data };
};

export const updateProject = async ({ id, projectData }) => {
    const response = await api.patch(`/projects/${id}`, {project: projectData });
    return response.data;
}
export const deleteProject = async ( id ) => {
    // const response = await api.delete(`api/v1/projects/${id}`);
    // return response.data;
    return api.delete(`/projects/${id}`);
}