import axios from 'axios';
import { BACKEND_URL } from './Tools';

const ProjectClient = {
    // Create a new project (supports image upload)
    createProject: async (projectData) => {
        const formData = new FormData();

        for (const key in projectData) {
            if (Array.isArray(projectData[key])) {
                formData.append(key, projectData[key].join(','));
            } else {
                formData.append(key, projectData[key]);
            }
        }

        const response = await axios.post(`${BACKEND_URL}/api/project`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true, // optional, if you use cookies
        });

        return response.data;
    },

    // Get all projects (optional search query)
    getProjects: async (search = '') => {
        const endpoint = search ? `/project?search=${encodeURIComponent(search)}` : '/project';
        const response = await axios.get(`${BACKEND_URL}/api${endpoint}`);
        return response.data;
    },

    // Get single project by ID
    getProjectById: async (id) => {
        const response = await axios.get(`/project/${id}`, { withCredentials: true });
        return response.data;
    },

    // Update a project by ID (supports image upload)
    updateProject: async (id, projectData) => {
        const formData = new FormData();

        for (const key in projectData) {
            if (Array.isArray(projectData[key])) {
                formData.append(key, projectData[key].join(','));
            } else {
                formData.append(key, projectData[key]);
            }
        }

        const response = await axios.put(`/project/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });

        return response.data;
    },

    // Delete a project by ID
    deleteProject: async (id) => {
        const response = await axios.delete(`/project/${id}`, { withCredentials: true });
        return response.data;
    },
};

export default ProjectClient;
