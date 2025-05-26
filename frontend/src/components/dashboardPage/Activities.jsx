import React, { useState } from 'react';
import {
    Activity,
    Globe,
    Download,
    MousePointer,
    Mail,
    UserCheck,
    Plus,
    Edit,
    Trash2,
    LogIn,
    Filter,
    MapPin,
    Clock,
    User,
    Shield,
    ChevronDown,
    ChevronUp,
    Search,
    Calendar,
    Eye
} from 'lucide-react';

function ActivitiesTab() {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedTimeRange, setSelectedTimeRange] = useState('today');
    const [expandedSessions, setExpandedSessions] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data - replace with real data
    const activitiesData = {
        '192.168.1.45': {
            userType: 'user',
            location: 'New York, US',
            browser: 'Chrome 120.0',
            device: 'Desktop',
            firstSeen: '2024-05-25 09:15:00',
            lastSeen: '2024-05-25 10:45:00',
            totalActions: 8,
            activities: [
                {
                    id: 1,
                    action: 'Visited portfolio',
                    timestamp: '2024-05-25 10:45:00',
                    type: 'visit',
                    details: 'Landing page view'
                },
                {
                    id: 2,
                    action: 'Downloaded CV',
                    timestamp: '2024-05-25 10:42:00',
                    type: 'download',
                    details: 'CV_John_Doe.pdf'
                },
                {
                    id: 3,
                    action: 'Clicked on E-commerce Platform',
                    timestamp: '2024-05-25 10:38:00',
                    type: 'project_click',
                    details: 'Project view - E-commerce Platform'
                },
                {
                    id: 4,
                    action: 'Sent email via contact form',
                    timestamp: '2024-05-25 10:35:00',
                    type: 'email',
                    details: 'Mail: user@email.com'
                }
            ]
        },
        '10.0.0.23': {
            userType: 'user',
            location: 'London, UK',
            browser: 'Firefox 119.0',
            device: 'Mobile',
            firstSeen: '2024-05-25 08:30:00',
            lastSeen: '2024-05-25 08:45:00',
            totalActions: 3,
            activities: [
                {
                    id: 6,
                    action: 'Visited portfolio',
                    timestamp: '2024-05-25 08:45:00',
                    type: 'visit',
                    details: 'Mobile view'
                },
                {
                    id: 7,
                    action: 'Clicked on Portfolio Website',
                    timestamp: '2024-05-25 08:42:00',
                    type: 'project_click',
                    details: 'Project view - Portfolio Website'
                },
                {
                    id: 8,
                    action: 'Downloaded CV',
                    timestamp: '2024-05-25 08:35:00',
                    type: 'download',
                    details: 'CV_John_Doe.pdf'
                }
            ]
        },
        '192.168.1.100': {
            userType: 'admin',
            location: 'San Francisco, US',
            browser: 'Chrome 120.0',
            device: 'Desktop',
            email: 'admin@portfolio.com',
            firstSeen: '2024-05-25 07:00:00',
            lastSeen: '2024-05-25 11:30:00',
            totalActions: 12,
            activities: [
                {
                    id: 9,
                    action: 'Updated project: Task Manager App',
                    timestamp: '2024-05-25 11:30:00',
                    type: 'update',
                    details: 'Modified description and added new screenshots'
                },
                {
                    id: 10,
                    action: 'Added new project: Weather App',
                    timestamp: '2024-05-25 10:15:00',
                    type: 'create',
                    details: 'Created new project with React and OpenWeather API'
                },
                {
                    id: 11,
                    action: 'Logged in',
                    timestamp: '2024-05-25 09:45:00',
                    type: 'login',
                    details: 'Admin dashboard access'
                },
                {
                    id: 12,
                    action: 'Deleted project: Old Portfolio',
                    timestamp: '2024-05-25 09:30:00',
                    type: 'delete',
                    details: 'Removed outdated project'
                }
            ]
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'visit': return Globe;
            case 'download': return Download;
            case 'project_click': return MousePointer;
            case 'email': return Mail;
            case 'login': return LogIn;
            case 'create': return Plus;
            case 'update': return Edit;
            case 'delete': return Trash2;
            default: return Activity;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'visit': return 'text-blue-400 bg-blue-400/20';
            case 'download': return 'text-green-400 bg-green-400/20';
            case 'project_click': return 'text-purple-400 bg-purple-400/20';
            case 'email': return 'text-orange-400 bg-orange-400/20';
            case 'login': return 'text-cyan-400 bg-cyan-400/20';
            case 'create': return 'text-emerald-400 bg-emerald-400/20';
            case 'update': return 'text-yellow-400 bg-yellow-400/20';
            case 'delete': return 'text-red-400 bg-red-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

    const toggleSession = (ip) => {
        setExpandedSessions(prev => ({
            ...prev,
            [ip]: !prev[ip]
        }));
    };

    const filteredData = Object.entries(activitiesData).filter(([ip, data]) => {
        if (selectedFilter !== 'all' && data.userType !== selectedFilter) return false;
        if (searchTerm && !ip.includes(searchTerm) && !data.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6 p-1 m-3">

            {/* Filters and Search */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-700/50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                    {/* Search */}
                    <div className="flex-1 lg:max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by IP or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex space-x-3">
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400/50 transition-colors"
                        >
                            <option value="all">All Users</option>
                            <option value="user">Normal Users</option>
                            <option value="admin">Admins</option>
                        </select>

                        <select
                            value={selectedTimeRange}
                            onChange={(e) => setSelectedTimeRange(e.target.value)}
                            className="bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400/50 transition-colors"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
                {filteredData.map(([ip, sessionData]) => (
                    <div key={ip} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
                        {/* Session Header */}
                        <div
                            className="p-4 lg:p-6 cursor-pointer hover:bg-gray-700/20 transition-colors"
                            onClick={() => toggleSession(ip)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {/* User Type Icon */}
                                    <div className={`p-3 rounded-lg ${sessionData.userType === 'admin'
                                        ? 'bg-red-400/20 text-red-400'
                                        : 'bg-blue-400/20 text-blue-400'
                                        }`}>
                                        {sessionData.userType === 'admin' ? (
                                            <Shield className="w-5 h-5 lg:w-6 lg:h-6" />
                                        ) : (
                                            <User className="w-5 h-5 lg:w-6 lg:h-6" />
                                        )}
                                    </div>

                                    {/* Session Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
                                            {/* IP and User Type */}
                                            <div className="mb-2 lg:mb-0">
                                                <h3 className="text-white font-semibold text-lg flex items-center">
                                                    {ip}
                                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${sessionData.userType === 'admin'
                                                        ? 'bg-red-400/20 text-red-400'
                                                        : 'bg-blue-400/20 text-blue-400'
                                                        }`}>
                                                        {sessionData.userType.toUpperCase()}
                                                    </span>
                                                </h3>
                                                {sessionData.email && (
                                                    <p className="text-gray-300 text-sm">{sessionData.email}</p>
                                                )}
                                            </div>

                                            {/* Location and Device Info */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {sessionData.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    {sessionData.device} • {sessionData.browser}
                                                </div>
                                                <div className="flex items-center">
                                                    <Activity className="w-4 h-4 mr-1" />
                                                    {sessionData.totalActions} actions
                                                </div>
                                            </div>
                                        </div>

                                        {/* Session Duration */}
                                        <div className="mt-2 flex items-center text-xs text-gray-500">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {formatTime(sessionData.firstSeen)} - {formatTime(sessionData.lastSeen)} • {formatDate(sessionData.lastSeen)}
                                        </div>
                                    </div>
                                </div>

                                {/* Expand Button */}
                                <div className="ml-4">
                                    {expandedSessions[ip] ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Activities Details */}
                        {expandedSessions[ip] && (
                            <div className="border-t border-gray-700/50 bg-gray-900/30">
                                <div className="p-4 lg:p-6">
                                    <h4 className="text-white font-medium mb-4 flex items-center">
                                        <Activity className="w-4 h-4 mr-2 text-orange-400" />
                                        Activity Timeline
                                    </h4>

                                    <div className="space-y-3">
                                        {sessionData.activities.map((activity) => {
                                            const Icon = getActivityIcon(activity.type);
                                            const colorClass = getActivityColor(activity.type);

                                            return (
                                                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
                                                    <div className={`p-2 rounded-lg flex-shrink-0 ${colorClass}`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                            <div className="mb-1 lg:mb-0">
                                                                <p className="text-white text-sm lg:text-base font-medium">
                                                                    {activity.action}
                                                                </p>
                                                                <p className="text-gray-400 text-xs lg:text-sm">
                                                                    {activity.details}
                                                                </p>
                                                            </div>
                                                            <div className="text-xs text-gray-500 lg:text-right">
                                                                <div>{formatTime(activity.timestamp)}</div>
                                                                <div>{formatDate(activity.timestamp)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {filteredData.length > 0 && (
                <div className="text-center">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                        Load More Sessions
                    </button>
                </div>
            )}

            {/* Empty State */}
            {filteredData.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Activities Found</h3>
                    <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
}

export default ActivitiesTab;