import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Star, Code, Eye, Github, Loader2 } from 'lucide-react';
import ProjectClient from '../../tools/ProjectClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from '../../tools/Tools';

function Projects({ onOpenModal }) {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCard, setActiveCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);

    // Fetch projects on component mount and when search term changes
    useEffect(() => {
        fetchProjects();
    }, []);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '') {
                fetchProjects(searchTerm);
            } else {
                fetchProjects();
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const fetchProjects = async (search = '') => {
        try {
            setLoading(true);
            setError(null);
            const response = await ProjectClient.getProjects(search);
            setProjects(response.data);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Failed to load projects. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            setDeleting(id);
            await ProjectClient.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
            toast.success('Project deleted successfully');
        } catch (err) {
            console.error('Error deleting project:', err);
            toast.error('Failed to delete project. Please try again.');
            setError('Failed to delete project. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    const handleCardClick = (id) => {
        setActiveCard(activeCard === id ? null : id);
    };

    const handleProjectUpdate = () => {
        // Refresh projects after update
        fetchProjects(searchTerm);
    };

    if (loading) {
        return (
            <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#00da6b] animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={() => fetchProjects()}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-6">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-6 mb-12">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-[#00da6b] focus:border-[#00da6b] outline-none transition-all duration-300 text-white placeholder-gray-400"
                        />
                    </div>
                    <button
                        onClick={() => onOpenModal(null, handleProjectUpdate)}
                        className="flex items-center gap-3 bg-gradient-to-r from-[#01be5c] to-[#00a33d] hover:from-[#01c45f] hover:to-[#009637] cursor-pointer text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5" />
                        Add Project
                    </button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                        <div key={project.id} className="group bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col">
                            {/* Project Image */}
                            <div
                                className="relative overflow-hidden cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick(project.id);
                                }}
                            >
                                {project.image ? (
                                    <img
                                        src={`${BACKEND_URL}${project.imageUrl}`}
                                        alt={project.title}
                                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                        <Code className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}

                                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 flex items-end justify-center
                                    ${activeCard === project.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <div className={`p-4 w-full flex justify-center gap-4 transition-transform duration-300
                                        ${activeCard === project.id ? 'translate-y-0' : 'translate-y-10 group-hover:translate-y-0'}`}>
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-green-500 hover:bg-green-600 text-black font-medium w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Eye size={18} />
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-gray-800 hover:bg-gray-700 text-white font-medium w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Github size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Project Content */}
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                                    {project.title}
                                    {project.featured && (
                                        <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current" />
                                            Featured
                                        </span>
                                    )}
                                </h3>
                                <p className="text-gray-300 text-sm mb-4 flex-grow">
                                    {project.description}
                                </p>

                                {/* Technologies */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {(project.tools || []).map((tool, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md"
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-center gap-2 mt-auto">
                                    <button
                                        onClick={() => onOpenModal(project, handleProjectUpdate)}
                                        className="flex-1 bg-[#34275a] hover:bg-[#3d2d66] cursor-pointer text-white p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteProject(project._id)}
                                        disabled={deleting === project.id}
                                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white cursor-pointer p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                                    >
                                        {deleting === project.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-gray-700/30">
                            <Code className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {searchTerm ? 'No projects found' : 'No projects yet'}
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {searchTerm
                                    ? 'Try adjusting your search terms'
                                    : 'Add your first project to get started'
                                }
                            </p>
                            <button
                                onClick={() => onOpenModal(null, handleProjectUpdate)}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <Plus className="w-5 h-5" />
                                {searchTerm ? 'Add New Project' : 'Create First Project'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;