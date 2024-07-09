'use client';

import { motion } from 'framer-motion';
import { FaComments, FaKeyboard, FaLock, FaSearch, FaCircle, FaHistory, FaUserShield, FaCode } from 'react-icons/fa';

export default function About() {
    const features = [
        { icon: <FaComments />, text: "Real-time chatting and messaging" },
        { icon: <FaKeyboard />, text: "Real-time typing indicators" },
        { icon: <FaLock />, text: "End-to-end encryption" },
        { icon: <FaSearch />, text: "Search and contact any user" },
        { icon: <FaCircle />, text: "Online/offline status indicators" },
        { icon: <FaHistory />, text: "Full chat history" },
        { icon: <FaUserShield />, text: "User authentication and authorization" },
    ];

    const techStack = [
        "JavaScript (ES6+)",
        "TypeScript",
        "Next.js",
        "Tailwind CSS",
        "Express.js",
        "MongoDB",
        "Socket.IO",
    ];

    return (
        <section className="w-full min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-100 to-purple-100">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 space-y-8"
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">About Our Chat App</h1>
                <p className="text-lg text-gray-700 mb-6 text-center leading-relaxed">
                    Our chat app is a cutting-edge real-time messaging platform built with modern technologies. 
                    It offers seamless communication with real-time updates and robust end-to-end user data protection.
                </p>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <span className="text-blue-500 text-2xl">{feature.icon}</span>
                                <span className="text-gray-700">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tech Stack</h2>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="flex flex-wrap gap-3"
                    >
                        {techStack.map((tech, index) => (
                            <motion.span 
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center"
                            >
                                <FaCode className="mr-2" />
                                {tech}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="text-center text-gray-600 mt-8"
                >
                    Experience the future of communication with our feature-rich, secure, and user-friendly chat application.
                </motion.p>
            </motion.div>
        </section>
    );
}