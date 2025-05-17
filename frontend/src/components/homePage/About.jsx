
import React from 'react';
import { ChevronRight, Code, Server, Laptop, Zap } from 'lucide-react';

function About() {
    return (
        <section id="about" className="relative py-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black z-0"></div>
            <div className="absolute inset-0 opacity-5 bg-[url('/assets/grid-pattern.svg')] z-0"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-green-500/5 blur-3xl z-0"></div>
            <div className="absolute bottom-1/4 left-1/3 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl z-0"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About Me</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6"></div>
                    <p className="text-gray-300 text-lg">
                        Passionate full-stack developer turning complex problems into elegant, efficient solutions.
                    </p>
                </div>

                {/* About content - Desktop view */}
                <div className="hidden md:grid grid-cols-2 gap-12 items-center">
                    {/* Left side - Personal description */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-white">My Journey</h3>
                        <p className="text-gray-300">
                            I'm Sadeesha Sathsara Kumbukage, a full-stack developer with a passion for creating beautiful, functional web applications. My journey in tech began over 2 years ago, and I've since built projects using PHP, Java, and the MERN stack. While I’ve explored multiple technologies, my current focus is on mastering the MERN stack to create responsive and scalable applications. As an undergraduate at SLIIT, I’m committed to continuous learning and writing clean, maintainable code that aligns with modern development practices.
                        </p>

                        <div className="pt-4">
                            <a href="#contact" className="inline-flex items-center text-green-400 hover:text-green-300 font-medium">
                                Get in touch with me <ChevronRight className="ml-2 h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Right side - Skills and highlights */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                        <div className="grid grid-cols-2 gap-8">
                            {/* Skill item 1 */}
                            <div className="text-center p-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-4">
                                    <Code className="h-6 w-6 text-blue-400" />
                                </div>
                                <h4 className="text-3xl font-bold text-white mb-1">6+</h4>
                                <p className="text-gray-400 text-sm">Projects Completed</p>
                            </div>

                            {/* Skill item 2 */}
                            <div className="text-center p-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                                    <Laptop className="h-6 w-6 text-green-400" />
                                </div>
                                <h4 className="text-3xl font-bold text-white mb-1">15+</h4>
                                <p className="text-gray-400 text-sm">Technologies</p>
                            </div>

                            {/* Skill item 3 */}
                            <div className="text-center p-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mb-4">
                                    <Server className="h-6 w-6 text-purple-400" />
                                </div>
                                <h4 className="text-3xl font-bold text-white mb-1">2 yrs</h4>
                                <p className="text-gray-400 text-sm">Experience</p>
                            </div>

                            {/* Skill item 4 */}
                            <div className="text-center p-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20 mb-4">
                                    <Zap className="h-6 w-6 text-orange-400" />
                                </div>
                                <h4 className="text-3xl font-bold text-white mb-1">100%</h4>
                                <p className="text-gray-400 text-sm">Client Satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About content - Mobile view */}
                <div className="md:hidden space-y-10">
                    {/* Personal description */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">My Journey</h3>
                        <p className="text-gray-300 text-sm">
                            I'm Sadeesha Sathsara, a full-stack developer with a passion for creating beautiful,
                            functional web applications. My journey in tech began over 5 years ago, and I've been
                            constantly expanding my skills and embracing new technologies.
                        </p>
                        <p className="text-gray-300 text-sm">
                            I specialize in both front-end and back-end development, leveraging modern frameworks and
                            tools to build responsive, scalable applications.
                        </p>
                        <div className="pt-2">
                            <a href="#contact" className="inline-flex items-center text-green-400 hover:text-green-300 text-sm font-medium">
                                Get in touch with me <ChevronRight className="ml-1 h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Skills grid */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Skill item 1 */}
                            <div className="text-center p-2">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 mb-3">
                                    <Code className="h-5 w-5 text-blue-400" />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-1">50+</h4>
                                <p className="text-gray-400 text-xs">Projects Completed</p>
                            </div>

                            {/* Skill item 2 */}
                            <div className="text-center p-2">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 mb-3">
                                    <Laptop className="h-5 w-5 text-green-400" />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-1">15+</h4>
                                <p className="text-gray-400 text-xs">Technologies</p>
                            </div>

                            {/* Skill item 3 */}
                            <div className="text-center p-2">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20 mb-3">
                                    <Server className="h-5 w-5 text-purple-400" />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-1">5+ yrs</h4>
                                <p className="text-gray-400 text-xs">Experience</p>
                            </div>

                            {/* Skill item 4 */}
                            <div className="text-center p-2">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 mb-3">
                                    <Zap className="h-5 w-5 text-orange-400" />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-1">100%</h4>
                                <p className="text-gray-400 text-xs">Client Satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills section */}
                <div className="mt-24">
                    <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">My Expertise</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Skill area 1 */}
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-green-500/50 transition-all duration-300">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                                <span className="text-green-400 text-xl font-bold">01</span>
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-3">Frontend Development</h4>
                            <p className="text-gray-300 text-sm md:text-base">
                                Crafting responsive, intuitive interfaces using React, Next.js, and Tailwind CSS to deliver
                                seamless user experiences across all devices.
                            </p>
                        </div>

                        {/* Skill area 2 */}
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-4">
                                <span className="text-blue-400 text-xl font-bold">02</span>
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-3">Backend Development</h4>
                            <p className="text-gray-300 text-sm md:text-base">
                                Building robust server-side applications with Node.js, Express, and MongoDB to create
                                scalable, secure API endpoints and data management systems.
                            </p>
                        </div>

                        {/* Skill area 3 */}
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-purple-500/50 transition-all duration-300">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mb-4">
                                <span className="text-purple-400 text-xl font-bold">03</span>
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-3">Problem Solving & Algorithms</h4>
                            <p className="text-gray-300 text-sm md:text-base">
                                Strengthening core programming skills through algorithmic challenges using Java and JavaScript.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;