import React, { useState, useEffect } from 'react';
import Navbar from '../components/homePage/navbar';
import HeroLeft from '../components/homePage/HeroLeft';
import HeroRight from '../components/homePage/HeroRight';
import About from '../components/homePage/About';
import Projects from '../components/homePage/Projects';
import Contact from '../components/homePage/Contact';

function Home() {
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setScrolled(offset > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Navbar */}
            <div className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 shadow-lg' : 'bg-transparent'}`}>
                <Navbar />
            </div>

            {/* Background layers */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
            <div className="absolute inset-0 z-0 opacity-5 bg-[url('/assets/grid-pattern.svg')]"></div>

            {/* Main content with higher z-index */}
            <div id="home" className="flex-grow relative z-10">
                {/* Mobile layout */}
                <div className="md:hidden flex flex-col min-h-screen pt-20 px-4 sm:px-6">
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <HeroLeft />
                    </div>
                    <div className="flex-1 flex justify-center items-center py-8">
                        <HeroRight />
                    </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:flex min-h-screen items-center">
                    <div className="container mx-auto flex items-center justify-between">
                        <div className="w-1/2 pl-8 pr-4">
                            <HeroLeft />
                        </div>
                        <div className="w-1/2 pl-4 pr-8 flex justify-center items-center">
                            <HeroRight />
                        </div>
                    </div>
                </div>
            </div>

            {/* About */}
            <div id='about'>
                <About />
            </div>

            {/* Projects */}
            <div id='projects'>
                <Projects />
            </div>

            {/* Contact */}
            <div id='contact'>
                <Contact />
            </div>

            {/* Decorative overlays (behind content) */}
            <div className="hidden md:block absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent z-0"></div>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500/10 blur-3xl z-0"></div>
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl z-0"></div>
        </div>
    );
}

export default Home;
