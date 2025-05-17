import React from 'react';
import { motion } from 'framer-motion';
import HeroPng from '../../assets/hero.jpg';

function HeroRight() {
    return (
        <div className="w-full flex items-center justify-center">
            {/* Decorative elements */}
            <div className="absolute -z-10 w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 blur-3xl"></div>

            {/* Animated image container */}
            <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            >
                {/* Image frame with elegant styling */}
                <div className="relative rounded-2xl p-1 bg-gradient-to-br from-green-400 via-green-200 to-transparent shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-blue-500/30 rounded-2xl backdrop-blur-sm"></div>

                    {/* Profile image */}
                    <motion.img
                        src={HeroPng}
                        alt="Sadeesha Sathsara"
                        className="relative z-10 object-cover rounded-xl w-64 sm:w-72 md:w-80 lg:w-96 aspect-[4/5]"
                        initial={{ filter: "grayscale(100%)" }}
                        animate={{ filter: "grayscale(0%)" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    />

                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 bg-[url('/assets/dot-pattern.svg')] opacity-10 mix-blend-overlay rounded-2xl"></div>
                </div>
            </motion.div>
        </div>
    );
}

export default HeroRight;