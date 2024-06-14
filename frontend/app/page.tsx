"use client";

import MainHeader from "@/components/shared/Header";
import Main from "@/components/shared/Main";
import Footer from "@/components/shared/Footer";
import { UserProvider } from "@/global/userContext";
export default function Home() {
    return (
        <UserProvider>
                <section className="w-full h-screen flex justify-center items-center p-3 text-white">
                    <div className="w-full h-full bg-gray-900 opacity-90 rounded-2xl p-2 border-white border-4 flex flex-col overflow-hidden">
                            <MainHeader />
                            <Main />
                            <Footer />
                    </div>
                </section>
        </UserProvider>

    );
}
