import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin, Github, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

function SocialMedia() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [userHasInteracted, setUserHasInteracted] = useState(false);
    const [hasPassedHero, setHasPassedHero] = useState(false);

    // Social media links data
    const socialLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            url: 'https://www.facebook.com/sathsarakumbukage',
            color: 'hover:bg-blue-600',
            bgColor: 'bg-blue-600'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            url: 'https://instagram.com/_xadeee_',
            color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600',
            bgColor: 'bg-gradient-to-br from-purple-600 to-pink-600'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: 'https://linkedin.com/in/sadeeshasathsara',
            color: 'hover:bg-blue-700',
            bgColor: 'bg-blue-700'
        },
        {
            name: 'GitHub',
            icon: Github,
            url: 'https://github.com/sadeeshasathsara',
            color: 'hover:bg-gray-800',
            bgColor: 'bg-gray-800'
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            url: 'https://wa.me/94707722924',
            color: 'hover:bg-green-600',
            bgColor: 'bg-green-600'
        }
    ];

    // Handle scroll to show/hide plugin after hero section
    useEffect(() => {
        const handleScroll = () => {
            // Get hero section height (assuming it's 100vh)
            const heroHeight = window.innerHeight;
            const scrollY = window.scrollY;
            const pastHero = scrollY > heroHeight * 0.8;

            setHasPassedHero(pastHero);

            // Only auto-show on first time when passing hero section
            if (pastHero && !userHasInteracted) {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [userHasInteracted]);

    // Handle manual toggle
    const handleToggle = () => {
        setUserHasInteracted(true);
        setIsVisible(!isVisible);
    };

    return (
        <>
            {/* Main Social Media Panel */}
            <div className={`fixed left-0 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-500 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                }`}>
                <div
                    className="flex flex-col items-center bg-gray-900/90 backdrop-blur-sm rounded-r-2xl border-r border-t border-b border-gray-700/50 shadow-2xl"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Header */}
                    <div className="p-3 border-b border-gray-700/50">
                        <div className="w-8 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                    </div>

                    {/* Social Icons */}
                    <div className="py-2">
                        {socialLinks.map((social, index) => {
                            const IconComponent = social.icon;
                            return (
                                <div key={social.name} className="relative group">
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center justify-center w-12 h-12 m-2 rounded-xl bg-gray-800/80 text-gray-300 transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                                        style={{
                                            animationDelay: `${index * 0.1}s`
                                        }}
                                    >
                                        <IconComponent size={20} />
                                    </a>

                                    {/* Tooltip */}
                                    <div className={`absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-xl transition-all duration-300 whitespace-nowrap pointer-events-none ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                                        }`}>
                                        {social.name}
                                        {/* Arrow */}
                                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Toggle Button */}
                    <div className="p-2 border-t border-gray-700/50">
                        <button
                            onClick={handleToggle}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700/80 transition-all duration-300 hover:scale-110"
                            title="Hide social media panel"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toggle Button (when panel is hidden) */}
            <div className={`fixed left-0 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-500 ease-in-out ${!isVisible && hasPassedHero ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                }`}>
                <button
                    onClick={handleToggle}
                    className="flex items-center justify-center w-7 h-12 bg-gray-900/90 backdrop-blur-sm text-gray-400 hover:text-white rounded-r-xl border-r border-t border-b border-gray-700/50 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-800/90 group"
                    title="Show social media links"
                >
                    <ChevronRight size={20} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
            </div>
        </>
    );
}

export default SocialMedia;