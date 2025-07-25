import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Loader2, Code, User, Mail, Briefcase } from 'lucide-react';
import { createVisit } from '../tools/ActivityRecorder';

// Lazy load components
const Navbar = lazy(() => import('../components/homePage/Navbar'));
const HeroLeft = lazy(() => import('../components/homePage/HeroLeft'));
const HeroRight = lazy(() => import('../components/homePage/HeroRight'));

const Projects = lazy(() => import('../components/homePage/Projects'));
const Contact = lazy(() => import('../components/homePage/Contact'));
const SocialMedia = lazy(() => import('../components/homePage/SocialMedia'));

// Loading component for individual sections
function SectionLoader({ icon: Icon, title, description }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] py-16">
            <div className="relative">
                <div className="absolute inset-0 animate-ping">
                    <Icon className="w-12 h-12 text-green-400/50" />
                </div>
                <Icon className="w-12 h-12 text-green-400 relative z-10" />
            </div>
            <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
            <div className="mt-4 flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    );
}

// Main loading screen
function MainLoader() {
    const [loadingText, setLoadingText] = useState('Initializing...');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const messages = [
            'Initializing...',
            'Loading components...',
            'Setting up interface...',
            'Almost ready...'
        ];

        let messageIndex = 0;
        let progressValue = 0;

        const interval = setInterval(() => {
            progressValue += Math.random() * 15 + 5;
            if (progressValue > 100) progressValue = 100;

            setProgress(progressValue);

            if (progressValue > 25 && messageIndex < 1) {
                messageIndex = 1;
                setLoadingText(messages[1]);
            } else if (progressValue > 50 && messageIndex < 2) {
                messageIndex = 2;
                setLoadingText(messages[2]);
            } else if (progressValue > 80 && messageIndex < 3) {
                messageIndex = 3;
                setLoadingText(messages[3]);
            }

            if (progressValue >= 100) {
                clearInterval(interval);
            }
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="text-center">
                {/* Logo/Icon */}
                <div className="relative mb-8">
                    <div className="w-20 h-20 flex items-center justify-center">
                        <Code className="w-10 h-10 text-white" />
                    </div>
                </div>

                {/* Loading text */}
                <h2 className="text-2xl font-bold text-white mb-2">Loading Portfolio</h2>
                <p className="text-gray-400 mb-8">{loadingText}</p>

                {/* Progress bar */}
                <div className="w-80 max-w-sm mx-auto mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Loading dots */}
                <div className="flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                </div>
            </div>
        </div>
    );
}

function Home() {
    const [scrolled, setScrolled] = useState(false);
    const [isMainLoading, setIsMainLoading] = useState(true);
    const [componentsLoaded, setComponentsLoaded] = useState({
        navbar: false,
        hero: false,
        about: false,
        projects: false,
        contact: false,
        social: false
    });

    useEffect(() => {
        // Log visit activity
        createVisit();
    }, []);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setScrolled(offset > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Simulate main loading completion
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMainLoading(false);
        }, 2500); // Adjust timing as needed

        return () => clearTimeout(timer);
    }, []);

    // Handle component load completion
    const handleComponentLoad = (componentName) => {
        setComponentsLoaded(prev => ({
            ...prev,
            [componentName]: true
        }));
    };

    if (isMainLoading) {
        return <MainLoader />;
    }

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Navbar */}
            <div className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 shadow-lg' : 'bg-transparent'}`}>
                <Suspense fallback={
                    <div className="h-16 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
                    </div>
                }>
                    <Navbar />
                </Suspense>
            </div>

            {/* Background layers */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
            <div className="absolute inset-0 z-0 opacity-5 bg-[url('/assets/grid-pattern.svg')]"></div>

            {/* Main content with higher z-index */}
            <div id="home" className="flex-grow relative z-10">
                {/* Mobile layout */}
                <div className="md:hidden flex flex-col min-h-screen pt-20 px-4 sm:px-6">
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <Suspense fallback={
                            <SectionLoader
                                icon={User}
                                title="Loading Profile"
                                description="Getting your information ready..."
                            />
                        }>
                            <HeroLeft />
                        </Suspense>
                    </div>
                    <div className="flex-1 flex justify-center items-center py-8">
                        <Suspense fallback={
                            <SectionLoader
                                icon={Code}
                                title="Loading Content"
                                description="Preparing visual elements..."
                            />
                        }>
                            <HeroRight />
                        </Suspense>
                    </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:flex min-h-screen items-center">
                    <div className="container mx-auto flex items-center justify-between">
                        <div className="w-1/2 pl-8 pr-4">
                            <Suspense fallback={
                                <SectionLoader
                                    icon={User}
                                    title="Loading Profile"
                                    description="Getting your information ready..."
                                />
                            }>
                                <HeroLeft />
                            </Suspense>
                        </div>
                        <div className="w-1/2 pl-4 pr-8 flex justify-center items-center">
                            <Suspense fallback={
                                <SectionLoader
                                    icon={Code}
                                    title="Loading Content"
                                    description="Preparing visual elements..."
                                />
                            }>
                                <HeroRight />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>

            {/* About */}
            <div id='about'>
                <Suspense fallback={
                    <SectionLoader
                        icon={User}
                        title="Loading About Section"
                        description="Fetching personal information..."
                    />
                }>

                </Suspense>
            </div>

            {/* Projects */}
            <div id='projects'>
                <Suspense fallback={
                    <SectionLoader
                        icon={Briefcase}
                        title="Loading Projects"
                        description="Gathering project details..."
                    />
                }>
                    <Projects />
                </Suspense>
            </div>

            {/* Contact */}
            <div id='contact'>
                <Suspense fallback={
                    <SectionLoader
                        icon={Mail}
                        title="Loading Contact Section"
                        description="Setting up contact form..."
                    />
                }>
                    <Contact />
                </Suspense>
            </div>

            {/* Social Media Plugin */}
            <div>
                <Suspense fallback={null}>
                    <SocialMedia />
                </Suspense>
            </div>

            {/* Decorative overlays (behind content) */}
            <div className="hidden md:block absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent z-0"></div>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500/10 blur-3xl z-0"></div>
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl z-0"></div>
        </div>
    );
}

export default Home;