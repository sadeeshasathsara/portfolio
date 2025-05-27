import Project from '../../models/Project.js';
import { uploadProjectImage } from '../../middlewares/UploadMiddlewareCtrl.js';
import fs from 'fs';
import path from 'path';

// Helper function to delete old file if it exists
const deleteOldFile = (filePath) => {
    if (filePath) {
        const fullPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
};

// Create a new project with image upload
export const createProject = async (req, res) => {
    try {
        uploadProjectImage.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            const projectData = req.body;

            // If file was uploaded, add the path to project data
            if (req.file) {
                projectData.image = req.file.path;
            }

            // Parse tools and tags if they're sent as strings
            if (typeof projectData.tools === 'string') {
                projectData.tools = projectData.tools.split(',').map(t => t.trim());
            }
            if (typeof projectData.tags === 'string') {
                projectData.tags = projectData.tags.split(',').map(t => t.trim());
            }

            const project = new Project(projectData);
            await project.save();
            res.status(201).json(project);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all projects (with search functionality)
export const getProjects = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = { $text: { $search: search } };
        }

        const projects = await Project.find(query).sort({ createdAt: -1 });

        // Convert file paths to URLs
        const projectsWithUrls = projects.map(project => ({
            ...project.toObject(),
            imageUrl: project.image ? `/up/project/${path.basename(project.image)}` : null
        }));

        res.status(200).json(projectsWithUrls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Convert file path to URL
        const projectWithUrl = {
            ...project.toObject(),
            imageUrl: project.image ? `/uploads/${path.basename(project.image)}` : null
        };

        res.status(200).json(projectWithUrl);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a project with optional image upload
export const updateProject = async (req, res) => {
    try {
        uploadProjectImage.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            const projectData = req.body;
            const projectId = req.params.id;

            // Find existing project to check for old image
            const existingProject = await Project.findById(projectId);
            if (!existingProject) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // If new file was uploaded
            if (req.file) {
                // Delete old file if it exists
                deleteOldFile(existingProject.image);
                // Add new file path to project data
                projectData.image = req.file.path;
            }

            // Parse tools and tags if they're sent as strings
            if (typeof projectData.tools === 'string') {
                projectData.tools = projectData.tools.split(',').map(t => t.trim());
            }
            if (typeof projectData.tags === 'string') {
                projectData.tags = projectData.tags.split(',').map(t => t.trim());
            }

            const updatedProject = await Project.findByIdAndUpdate(
                projectId,
                projectData,
                { new: true, runValidators: true }
            );

            res.status(200).json(updatedProject);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a project and its associated image
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Delete associated image file
        deleteOldFile(project.image);

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};