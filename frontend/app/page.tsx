"use client";

import MainHeader from "@/components/shared/Header";
import Main from "@/components/shared/Main";
import Footer from "@/components/shared/Footer";
export default function Home() {

  return (
    <section className="w-full h-screen flex justify-center items-center p-3 text-white">
      <div className="w-full h-full bg-slate-950 opacity-90 rounded-2xl p-2">
         <MainHeader/>
         <Main/>
         <Footer/>
      </div>
    </section>
  );
}
