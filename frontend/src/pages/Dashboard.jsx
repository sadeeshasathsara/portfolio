import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    FileText,
    ShoppingCart,
    MessageSquare,
    Bell,
    Search,
    Menu,
    X,
    ChevronDown,
    User,
    ActivityIcon,
    Power
} from 'lucide-react';
import Profile from '../components/dashboardPage/Profile';
import Projects from '../components/dashboardPage/Projects';
import ProjectModal from '../components/dashboardPage/ProjectModal';
import DashTab from '../components/dashboardPage/DashTab';
import ActivitiesTab from '../components/dashboardPage/Activities';
import Messages from '../components/dashboardPage/Messages';
import SettingsTab from '../components/dashboardPage/Settings';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../tools/Tools';
import { delay } from 'framer-motion';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isContentLoading, setIsContentLoading] = useState(false);

    // Project Modal State
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projects, setProjects] = useState([
        {
            id: 1,
            title: "Portfolio Website",
            description: "A modern portfolio website built with React and Tailwind CSS showcasing my projects and skills.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
            tags: ["React", "Tailwind", "Portfolio"],
            tools: ["VS Code", "Figma", "Vercel"],
            liveUrl: "https://portfolio.example.com",
            githubUrl: "https://github.com/user/portfolio",
            featured: true
        },
        {
            id: 2,
            title: "E-commerce App",
            description: "Full-stack e-commerce application with user authentication, payment integration, and admin dashboard.",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
            tags: ["Next.js", "Node.js", "MongoDB"],
            tools: ["VS Code", "Postman", "MongoDB Compass"],
            liveUrl: "https://shop.example.com",
            githubUrl: "https://github.com/user/ecommerce",
            featured: false
        }
    ]);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'Profile', icon: Users },
        { id: 'projects', label: 'Projects', icon: FileText },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'activities', label: 'Activities', icon: ActivityIcon },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

    // Project Modal Functions
    const openProjectModal = (project = null) => {
        setEditingProject(project);
        setShowProjectModal(true);
    };

    const closeProjectModal = () => {
        setShowProjectModal(false);
        setEditingProject(null);
    };

    // Simulate content loading when tab changes
    useEffect(() => {
        setIsContentLoading(true);
        const timer = setTimeout(() => {
            setIsContentLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [activeTab]);

    const currentTab = tabs.find(tab => tab.id === activeTab);

    const navigate = useNavigate();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        const toastId = toast.loading("Logging out...");
        setIsLoggingOut(true);

        try {
            const res = await axios.post(`${BACKEND_URL}/api/logout`, {}, {
                withCredentials: true,
            });

            if (res.status === 200) {
                toast.success("Logout successful", { id: toastId });
                navigate('/login', { replace: true });
            } else {
                toast.error("Logout failed", { id: toastId });
                setIsLoggingOut(false);
            }
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error(error.message || "Logout failed", { id: toastId });
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="flex overflow-hidden">
            <ToastContainer />
            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(55, 65, 81, 0.3);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #34d399, #3b82f6);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #10b981, #2563eb);
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #34d399 rgba(55, 65, 81, 0.3);
                }
            `}</style>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`h-screen
        fixed top-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        `}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700/50 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={`cursor-pointer
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                                        ? 'bg-gradient-to-r from-green-400/20 to-blue-500/20 text-white border border-green-400/30'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }
                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-green-400' : ''}`} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 select-none border-t border-gray-700/50 flex-shrink-0">
                    <div className="flex items-center space-x-3 text-gray-400">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin User</p>
                            <p className="text-xs text-gray-400 truncate">admin@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full lg:ml-[257px] overflow-x-auto">
                {/* Top Header */}
                <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 flex-shrink-0 z-30">
                    <div className="flex items-center justify-between px-4 lg:px-6 py-4">
                        {/* Left side */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden text-gray-400 hover:text-white transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Search Bar */}
                            <div className="hidden sm:flex items-center bg-gray-800/50 rounded-lg px-3 py-2 w-64 lg:w-80">
                                <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent text-white placeholder-gray-400 outline-none flex-1 text-sm"
                                />
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-3">
                            {/* Mobile Search */}
                            <button className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors">
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={toggleProfile}
                                    className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <ChevronDown className="w-4 h-4 hidden sm:block" />
                                </button>

                                {/* Profile Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                            Profile Settings
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                            Account
                                        </a>
                                        <hr className="my-2 border-gray-700" />
                                        <div className='flex justify-center items-center'>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center justify-evenly w-4/5 rounded-md  bg-red-600  px-4 py-2 text-sm text-white hover:bg-red-700 cursor-pointer hover:text-white transition-colors"
                                                disabled={isLoggingOut}
                                            >
                                                <Power width={16} height={16} /> {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-2 lg:p-4 overflow-hidden lg:w-full">
                    {/* Content Area */}
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 flex flex-col">
                        {/* Page Title - Inside Content Area */}
                        <div className="p-3 border-b border-gray-700/30 flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                {currentTab && React.createElement(currentTab.icon, {
                                    className: "w-8 h-8 lg:w-10 lg:h-10 text-green-400"
                                })}
                                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                                    {currentTab?.label}
                                </h2>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="">
                            {isContentLoading ? (
                                /* Loading State */
                                <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                                    <div className="relative mb-8">
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full flex items-center justify-center border border-green-400/30 animate-pulse">
                                            {currentTab && React.createElement(currentTab.icon, {
                                                className: "w-8 h-8 lg:w-10 lg:h-10 text-green-400"
                                            })}
                                        </div>
                                    </div>

                                    <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4">
                                        Loading {currentTab?.label}...
                                    </h3>
                                    <p className="text-gray-400 max-w-md text-sm lg:text-base mb-8">
                                        Please wait while we prepare your {currentTab?.label.toLowerCase()} content.
                                    </p>

                                    {/* Loading Decorative Elements */}
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="lg:p-8 ">
                                    {activeTab === 'dashboard' ? (
                                        <div id='dashboard'><DashTab /></div>
                                    ) : activeTab === 'profile' ? (
                                        <div id='profile'><Profile /></div>
                                    ) : activeTab === 'projects' ? (
                                        <div id='projects' className="text-gray-400 text-sm lg:text-base">
                                            <Projects
                                                projects={projects}
                                                setProjects={setProjects}
                                                onOpenModal={openProjectModal}
                                            />
                                        </div>
                                    ) : activeTab === 'analytics' ? (
                                        <div id='analytics' className="text-gray-400 text-sm lg:text-base">
                                            <p>View your analytics data here.</p>
                                        </div>
                                    ) : activeTab === 'messages' ? (
                                        <div id='messages' className="text-gray-400 text-sm lg:text-base">
                                            <Messages />
                                        </div>
                                    ) : activeTab === 'activities' ? (
                                        <div id='activities' className="text-gray-400 text-sm lg:text-base">
                                            <ActivitiesTab />
                                        </div>
                                    ) : activeTab === 'settings' ? (
                                        <div id='settings' className="text-gray-400 text-sm lg:text-base">
                                            <SettingsTab />
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 text-sm lg:text-base">
                                            <p>Select a tab to view content.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Project Modal */}
            <ProjectModal
                showModal={showProjectModal}
                setShowModal={setShowProjectModal}
                editingProject={editingProject}
                setEditingProject={setEditingProject}
                projects={projects}
                setProjects={setProjects}
                onClose={closeProjectModal}
            />

            {/* Background decorative elements */}
            <div className="fixed top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500/5 blur-3xl pointer-events-none -z-10"></div>
            <div className="fixed bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none -z-10"></div>
        </div>
    );
}

export default AdminDashboard;