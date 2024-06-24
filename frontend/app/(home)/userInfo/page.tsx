'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { User } from '@/global/types';

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
        <section className="w-full h-screen flex justify-center items-center p-10">
            <div className="w-full h-full max-w-2xl flex flex-col justify-center items-center bg-white rounded-2xl shadow-2xl transform transition-all hover:scale-105 hover:shadow-2xl">
                <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">User Information</h1>
                    <div className="flex flex-col space-y-6">
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold w-32 text-gray-700">Username:</span>
                            <span className="text-gray-900">{currentUser.username || "N/A"}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold w-32 text-gray-700">Email:</span>
                            <span className="text-gray-900">{currentUser.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold w-32 text-gray-700">Contact Number:</span>
                            <span className="text-gray-900">{currentUser.contactnumber || "N/A"}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold w-32 text-gray-700">Photograph:</span>
                            {currentUser.photographUri ? (
                                <img
                                    className="w-16 h-16 rounded-full border-4 border-indigo-500 shadow-md"
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
                </div>
            </div>
        </section>
    );
}
