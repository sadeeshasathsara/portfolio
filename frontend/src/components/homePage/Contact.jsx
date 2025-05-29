import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Check, AlertCircle, Loader2 } from 'lucide-react';
import { logEmail } from '../../tools/ActivityRecorder';
import axios from 'axios';
import { BACKEND_URL } from '../../tools/Tools';

function Contact() {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Form status
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    });

    // Form validation
    const [errors, setErrors] = useState({});

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // Validate form
    const validateForm = () => {
        let tempErrors = {};
        let formIsValid = true;

        if (!formData.name.trim()) {
            tempErrors.name = "Name is required";
            formIsValid = false;
        }

        if (!formData.email.trim()) {
            tempErrors.email = "Email is required";
            formIsValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Email is invalid";
            formIsValid = false;
        }

        if (!formData.subject.trim()) {
            tempErrors.subject = "Subject is required";
            formIsValid = false;
        }

        if (!formData.message.trim()) {
            tempErrors.message = "Message is required";
            formIsValid = false;
        }

        setErrors(tempErrors);
        return formIsValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setStatus(prevStatus => ({ ...prevStatus, submitting: true }));

        try {
            const response = await axios.post(`${BACKEND_URL}/api/contact`, formData);

            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: response.data.message || "Thank you! Your message has been sent successfully." },
            });

            // Reset form after 3 seconds
            setTimeout(() => {
                setStatus({
                    submitted: false,
                    submitting: false,
                    info: { error: false, msg: null }
                });
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            }, 3000);

        } catch (error) {
            const msg = error.response?.data?.message || "Something went wrong. Please try again later.";
            setStatus({
                submitted: false,
                submitting: false,
                info: { error: true, msg },
            });

            logEmail(formData.email);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section id="contact" className="relative py-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black z-0"></div>
            <div className="absolute inset-0 opacity-5 bg-[url('/assets/grid-pattern.svg')] z-0"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-green-500/5 blur-3xl z-0"></div>
            <div className="absolute bottom-1/4 left-1/3 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl z-0"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6"></div>
                    <p className="text-gray-300 text-lg">
                        Have a project in mind or want to collaborate? I'd love to hear from you!
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Contact Info - Takes 2 columns on large screens */}
                    <motion.div
                        className="lg:col-span-2 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 p-8 h-fit"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>

                        <div className="space-y-8">
                            {/* Email */}
                            <div className="flex items-start">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mr-4">
                                    <Mail className="h-5 w-5 text-green-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Email</h4>
                                    <a href="mailto:hello@example.com" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
                                        hello@example.com
                                    </a>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mr-4">
                                    <Phone className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Phone</h4>
                                    <a href="tel:+94770123456" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                                        +94 77 012 3456
                                    </a>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mr-4">
                                    <MapPin className="h-5 w-5 text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Location</h4>
                                    <p className="text-gray-300">
                                        Colombo, Sri Lanka
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social links */}
                        <div className="mt-12">
                            <h4 className="text-white font-medium mb-4">Find me on</h4>
                            <div className="flex gap-4">
                                {['github', 'linkedin', 'twitter', 'dribbble'].map(platform => (
                                    <a
                                        key={platform}
                                        href={`https://${platform}.com`}
                                        className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-white/70 hover:bg-green-500/20 hover:text-green-400 transition-all duration-300"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="sr-only">{platform}</span>
                                        <i className={`fab fa-${platform} text-lg`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form - Takes 3 columns on large screens */}
                    <motion.div
                        className="lg:col-span-3 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 p-8"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-8">Send a Message</h3>

                        {status.info.msg && (
                            <div
                                className={`mb-6 p-4 rounded-lg flex items-center ${status.info.error ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                    }`}
                            >
                                {status.info.error ? (
                                    <AlertCircle className="mr-2 h-5 w-5" />
                                ) : (
                                    <Check className="mr-2 h-5 w-5" />
                                )}
                                <p>{status.info.msg}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full bg-gray-800/50 border ${errors.name ? 'border-red-500/50' : 'border-gray-700/50'
                                            } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300`}
                                        placeholder="Your name"
                                        disabled={status.submitting}
                                    />
                                    {errors.name && (
                                        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full bg-gray-800/50 border ${errors.email ? 'border-red-500/50' : 'border-gray-700/50'
                                            } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300`}
                                        placeholder="Your email"
                                        disabled={status.submitting}
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Subject Field */}
                            <div className="space-y-2">
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-800/50 border ${errors.subject ? 'border-red-500/50' : 'border-gray-700/50'
                                        } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300`}
                                    placeholder="What's this about?"
                                    disabled={status.submitting}
                                />
                                {errors.subject && (
                                    <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
                                )}
                            </div>

                            {/* Message Field */}
                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    className={`w-full bg-gray-800/50 border ${errors.message ? 'border-red-500/50' : 'border-gray-700/50'
                                        } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300`}
                                    placeholder="Your message"
                                    disabled={status.submitting}
                                />
                                {errors.message && (
                                    <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status.submitting}
                                    className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium flex items-center justify-center ${status.submitting
                                        ? 'bg-gray-700 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105'
                                        } text-white shadow-lg shadow-green-500/20 transition-all duration-300`}
                                >
                                    {status.submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : status.submitted ? (
                                        <>
                                            <Check className="mr-2 h-5 w-5" />
                                            Sent!
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-5 w-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Contact;