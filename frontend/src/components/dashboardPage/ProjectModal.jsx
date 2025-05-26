import React, { useState } from 'react';
import { X, Globe, Github, Star } from 'lucide-react';

function ProjectModal({
    showModal,
    setShowModal,
    editingProject,
    setEditingProject,
    projects,
    setProjects
}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        tags: '',
        tools: '',
        liveUrl: '',
        githubUrl: '',
        featured: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProject(null);
        setFormData({
            title: '',
            description: '',
            image: '',
            tags: '',
            tools: '',
            liveUrl: '',
            githubUrl: '',
            featured: false
        });
    };

    const handleSubmit = () => {
        if (!formData.title || !formData.description) {
            alert('Please fill in required fields');
            return;
        }

        const projectData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            tools: formData.tools.split(',').map(tool => tool.trim()).filter(tool => tool)
        };

        if (editingProject) {
            setProjects(prev => prev.map(p =>
                p.id === editingProject.id
                    ? { ...projectData, id: editingProject.id }
                    : p
            ));
        } else {
            const newProject = {
                ...projectData,
                id: Date.now()
            };
            setProjects(prev => [...prev, newProject]);
        }
        closeModal();
    };

    // Update form data when editing project changes
    React.useEffect(() => {
        if (editingProject) {
            setFormData({
                title: editingProject.title,
                description: editingProject.description,
                image: editingProject.image,
                tags: editingProject.tags.join(', '),
                tools: editingProject.tools.join(', '),
                liveUrl: editingProject.liveUrl,
                githubUrl: editingProject.githubUrl,
                featured: editingProject.featured
            });
        } else {
            setFormData({
                title: '',
                description: '',
                image: '',
                tags: '',
                tools: '',
                liveUrl: '',
                githubUrl: '',
                featured: false
            });
        }
    }, [editingProject]);

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl transform transition-all duration-300 scale-100 relative"
                style={{ backgroundColor: '#121a27' }}
            >
                {/* Custom scrollbar styles */}
                <style jsx>{`
                    .modal-content::-webkit-scrollbar {
                        width: 8px;
                    }
                    .modal-content::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .modal-content::-webkit-scrollbar-thumb {
                        background: rgba(139, 92, 246, 0.3);
                        border-radius: 4px;
                    }
                    .modal-content::-webkit-scrollbar-thumb:hover {
                        background: rgba(139, 92, 246, 0.5);
                    }
                    .modal-content {
                        scrollbar-width: thin;
                        scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
                    }
                `}</style>

                <div className="modal-content overflow-y-auto max-h-[90vh] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {editingProject ? 'Edit Project' : 'Create New Project'}
                            </h2>
                            <p className="text-gray-400">Fill in the details below to {editingProject ? 'update' : 'add'} your project</p>
                        </div>
                        <button
                            onClick={closeModal}
                            className="p-3 hover:bg-gray-700/50 rounded-full transition-all duration-300 transform hover:scale-110"
                        >
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Project Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter project title"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                Description * (max 130 characters)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your project in a few sentences..."
                                maxLength={130}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none transition-all duration-300 text-white placeholder-gray-400"
                            />
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-gray-400">
                                    {formData.description.length}/130 characters
                                </p>
                                <div className={`w-24 h-1 rounded-full ${formData.description.length > 120 ? 'bg-red-400' : formData.description.length > 100 ? 'bg-yellow-400' : 'bg-green-400'}`}>
                                    <div
                                        className="h-full rounded-full bg-current transition-all duration-300"
                                        style={{ width: `${(formData.description.length / 130) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Technologies (comma separated)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="React, JavaScript, CSS, Node.js"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Development Tools (comma separated)
                                </label>
                                <input
                                    type="text"
                                    name="tools"
                                    value={formData.tools}
                                    onChange={handleInputChange}
                                    placeholder="VS Code, Figma, Git, Docker"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    <Globe className="inline w-4 h-4 mr-2" />
                                    Live Demo URL
                                </label>
                                <input
                                    type="url"
                                    name="liveUrl"
                                    value={formData.liveUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://your-project.com"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    <Github className="inline w-4 h-4 mr-2" />
                                    GitHub Repository URL
                                </label>
                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://github.com/username/repo"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-purple-600 border-gray-600 rounded focus:ring-purple-500 bg-gray-700"
                                />
                                <label htmlFor="featured" className="ml-3 flex items-center text-gray-300 font-medium">
                                    <Star className="w-5 h-5 mr-2 text-purple-400" />
                                    Mark as Featured Project
                                </label>
                            </div>
                            <p className="text-sm text-gray-400 mt-2 ml-8">Featured projects will be highlighted with a star badge</p>
                        </div>

                        <div className="flex gap-4 pt-8">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex-1 px-6 py-4 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
                            >
                                {editingProject ? '✨ Update Project' : '🚀 Create Project'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectModal;