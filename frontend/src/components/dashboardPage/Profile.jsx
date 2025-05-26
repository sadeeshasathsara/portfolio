import React, { useState } from 'react';
import {
    User,
    Phone,
    MapPin,
    Globe2,
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Github,
    MessageCircle,
    Camera,
    Save,
    Plus,
    Trash2,
    Calendar,
    Mail,
    Briefcase,
    Star,
    Award,
    Users,
    Code,
    Clock
} from 'lucide-react';

function Profile() {
    const [profileData, setProfileData] = useState({
        // Basic Section
        fullName: '',
        displayName: '',
        nameWithInitials: '',
        profilePicture: '',
        birthday: '',
        bio: '',

        // Contact Info
        phone: '',
        address: {
            houseNo: '',
            street: '',
            city: '',
            district: '',
            province: '',
            country: ''
        },

        // Social Media
        socialMedia: {
            facebook: '',
            instagram: '',
            linkedin: '',
            twitter: '',
            dribbble: '',
            github: '',
            whatsapp: ''
        },

        // About Section
        intro: '',
        myJourney: '',
        numberOfProjects: '',
        numberOfTechnologies: '',
        yearsExperience: '',
        clientSatisfactionRate: '',

        // Expertise Section (max 3)
        expertise: [
            { title: '', description: '' }
        ],

        // Projects Section
        projectsIntro: '',

        // Contact Section
        contactIntro: ''
    });

    const [activeSection, setActiveSection] = useState('basic');
    const [isSaving, setIsSaving] = useState(false);

    const sections = [
        { id: 'basic', label: 'Basic', icon: User },
        { id: 'contact', label: 'Contact', icon: Phone },
        { id: 'social', label: 'Social', icon: Globe2 },
        { id: 'about', label: 'About', icon: Briefcase },
        { id: 'expertise', label: 'Skills', icon: Award },
        { id: 'projects', label: 'Projects', icon: Code },
        { id: 'contact-section', label: 'Reach', icon: MessageCircle }
    ];

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setProfileData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleExpertiseChange = (index, field, value) => {
        const updatedExpertise = [...profileData.expertise];
        updatedExpertise[index] = {
            ...updatedExpertise[index],
            [field]: value
        };
        setProfileData(prev => ({
            ...prev,
            expertise: updatedExpertise
        }));
    };

    const addExpertise = () => {
        if (profileData.expertise.length < 3) {
            setProfileData(prev => ({
                ...prev,
                expertise: [...prev.expertise, { title: '', description: '' }]
            }));
        }
    };

    const removeExpertise = (index) => {
        if (profileData.expertise.length > 1) {
            setProfileData(prev => ({
                ...prev,
                expertise: prev.expertise.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSaving(false);
        alert('Profile saved successfully!');
    };

    const renderBasicSection = () => (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <div className="relative inline-block">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-4xl font-bold mb-4">
                        {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : <User className="w-8 h-8 sm:w-12 sm:h-12" />}
                    </div>
                    <button className="absolute bottom-2 right-2 bg-gray-800 rounded-full p-2 text-green-400 hover:bg-gray-700 transition-colors">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="Enter your full name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                    <input
                        type="text"
                        value={profileData.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="Enter display name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name with Initials</label>
                    <input
                        type="text"
                        value={profileData.nameWithInitials}
                        onChange={(e) => handleInputChange('nameWithInitials', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="e.g., John D. Smith"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Birthday</label>
                    <input
                        type="date"
                        value={profileData.birthday}
                        onChange={(e) => handleInputChange('birthday', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400 transition-colors"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio <span className="text-gray-500">({profileData.bio.length}/86)</span>
                </label>
                <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value.slice(0, 86))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors resize-none"
                    rows="3"
                    placeholder="Write a short bio about yourself..."
                />
            </div>
        </div>
    );

    const renderContactSection = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                    placeholder="+1 (555) 123-4567"
                />
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-400" />
                    Address
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">House No/Name</label>
                        <input
                            type="text"
                            value={profileData.address.houseNo}
                            onChange={(e) => handleInputChange('address.houseNo', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                            placeholder="123 or House Name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Street Name</label>
                        <input
                            type="text"
                            value={profileData.address.street}
                            onChange={(e) => handleInputChange('address.street', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                            placeholder="Main Street"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                        <input
                            type="text"
                            value={profileData.address.city}
                            onChange={(e) => handleInputChange('address.city', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                            placeholder="New York"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">District</label>
                        <input
                            type="text"
                            value={profileData.address.district}
                            onChange={(e) => handleInputChange('address.district', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                            placeholder="Manhattan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Province</label>
                        <input
                            type="text"
                            value={profileData.address.province}
                            onChange={(e) => handleInputChange('address.province', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                            placeholder="New York State"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                        <input
                            type="text"
                            value={profileData.address.country}
                            onChange={(e) => handleInputChange('address.country', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                            placeholder="United States"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSocialSection = () => {
        const socialPlatforms = [
            { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500' },
            { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
            { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
            { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
            { key: 'dribbble', label: 'Dribbble', icon: Globe2, color: 'text-pink-400' },
            { key: 'github', label: 'GitHub', icon: Github, color: 'text-gray-400' },
            { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-500' }
        ];

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {socialPlatforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                            <div key={platform.key}>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                    <Icon className={`w-4 h-4 mr-2 ${platform.color}`} />
                                    {platform.label}
                                </label>
                                <input
                                    type="url"
                                    value={profileData.socialMedia[platform.key]}
                                    onChange={(e) => handleInputChange(`socialMedia.${platform.key}`, e.target.value)}
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                                    placeholder={`Your ${platform.label} URL`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderAboutSection = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Intro <span className="text-gray-500">({profileData.intro.length}/100)</span>
                </label>
                <textarea
                    value={profileData.intro}
                    onChange={(e) => handleInputChange('intro', e.target.value.slice(0, 100))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors resize-none"
                    rows="3"
                    placeholder="Brief introduction about yourself..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    My Journey <span className="text-gray-500">({profileData.myJourney.length}/525)</span>
                </label>
                <textarea
                    value={profileData.myJourney}
                    onChange={(e) => handleInputChange('myJourney', e.target.value.slice(0, 525))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors resize-none"
                    rows="6"
                    placeholder="Tell your professional journey..."
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Code className="w-4 h-4 mr-2 text-green-400" />
                        <span className="hidden sm:inline">Projects</span>
                        <span className="sm:hidden">Proj</span>
                    </label>
                    <input
                        type="number"
                        value={profileData.numberOfProjects}
                        onChange={(e) => handleInputChange('numberOfProjects', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Star className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="hidden sm:inline">Technologies</span>
                        <span className="sm:hidden">Tech</span>
                    </label>
                    <input
                        type="number"
                        value={profileData.numberOfTechnologies}
                        onChange={(e) => handleInputChange('numberOfTechnologies', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="25"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-purple-400" />
                        <span className="hidden sm:inline">Experience</span>
                        <span className="sm:hidden">Exp</span>
                    </label>
                    <input
                        type="number"
                        value={profileData.yearsExperience}
                        onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="5"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Users className="w-4 h-4 mr-2 text-pink-400" />
                        <span className="hidden sm:inline">Satisfaction %</span>
                        <span className="sm:hidden">Sat %</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={profileData.clientSatisfactionRate}
                        onChange={(e) => handleInputChange('clientSatisfactionRate', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="95"
                    />
                </div>
            </div>
        </div>
    );

    const renderExpertiseSection = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white">Expertise Areas</h4>
                {profileData.expertise.length < 3 && (
                    <button
                        onClick={addExpertise}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Expertise</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                )}
            </div>

            {profileData.expertise.map((expertise, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                        <h5 className="text-md font-medium text-white">Expertise {index + 1}</h5>
                        {profileData.expertise.length > 1 && (
                            <button
                                onClick={() => removeExpertise(index)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Title <span className="text-gray-500">({expertise.title.length}/28)</span>
                            </label>
                            <input
                                type="text"
                                value={expertise.title}
                                onChange={(e) => handleExpertiseChange(index, 'title', e.target.value.slice(0, 28))}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                                placeholder="Web Development"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description <span className="text-gray-500">({expertise.description.length}/148)</span>
                            </label>
                            <textarea
                                value={expertise.description}
                                onChange={(e) => handleExpertiseChange(index, 'description', e.target.value.slice(0, 148))}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors resize-none"
                                rows="3"
                                placeholder="Describe your expertise in this area..."
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderProjectsSection = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Projects Section Intro <span className="text-gray-500">({profileData.projectsIntro.length}/100)</span>
                </label>
                <textarea
                    value={profileData.projectsIntro}
                    onChange={(e) => handleInputChange('projectsIntro', e.target.value.slice(0, 100))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors resize-none"
                    rows="3"
                    placeholder="Brief introduction for your projects section..."
                />
            </div>
        </div>
    );

    const renderContactSectionInfo = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Section Intro <span className="text-gray-500">({profileData.contactIntro.length}/100)</span>
                </label>
                <textarea
                    value={profileData.contactIntro}
                    onChange={(e) => handleInputChange('contactIntro', e.target.value.slice(0, 100))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors resize-none"
                    rows="3"
                    placeholder="Brief introduction for your contact section..."
                />
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'basic':
                return renderBasicSection();
            case 'contact':
                return renderContactSection();
            case 'social':
                return renderSocialSection();
            case 'about':
                return renderAboutSection();
            case 'expertise':
                return renderExpertiseSection();
            case 'projects':
                return renderProjectsSection();
            case 'contact-section':
                return renderContactSectionInfo();
            default:
                return renderBasicSection();
        }
    };

    return (
        <div className="min-h-screen text-white p-4">
            {/* Horizontal Navigation */}
            <div className="mb-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-3">
                    <div className="flex overflow-x-auto space-x-2 pb-2">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap text-sm ${isActive
                                        ? 'bg-gradient-to-r from-green-400/20 to-blue-500/20 text-white border border-green-400/30'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-green-400' : ''}`} />
                                    <span className="font-medium">{section.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
                {/* Section Header */}
                <div className="flex items-center space-x-3 mb-4">
                    {sections.find(s => s.id === activeSection) &&
                        React.createElement(sections.find(s => s.id === activeSection).icon, {
                            className: "w-6 h-6 text-green-400"
                        })
                    }
                    <h2 className="text-xl font-bold text-white">
                        {sections.find(s => s.id === activeSection)?.label}
                    </h2>
                </div>

                {/* Section Content */}
                {renderContent()}

                {/* Save Button */}
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
                    >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;