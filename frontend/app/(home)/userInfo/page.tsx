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
        return <div>Loading...</div>;
    }

    return (
        <section className="w-full h-screen flex justify-center items-center p-3  opacity-90">
            <div className="w-full h-full flex justify-center bg-slate-950 p-10 rounded-2xl">
                <div className="bg-white shadow-md rounded-2xl p-8 w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">User Information</h1>
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold w-32">Username:</span>
                            <span className="text-gray-800">{currentUser.username}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold w-32">Email:</span>
                            <span className="text-gray-800">{currentUser.email}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold w-32">Contact Number:</span>
                            <span className="text-gray-800">{currentUser.contactnumber}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold w-32">Photograph:</span>
                            <span className="text-gray-800">{currentUser.photographUri}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
