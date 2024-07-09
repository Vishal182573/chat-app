'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { User } from '@/global/types';
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function UserInfo() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn(undefined, { callbackUrl: '/' });
        },
    });
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        if (session?.user) {
            setCurrentUser(session.user as User);
        }
    }, [session]);

    if (!currentUser) {
        return <div className="flex justify-center items-center h-screen text-4xl">Loading...</div>;
    }

    return (
        <section className="w-full min-h-screen flex justify-center items-center p-4 bg-gray-100">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">User Information</h1>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <FaUser className="text-blue-500 text-xl" />
                        <div>
                            <span className="font-semibold text-gray-700">Username:</span>
                            <span className="ml-2 text-gray-900">{currentUser.username || "N/A"}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <FaEnvelope className="text-blue-500 text-xl" />
                        <div>
                            <span className="font-semibold text-gray-700">Email:</span>
                            <span className="ml-2 text-gray-900">{currentUser.email || "N/A"}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <FaPhone className="text-blue-500 text-xl" />
                        <div>
                            <span className="font-semibold text-gray-700">Contact Number:</span>
                            <span className="ml-2 text-gray-900">{currentUser.contactnumber || "N/A"}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="font-semibold text-gray-700">Photograph:</span>
                        {currentUser.photographUri ? (
                            <motion.img
                                whileHover={{ scale: 1.1 }}
                                className="w-16 h-16 rounded-full border-4 border-blue-500 shadow-md"
                                src={currentUser.photographUri}
                                alt="User Photograph"
                            />
                        ) : (
                            <div className="w-16 h-16 flex justify-center items-center rounded-full bg-gray-200 text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}