import api from "@/api/axios"

export const fetchProjects = async () => {
    const response =  await api.get("/api/v1//projects");

    return response.data.data || response.data;
};

export const createProject = async (projectData) => {
    const response = await api.post("/api/v1//projects", {project: projectData});
    return response.data.data;
};