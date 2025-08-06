import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Eye, Code, Layout, Images, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { logProjectClick } from '../../tools/ActivityRecorder';
import ProjectClient from '../../tools/ProjectClient';
import { BACKEND_URL } from '../../tools/Tools';

// Gallery Modal Component
const GalleryModal = ({ isOpen, onClose, images, projectTitle, backendUrl }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageLoadStates, setImageLoadStates] = useState({});

    // Reset to first image when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
            // Initialize loading states for gallery images
            const loadStates = {};
            images.forEach((_, index) => {
                loadStates[index] = { loading: true, error: false };
            });
            setImageLoadStates(loadStates);
        }
    }, [isOpen, images]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, images.length]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleImageLoad = (index) => {
        setImageLoadStates(prev => ({
            ...prev,
            [index]: { loading: false, error: false }
        }));
    };

    const handleImageError = (index) => {
        setImageLoadStates(prev => ({
            ...prev,
            [index]: { loading: false, error: true }
        }));
    };

    if (!isOpen || !images || images.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-4xl max-h-none w-full bg-gray-800 rounded-xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                        <h3 className="text-xl font-bold text-white">{projectTitle} - Gallery</h3>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm">
                                {currentIndex + 1} of {images.length}
                            </span>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Image Container - Fixed height for professional layout */}
                    <div className="relative h-[60vh] bg-gray-900">
                        {/* Loading shimmer */}
                        {imageLoadStates[currentIndex]?.loading && (
                            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                <div className="w-16 h-16 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Error state */}
                        {imageLoadStates[currentIndex]?.error && !imageLoadStates[currentIndex]?.loading && (
                            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                <div className="text-center">
                                    <Code size={48} className="text-gray-500 mx-auto mb-2" />
                                    <p className="text-gray-400">Failed to load image</p>
                                </div>
                            </div>
                        )}

                        {/* Current Image */}
                        <img
                            src={`${backendUrl}/up/project/${images[currentIndex]}`}
                            alt={`${projectTitle} gallery image ${currentIndex + 1}`}
                            className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoadStates[currentIndex]?.loading ? 'opacity-0' : 'opacity-100'
                                }`}
                            onLoad={() => handleImageLoad(currentIndex)}
                            onError={() => handleImageError(currentIndex)}
                        />

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails - Fixed at bottom */}
                    {images.length > 1 && (
                        <div className="bg-gray-700 p-3 border-t border-gray-600 flex-shrink-0">
                            <div className="flex gap-2 overflow-x-auto">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentIndex
                                            ? 'border-green-500'
                                            : 'border-gray-600 hover:border-gray-400'
                                            }`}
                                    >
                                        <img
                                            src={`${backendUrl}/up/project/${image}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

function Projects() {
    const [filter, setFilter] = useState('all');
    const [projects, setProjects] = useState([]);
    const [visibleProjects, setVisibleProjects] = useState([]);
    const [animateCards, setAnimateCards] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [imageLoadStates, setImageLoadStates] = useState({});
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [galleryModal, setGalleryModal] = useState({ isOpen: false, images: [], projectTitle: '' });

    // Detect if device is mobile/touch
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Fetch project data
    useEffect(() => {
        (async (search = '') => {
            try {
                setIsLoadingData(true);
                const response = await ProjectClient.getProjects(search);
                setProjects(response);
                setVisibleProjects(response);

                // Initialize loading states for all projects - ensure they start as loading
                const initialLoadStates = {};
                response.forEach(project => {
                    initialLoadStates[project.id] = { loading: true, error: false };
                });
                setImageLoadStates(initialLoadStates);
                setIsLoadingData(false);
            } catch (e) {
                console.error(e);
                setIsLoadingData(false);
            }
        })()
    }, []);

    // Reset image loading states when visible projects change (for filtering)
    useEffect(() => {
        if (visibleProjects.length > 0) {
            const resetLoadStates = {};
            visibleProjects.forEach(project => {
                // Keep existing state if image was already loaded, otherwise set to loading
                resetLoadStates[project.id] = imageLoadStates[project.id] || { loading: true, error: false };
            });
            setImageLoadStates(resetLoadStates);
        }
    }, [visibleProjects]);

    // Filter projects
    useEffect(() => {
        let filteredProjects;

        if (filter === 'all') {
            filteredProjects = projects;
        } else if (filter === 'featured') {
            filteredProjects = projects.filter(project => project.featured);
        } else {
            filteredProjects = projects.filter(project => project.tags.includes(filter));
        }

        setAnimateCards(false);
        setTimeout(() => {
            setVisibleProjects(filteredProjects);
            setAnimateCards(true);
        }, 300);
    }, [filter, projects]);

    // Handle image load success
    const handleImageLoad = (projectId) => {
        // Add a small delay to ensure shimmer is visible
        setTimeout(() => {
            setImageLoadStates(prev => ({
                ...prev,
                [projectId]: { loading: false, error: false }
            }));
        }, 500); // Minimum shimmer display time
    };

    // Handle image load error
    const handleImageError = (projectId) => {
        setTimeout(() => {
            setImageLoadStates(prev => ({
                ...prev,
                [projectId]: { loading: false, error: true }
            }));
        }, 500);
    };

    // Handle gallery modal
    const openGallery = (project) => {
        console.log('Opening gallery for project:', project.title, 'Gallery:', project.gallery); // Debug log
        if (project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0) {
            setGalleryModal({
                isOpen: true,
                images: project.gallery,
                projectTitle: project.title
            });
            logProjectClick(`${project.title} - Gallery View`);
        }
    };

    const closeGallery = () => {
        setGalleryModal({ isOpen: false, images: [], projectTitle: '' });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // Enhanced shimmer animation variants
    const shimmerVariants = {
        animate: {
            x: ['-100%', '100%'],
            transition: {
                duration: 1.5,
                ease: 'linear',
                repeat: Infinity,
                repeatDelay: 0.5
            }
        }
    };

    // Code icon bounce animation
    const codeIconVariants = {
        animate: {
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0],
            transition: {
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity
            }
        }
    };

    // Handle filter click
    const handleFilterClick = (newFilter) => {
        setFilter(newFilter);
    };

    // Handle card click for mobile
    const handleCardClick = (projectId) => {
        if (isMobile) {
            setActiveCard(activeCard === projectId ? null : projectId);
        }
    };

    // Close active card when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (isMobile && activeCard) {
                setActiveCard(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobile, activeCard]);

    // Shimmer Card Component
    const ShimmerCard = () => (
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-hidden flex flex-col">
            {/* Image shimmer */}
            <div className="relative overflow-hidden aspect-video bg-gray-800">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/40 to-transparent"
                    variants={shimmerVariants}
                    animate="animate"
                />
            </div>

            {/* Content shimmer */}
            <div className="p-6 flex-grow flex flex-col space-y-4">
                {/* Title shimmer */}
                <div className="relative h-6 bg-gray-700/50 rounded overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/40 to-transparent"
                        variants={shimmerVariants}
                        animate="animate"
                    />
                </div>

                {/* Description shimmer - multiple lines */}
                <div className="space-y-2 flex-grow">
                    <div className="relative h-4 bg-gray-700/30 rounded overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent"
                            variants={shimmerVariants}
                            animate="animate"
                        />
                    </div>
                    <div className="relative h-4 bg-gray-700/30 rounded overflow-hidden w-4/5">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent"
                            variants={shimmerVariants}
                            animate="animate"
                        />
                    </div>
                    <div className="relative h-4 bg-gray-700/30 rounded overflow-hidden w-3/5">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent"
                            variants={shimmerVariants}
                            animate="animate"
                        />
                    </div>
                </div>

                {/* Tags shimmer */}
                <div className="flex gap-2 flex-wrap mt-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="relative h-6 w-16 bg-gray-700/40 rounded overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent"
                                variants={shimmerVariants}
                                animate="animate"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <section id="projects" className="relative py-20 overflow-hidden bg-black min-h-screen">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black z-0"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl z-0"></div>
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-green-500/10 blur-3xl z-0"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">My Projects</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6"></div>
                    <p className="text-gray-300 text-lg">
                        Explore my work across various technologies and domains
                    </p>
                </div>

                {/* Filter tabs */}
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
                    {['all', 'featured', 'frontend', 'fullstack', 'mern', 'api'].map((category) => (
                        <button
                            key={category}
                            onClick={() => handleFilterClick(category)}
                            disabled={isLoadingData}
                            className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 border 
                                ${filter === category
                                    ? 'border-green-500 bg-green-500/20 text-green-400'
                                    : 'border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-300'
                                } ${isLoadingData ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Projects grid */}
                <AnimatePresence>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate={animateCards ? "visible" : "hidden"}
                    >
                        {/* Show shimmer cards while loading data */}
                        {isLoadingData ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <motion.div key={`shimmer-${index}`} variants={cardVariants}>
                                    <ShimmerCard />
                                </motion.div>
                            ))
                        ) : (
                            /* Show actual project cards */
                            (visibleProjects || [])
                                .filter(project =>
                                    project.display !== false &&
                                    project.status !== false
                                )
                                .map((project) => {
                                    const loadState = imageLoadStates[project.id] || { loading: true, error: false };

                                    return (
                                        <motion.div
                                            key={project.id}
                                            variants={cardVariants}
                                            className="group bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-hidden hover:border-green-500/50 transition-all duration-300 flex flex-col"
                                        >
                                            {/* Project image */}
                                            <div
                                                className="relative overflow-hidden cursor-pointer aspect-video bg-gray-800"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCardClick(project.id);
                                                }}
                                            >
                                                {/* Enhanced shimmer loading effect for images */}
                                                {loadState.loading && (
                                                    <div className="absolute inset-0 w-full h-full bg-gray-800 overflow-hidden z-10">
                                                        <motion.div
                                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"
                                                            variants={shimmerVariants}
                                                            animate="animate"
                                                        />
                                                        {/* Additional shimmer bars for more visible effect */}
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-16 h-16 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Error state with animated code icon */}
                                                {(loadState.error && !loadState.loading) || !project.image || project.image.trim() === '' ? (
                                                    <div className="absolute inset-0 w-full h-full bg-[#1a2432] flex items-center justify-center z-10">
                                                        <motion.div
                                                            variants={codeIconVariants}
                                                            animate="animate"
                                                            className="text-gray-500"
                                                        >
                                                            <Code size={48} />
                                                        </motion.div>
                                                    </div>
                                                ) : null}

                                                {/* Actual image */}
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${loadState.loading ? 'opacity-0' : 'opacity-100'
                                                        }`}
                                                    onLoad={() => handleImageLoad(project.id)}
                                                    onError={() => handleImageError(project.id)}
                                                    loading="lazy"
                                                />

                                                {/* Overlay with action buttons */}
                                                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 flex items-end justify-center
                                                ${isMobile
                                                        ? (activeCard === project.id ? 'opacity-100' : 'opacity-0')
                                                        : 'opacity-0 group-hover:opacity-100'
                                                    }`}>
                                                    <div className={`p-4 w-full flex justify-center gap-4 transition-transform duration-300
                                                    ${isMobile
                                                            ? (activeCard === project.id ? 'translate-y-0' : 'translate-y-10')
                                                            : 'translate-y-10 group-hover:translate-y-0'
                                                        }`}>
                                                        {project.liveUrl && (
                                                            <a
                                                                href={project.liveUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-green-500 hover:bg-green-600 text-black font-medium w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    logProjectClick(`${project.title} - Live View`);
                                                                }}
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
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    logProjectClick(`${project.title} - GitHub View`);
                                                                }}
                                                            >
                                                                <Github size={18} />
                                                            </a>
                                                        )}
                                                        {project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0 && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openGallery(project);
                                                                }}
                                                                className="bg-gray-800 cursor-pointer hover:bg-gray-700 text-white font-medium w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                                                                title="View Gallery"
                                                            >
                                                                <Images size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Project details */}
                                            <div className="p-6 flex-grow flex flex-col">
                                                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                                                    {project.title}
                                                    {project.featured && (
                                                        <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                            Featured
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-gray-300 text-sm mb-4 flex-grow">
                                                    {project.description}
                                                </p>

                                                {/* Technologies used */}
                                                <div className="mt-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.tools.map((tool, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md"
                                                            >
                                                                {tool}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Gallery Modal */}
            <GalleryModal
                isOpen={galleryModal.isOpen}
                onClose={closeGallery}
                images={galleryModal.images}
                projectTitle={galleryModal.projectTitle}
                backendUrl={BACKEND_URL}
            />
        </section>
    );
}

export default Projects;