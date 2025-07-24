import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Eye, Code, Layout } from 'lucide-react';
import { logProjectClick } from '../../tools/ActivityRecorder';
import ProjectClient from '../../tools/ProjectClient';

function Projects() {
    const [filter, setFilter] = useState('all');
    const [projects, setProjects] = useState([]);
    const [visibleProjects, setVisibleProjects] = useState([]);
    const [animateCards, setAnimateCards] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [imageLoadStates, setImageLoadStates] = useState({});

    // Detect if device is mobile/touch
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Sample project data
    useEffect(() => {
        (async (search = '') => {
            try {
                const response = await ProjectClient.getProjects(search);
                setProjects(response);
                setVisibleProjects(response);

                // Initialize loading states for all projects
                const initialLoadStates = {};
                response.forEach(project => {
                    initialLoadStates[project.id] = { loading: true, error: false };
                });
                setImageLoadStates(initialLoadStates);
            } catch (e) {
                console.error(e)
            }
        })()
    }, []);

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
        setImageLoadStates(prev => ({
            ...prev,
            [projectId]: { loading: false, error: false }
        }));
    };

    // Handle image load error
    const handleImageError = (projectId) => {
        setImageLoadStates(prev => ({
            ...prev,
            [projectId]: { loading: false, error: true }
        }));
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

    // Loading shimmer animation
    const shimmerVariants = {
        animate: {
            backgroundPosition: ['200% 0', '-200% 0'],
            transition: {
                duration: 1.5,
                ease: 'linear',
                repeat: Infinity
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

    return (
        <section id="projects" className="relative py-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black z-0"></div>
            <div className="absolute inset-0 opacity-5 bg-[url('/assets/grid-pattern.svg')] z-0"></div>
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
                            className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 border 
                                ${filter === category
                                    ? 'border-green-500 bg-green-500/20 text-green-400'
                                    : 'border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-300'}`}
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
                        {(visibleProjects || []).map((project) => {
                            const loadState = imageLoadStates[project.id] || { loading: true, error: false };

                            return (
                                <motion.div
                                    key={project.id}
                                    variants={cardVariants}
                                    className="group bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-hidden hover:border-green-500/50 transition-all duration-300 flex flex-col"
                                >
                                    {/* Project image */}
                                    <div
                                        className="relative overflow-hidden cursor-pointer aspect-video"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCardClick(project.id);
                                        }}
                                    >
                                        {/* Loading shimmer effect */}
                                        {loadState.loading && (
                                            <motion.div
                                                className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
                                                style={{
                                                    backgroundSize: '200% 100%'
                                                }}
                                                variants={shimmerVariants}
                                                animate="animate"
                                            />
                                        )}

                                        {/* Error state with animated code icon */}
                                        {loadState.error && (
                                            <div className="w-full h-full bg-gray-800/50 flex items-center justify-center">
                                                <motion.div
                                                    variants={codeIconVariants}
                                                    animate="animate"
                                                    className="text-gray-500"
                                                >
                                                    <Code size={48} />
                                                </motion.div>
                                            </div>
                                        )}

                                        {/* Actual image */}
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${loadState.loading || loadState.error ? 'opacity-0 absolute' : 'opacity-100'
                                                }`}
                                            onLoad={() => handleImageLoad(project.id)}
                                            onError={() => handleImageError(project.id)}
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
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* Show more button */}
                <div className="mt-16 text-center">
                    <a
                        href="#"
                        className="inline-flex items-center px-6 py-3 border-2 border-green-500/30 hover:border-green-500 text-green-400 hover:bg-green-500/10 rounded-lg font-medium transition-all duration-300"
                    >
                        <Layout size={18} className="mr-2" />
                        View All Projects
                    </a>
                </div>
            </div>
        </section>
    );
}

export default Projects;