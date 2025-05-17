import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    // Handle scroll background effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Detect visible section
    useEffect(() => {
        const sectionIds = ['home', 'about', 'projects', 'contact'];

        const handleSectionScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight / 3;

            for (let id of sectionIds) {
                const section = document.getElementById(id);
                if (section) {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        setActiveSection(id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleSectionScroll);
        return () => window.removeEventListener('scroll', handleSectionScroll);
    }, []);

    const tabs = [
        { name: 'Home', path: '#home' },
        { name: 'About', path: '#about' },
        { name: 'Projects', path: '#projects' },
        { name: 'Contact', path: '#contact' },
    ];

    return (
        <header className={`transition-all duration-300 ${isScrolled ? 'bg-[#101828] shadow-sm fixed top-0 left-0 w-full z-50' : ''}`}>
            <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
                {/* Logo */}
                <h1 className="text-2xl text-white m-plus-extrabold">Sathsara K.</h1>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10">
                    {tabs.map((tab) => (
                        <a
                            key={tab.name}
                            href={tab.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`hover:text-highlight ${activeSection === tab.path.replace('#', '') ? 'text-highlight' : 'text-white'
                                }`}
                        >
                            {tab.name}
                        </a>
                    ))}
                    <button className="border border-highlight rounded-md px-4 py-2 text-white hover:bg-highlight hover:text-black m-plus-bold">
                        Download CV
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
                        {isMobileMenuOpen ? <X color="white" /> : <Menu color="white" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <nav className="md:hidden px-5 pb-4 flex flex-col gap-4 border-b-2 bg-[#172030] border-b-[#25262f] rounded-md">
                    {tabs.map((tab) => (
                        <a
                            key={tab.name}
                            href={tab.path}
                            className={`hover:text-highlight ${activeSection === tab.path.replace('#', '') ? 'text-highlight' : 'text-white'
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {tab.name}
                        </a>
                    ))}
                    <button className="border border-highlight rounded-md px-4 py-2 text-white hover:bg-highlight hover:text-black m-plus-bold">
                        Download CV
                    </button>
                </nav>
            )}
        </header>
    );
}

export default Navbar;
