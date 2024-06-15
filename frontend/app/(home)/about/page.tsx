"use client";

export default function About() {

  return (
    <section className="w-full h-screen flex justify-center items-center p-3 text-white">
      <div className="w-full h-full bg-slate-950 opacity-90 rounded-2xl p-2">
      <div className="bg-gray-900 text-white min-h-full flex justify-center items-center ">
      <div className="max-w-4xl px-8 text-xs ">
        <h1 className="text-lg lg:text-3xl font-bold mb-4">About Our Chat App</h1>
        <p className="lg:text-lg mb-4">
          Our chat app is a real-time messaging platform that allows users to connect with each other using Socket.IO. It comes with all the basic features you'd expect from a messaging app, including:
        </p>
        <ul className="list-disc pl-4 mb-8">
          <li>Update profile information</li>
          <li>Contact any person on the platform from the search list</li>
          <li>Online and offline status indicators</li>
          <li>Real-time chatting</li>
          <li>Record of all chats</li>
          <li>User authentication</li>
        </ul>
      </div>
    </div>
      </div>
    </section>
  );
}