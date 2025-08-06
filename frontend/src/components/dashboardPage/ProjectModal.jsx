import React, { useState } from 'react';
import { X, Globe, Github, Star, Upload, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import ProjectClient from '../../tools/ProjectClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from '../../tools/Tools';

function ProjectModal({
    showModal,
    setShowModal,
    editingProject,
    setEditingProject,
    onProjectUpdate
}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        images: [],
        imagePreviews: [],
        tags: '',
        tools: '',
        liveUrl: '',
        githubUrl: '',
        featured: false,
        hidden: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        // Check if adding these files would exceed the limit (e.g., 5 images max)
        const maxImages = 5;
        const totalImages = formData.images.length + files.length;

        if (totalImages > maxImages) {
            setError(`Maximum ${maxImages} images allowed. You're trying to add ${files.length} more to your existing ${formData.images.length} images.`);
            return;
        }

        // Validate files
        const validFiles = [];
        const newPreviews = [];

        for (const file of files) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError(`File "${file.name}" is not a valid image file`);
                continue;
            }

            // Validate file size (5MB limit per file)
            if (file.size > 5 * 1024 * 1024) {
                setError(`Image "${file.name}" must be less than 5MB`);
                continue;
            }

            validFiles.push(file);
            newPreviews.push({
                file,
                url: URL.createObjectURL(file),
                id: Date.now() + Math.random() // Simple unique ID
            });
        }

        if (validFiles.length === 0) return;

        setError(null);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...validFiles],
            imagePreviews: [...prev.imagePreviews, ...newPreviews]
        }));

        // Reset the input
        e.target.value = '';
    };

    const removeImage = (index) => {
        const preview = formData.imagePreviews[index];
        if (preview && preview.url) {
            URL.revokeObjectURL(preview.url);
        }

        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
            imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
        }));
    };

    const removeAllImages = () => {
        // Cleanup object URLs
        formData.imagePreviews.forEach(preview => {
            if (preview.url) {
                URL.revokeObjectURL(preview.url);
            }
        });

        setFormData(prev => ({
            ...prev,
            images: [],
            imagePreviews: []
        }));
    };

    const closeModal = () => {
        // Cleanup object URLs
        formData.imagePreviews.forEach(preview => {
            if (preview.url) {
                URL.revokeObjectURL(preview.url);
            }
        });

        setShowModal(false);
        setEditingProject(null);
        setFormData({
            title: '',
            description: '',
            images: [],
            imagePreviews: [],
            tags: '',
            tools: '',
            liveUrl: '',
            githubUrl: '',
            featured: false,
            hidden: false
        });
        setError(null);
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.description) {
            setError('Please fill in required fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const projectData = {
                title: formData.title,
                description: formData.description,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                tools: formData.tools.split(',').map(tool => tool.trim()).filter(tool => tool),
                liveUrl: formData.liveUrl,
                githubUrl: formData.githubUrl,
                featured: formData.featured,
                hidden: formData.hidden
            };

            // Add images if provided
            if (formData.images.length > 0) {
                projectData.images = formData.images;
            }

            if (editingProject) {
                await ProjectClient.updateProject(editingProject.id, projectData);
            } else {
                await ProjectClient.createProject(projectData);
            }

            // Call the update callback to refresh the projects list
            if (onProjectUpdate) {
                onProjectUpdate();
            }

            closeModal();
        } catch (err) {
            console.error('Error saving project:', err);
            toast.error('Failed to save project. Please try again.')
            setError(err.response?.data?.message || 'Failed to save project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Update form data when editing project changes
    React.useEffect(() => {
        if (editingProject) {
            // Handle existing images from server
            const existingImages = editingProject.images || [editingProject.image].filter(Boolean);
            const existingPreviews = existingImages.map((img, index) => ({
                url: `${BACKEND_URL}${img.replace(/\\/g, '/')}`,
                isExisting: true,
                id: `existing-${index}`
            }));

            setFormData({
                title: editingProject.title || '',
                description: editingProject.description || '',
                images: [],
                imagePreviews: existingPreviews,
                tags: (editingProject.tags || []).join(', '),
                tools: (editingProject.tools || []).join(', '),
                liveUrl: editingProject.liveUrl || '',
                githubUrl: editingProject.githubUrl || '',
                featured: editingProject.featured || false,
                hidden: editingProject.hidden || false
            });
        } else {
            setFormData({
                title: '',
                description: '',
                images: [],
                imagePreviews: [],
                tags: '',
                tools: '',
                liveUrl: '',
                githubUrl: '',
                featured: false,
                hidden: false
            });
        }
        setError(null);
    }, [editingProject]);

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <ToastContainer />
            <div
                className="w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl transform transition-all duration-300 scale-100 relative"
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
                            disabled={loading}
                            className="p-3 hover:bg-gray-700/50 rounded-full transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                        >
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

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
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400 disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Project Images (Max 5)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        disabled={loading}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400 cursor-pointer hover:bg-gray-700/50 flex items-center gap-3 disabled:opacity-50"
                                    >
                                        <Upload className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-400">
                                            {formData.images.length > 0
                                                ? `${formData.images.length} image(s) selected`
                                                : 'Choose multiple images'}
                                        </span>
                                    </label>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-gray-400">Max size: 5MB per image. Supported: JPG, PNG, GIF</p>
                                    <span className="text-xs text-gray-400">
                                        {formData.imagePreviews.length}/5 images
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Images Preview Grid */}
                        {formData.imagePreviews.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-semibold text-gray-300">
                                        Image Previews ({formData.imagePreviews.length})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={removeAllImages}
                                        disabled={loading}
                                        className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                    >
                                        Remove All
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {formData.imagePreviews.map((preview, index) => (
                                        <div key={preview.id || index} className="relative group">
                                            <img
                                                src={preview.url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border border-gray-600/50"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                disabled={loading}
                                                className="absolute -top-2 -right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            {preview.isExisting && (
                                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600/80 text-xs text-white rounded">
                                                    Current
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
                                disabled={loading}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none transition-all duration-300 text-white placeholder-gray-400 disabled:opacity-50"
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
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400 disabled:opacity-50"
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
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400 disabled:opacity-50"
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
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400 disabled:opacity-50"
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
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 text-white placeholder-gray-400 disabled:opacity-50"
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
                                    disabled={loading}
                                    className="w-5 h-5 text-purple-600 border-gray-600 rounded focus:ring-purple-500 bg-gray-700 disabled:opacity-50"
                                />
                                <label htmlFor="featured" className="ml-3 flex items-center text-gray-300 font-medium">
                                    <Star className="w-5 h-5 mr-2 text-purple-400" />
                                    Mark as Featured Project
                                </label>
                            </div>
                            <p className="text-sm text-gray-400 mt-2 ml-8">Featured projects will be highlighted with a star badge</p>
                        </div>

                        <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="hidden"
                                    id="hidden"
                                    checked={formData.hidden}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="w-5 h-5 text-orange-600 border-gray-600 rounded focus:ring-orange-500 bg-gray-700 disabled:opacity-50"
                                />
                                <label htmlFor="hidden" className="ml-3 flex items-center text-gray-300 font-medium">
                                    <svg className="w-5 h-5 mr-2 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                    Hide Project from Public View
                                </label>
                            </div>
                            <p className="text-sm text-gray-400 mt-2 ml-8">Hidden projects will not appear in your public portfolio but remain accessible to you</p>
                        </div>

                        <div className="flex gap-4 pt-8">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                className="flex-1 px-6 py-4 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 font-semibold disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {editingProject ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        {editingProject ? '✨ Update Project' : '🚀 Create Project'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectModal;