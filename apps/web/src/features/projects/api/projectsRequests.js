import api from "@/api/axios"

export const fetchProjects = async () => {
    const response =  await api.get("/projects");

    return response.data.data || response.data;
};

export const createProject = async (projectData) => {
    const response = await api.post("/projects", {project: projectData});
    return response.data.data;
};