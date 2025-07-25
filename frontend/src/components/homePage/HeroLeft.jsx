import React from 'react';
import { motion } from 'framer-motion';

function HeroLeft() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <motion.div
            className="w-full md:max-w-xl flex flex-col justify-center items-center md:items-start"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Introduction tag with highlight effect */}
            <motion.div
                className="mb-4"
                variants={itemVariants}
            >
                <span className="bg-gradient-to-r from-green-400 to-green-600 px-4 py-1 rounded-full text-sm md:text-base font-medium tracking-wide text-white">
                    HELLO, I'M
                </span>
            </motion.div>

            {/* Name with large, bold typography */}
            <motion.div className="text-center md:text-left" variants={itemVariants}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-none">
                    Sadeesha
                </h1>
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-600 leading-none mt-2">
                    Sathsara
                </h1>
            </motion.div>

            {/* Professional subtitle */}
            <motion.p
                className="text-lg md:text-xl lg:text-2xl text-gray-300 mt-6 mb-8 text-center md:text-left"
                variants={itemVariants}
            >
                Full-stack developer crafting innovative digital experiences with clean, elegant code.
            </motion.p>

            {/* CTA buttons */}
            <motion.div className="flex flex-wrap gap-4 justify-center md:justify-start" variants={itemVariants}>
                <a href="#contact" className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-black font-bold shadow-lg shadow-green-500/20 transition-all duration-300 transform hover:scale-105">
                    Let's Connect
                </a>
                <a href='#projects' className="border-2 border-white/30 hover:border-white text-white px-5 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-white/10">
                    View Projects
                </a>
            </motion.div>

            {/* Social links */}
            <motion.div
                className="flex gap-6 mt-10 justify-center md:justify-start"
                variants={itemVariants}
            >
                {[
                    { platform: 'github', url: 'https://github.com/sadeeshasathsara' },
                    { platform: 'linkedin', url: 'https://www.linkedin.com/in/sadeeshasathsara' },
                    { platform: 'twitter', url: 'https://twitter.com/' },
                    { platform: 'dribbble', url: 'https://dribbble.com/' },
                ].map(({ platform, url }) => (
                    <a
                        key={platform}
                        href={url}
                        className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-white/70 hover:bg-green-500/20 hover:text-green-400 transition-all duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="sr-only">{platform}</span>
                        <i className={`fab fa-${platform} text-lg`}></i>
                    </a>
                ))}
            </motion.div>
        </motion.div>
    );
}

export default HeroLeft;