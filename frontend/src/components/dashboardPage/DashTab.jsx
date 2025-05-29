import React from 'react';
import {
    Users,
    FileText,
    MousePointer,
    Download,
    Mail,
    Plus,
    Settings,
    Eye,
    Calendar,
    Globe,
    UserCheck,
    Activity,
    ExternalLink,
    Clock
} from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../tools/Tools';

function DashTab() {
    // Mock data - replace with real data
    const [stats, setStats] = useState({
        portfolioVisitors: 0,
        projectClicks: 0,
        cvDownloads: 0,
        totalProjects: 0
    });

    useState(() => {
        try {
            const res = axios.get(`${BACKEND_URL}/api/counts`)
            console.log(res.data);

        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }, []);

    const recentProjects = [
        {
            id: 1,
            title: "E-commerce Platform",
            clicks: 156,
            lastViewed: "2 hours ago",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=100&fit=crop",
            status: "Live"
        },
        {
            id: 2,
            title: "Portfolio Website",
            clicks: 289,
            lastViewed: "1 day ago",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=100&fit=crop",
            status: "Live"
        },
        {
            id: 3,
            title: "Task Manager App",
            clicks: 34,
            lastViewed: "3 days ago",
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=100&fit=crop",
            status: "Development"
        }
    ];

    const newMails = [
        {
            id: 1,
            sender: "john.doe@company.com",
            subject: "Job Opportunity - Frontend Developer",
            time: "2 hours ago",
            isNew: true
        },
        {
            id: 2,
            sender: "sarah.wilson@startup.io",
            subject: "Collaboration Proposal",
            time: "1 day ago",
            isNew: true
        },
        {
            id: 3,
            sender: "mike.chen@agency.com",
            subject: "Project Inquiry",
            time: "2 days ago",
            isNew: false
        }
    ];

    const recentActivities = [
        {
            id: 1,
            type: "visitor",
            action: "User visits the portfolio",
            ip: "192.168.1.45",
            time: "5 minutes ago",
            icon: Globe
        },
        {
            id: 2,
            type: "download",
            action: "Downloaded the CV",
            ip: "10.0.0.23",
            time: "15 minutes ago",
            icon: Download
        },
        {
            id: 3,
            type: "project_click",
            action: "Clicked on E-commerce Platform",
            ip: "192.168.1.78",
            time: "32 minutes ago",
            icon: MousePointer
        },
        {
            id: 4,
            type: "email",
            action: "Sent an email from contact form",
            ip: "172.16.0.5",
            time: "1 hour ago",
            icon: Mail
        },
        {
            id: 5,
            type: "admin",
            action: "Admin logged in: admin@portfolio.com",
            ip: "192.168.1.100",
            time: "2 hours ago",
            icon: UserCheck
        }
    ];

    const getActivityColor = (type) => {
        switch (type) {
            case 'visitor': return 'text-blue-400 bg-blue-400/20';
            case 'download': return 'text-green-400 bg-green-400/20';
            case 'project_click': return 'text-purple-400 bg-purple-400/20';
            case 'email': return 'text-orange-400 bg-orange-400/20';
            case 'admin': return 'text-red-400 bg-red-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

    return (
        <div className="space-y-6 p-1 m-3">
            {/* Welcome Section */}
            <div className="text-center mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Portfolio Dashboard 📊
                </h1>
                <p className="text-gray-400 text-sm lg:text-base">
                    Monitor your portfolio performance and activities
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {/* Portfolio Visitors */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-400/20 rounded-lg group-hover:bg-blue-400/30 transition-colors">
                            <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
                        </div>
                        <Eye className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{stats.portfolioVisitors.toLocaleString()}</h3>
                    <p className="text-gray-400 text-xs lg:text-sm">Portfolio Visitors</p>
                    <p className="text-blue-400 text-xs mt-1">+124 this week</p>
                </div>

                {/* Total Projects */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-700/50 hover:border-green-400/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-400/20 rounded-lg group-hover:bg-green-400/30 transition-colors">
                            <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
                        </div>
                        <Plus className="w-4 h-4 text-green-400" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{stats.totalProjects}</h3>
                    <p className="text-gray-400 text-xs lg:text-sm">Total Projects</p>
                    <p className="text-green-400 text-xs mt-1">+2 this month</p>
                </div>

                {/* Project Click Count */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-700/50 hover:border-purple-400/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-400/20 rounded-lg group-hover:bg-purple-400/30 transition-colors">
                            <MousePointer className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
                        </div>
                        <ExternalLink className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{stats.projectClicks}</h3>
                    <p className="text-gray-400 text-xs lg:text-sm">Project Clicks</p>
                    <p className="text-purple-400 text-xs mt-1">+43 today</p>
                </div>

                {/* CV Downloads */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-700/50 hover:border-orange-400/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-orange-400/20 rounded-lg group-hover:bg-orange-400/30 transition-colors">
                            <Download className="w-5 h-5 lg:w-6 lg:h-6 text-orange-400" />
                        </div>
                        <FileText className="w-4 h-4 text-orange-400" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{stats.cvDownloads}</h3>
                    <p className="text-gray-400 text-xs lg:text-sm">CV Downloads</p>
                    <p className="text-orange-400 text-xs mt-1">+8 this week</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl lg:text-2xl font-semibold text-white flex items-center">
                            <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-green-400 mr-2" />
                            Recent Projects
                        </h2>
                        <button className="text-green-400 hover:text-green-300 text-sm lg:text-base transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentProjects.map((project) => (
                            <div key={project.id} className="flex items-center space-x-4 p-3 lg:p-4 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-white font-medium text-sm lg:text-base truncate">{project.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs ${project.status === 'Live'
                                            ? 'bg-green-400/20 text-green-400'
                                            : 'bg-yellow-400/20 text-yellow-400'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs lg:text-sm text-gray-400">
                                        <div className="flex items-center space-x-2">
                                            <MousePointer className="w-3 h-3" />
                                            <span>{project.clicks} clicks</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-3 h-3" />
                                            <span>{project.lastViewed}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* New Mails */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl lg:text-2xl font-semibold text-white flex items-center">
                            <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400 mr-2" />
                            New Mails
                            <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                                {newMails.filter(mail => mail.isNew).length}
                            </span>
                        </h2>
                        <button className="text-blue-400 hover:text-blue-300 text-sm lg:text-base transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="space-y-3">
                        {newMails.map((mail) => (
                            <div key={mail.id} className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
                                <div className="flex-shrink-0">
                                    <div className={`p-2 rounded-lg ${mail.isNew ? 'bg-blue-400/20' : 'bg-gray-700/50'}`}>
                                        <Mail className={`w-4 h-4 ${mail.isNew ? 'text-blue-400' : 'text-gray-400'}`} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-white text-sm lg:text-base font-medium truncate">{mail.sender}</p>
                                        {mail.isNew && (
                                            <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></span>
                                        )}
                                    </div>
                                    <p className="text-gray-300 text-xs lg:text-sm truncate mb-1">{mail.subject}</p>
                                    <p className="text-gray-400 text-xs">{mail.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-700/50">
                    <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6 flex items-center">
                        <Settings className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400 mr-2" />
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                        <button className="flex flex-col items-center p-3 lg:p-4 bg-green-400/10 hover:bg-green-400/20 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-200 group">
                            <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-white text-xs lg:text-sm font-medium">Add Project</span>
                        </button>

                        <button className="flex flex-col items-center p-3 lg:p-4 bg-blue-400/10 hover:bg-blue-400/20 rounded-lg border border-blue-400/20 hover:border-blue-400/40 transition-all duration-200 group">
                            <Mail className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-white text-xs lg:text-sm font-medium">Check Mails</span>
                        </button>

                        <button className="flex flex-col items-center p-3 lg:p-4 bg-orange-400/10 hover:bg-orange-400/20 rounded-lg border border-orange-400/20 hover:border-orange-400/40 transition-all duration-200 group">
                            <Activity className="w-6 h-6 lg:w-8 lg:h-8 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-white text-xs lg:text-sm font-medium">View Analytics</span>
                        </button>

                        <button className="flex flex-col items-center p-3 lg:p-4 bg-purple-400/10 hover:bg-purple-400/20 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-200 group">
                            <Settings className="w-6 h-6 lg:w-8 lg:h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-white text-xs lg:text-sm font-medium">Settings</span>
                        </button>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl lg:text-2xl font-semibold text-white flex items-center">
                            <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-orange-400 mr-2" />
                            Activities
                        </h2>
                        <button className="text-orange-400 hover:text-orange-300 text-sm lg:text-base transition-colors">
                            See More
                        </button>
                    </div>

                    <div className="space-y-3">
                        {recentActivities.map((activity) => {
                            const Icon = activity.icon;
                            const colorClass = getActivityColor(activity.type);

                            return (
                                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-900/30 rounded-lg">
                                    <div className={`p-2 rounded-lg ${colorClass}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm lg:text-base mb-1">{activity.action}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>IP: {activity.ip}</span>
                                            <span>{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashTab;