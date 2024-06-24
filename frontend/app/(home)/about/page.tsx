"use client";

export default function About() {

  return (
    <section className="w-full h-screen flex justify-center items-center p-3 text-white">
  <div className="w-full h-full bg-slate-950 opacity-90 rounded-2xl p-8">
    <div className="bg-gray-900 text-white min-h-full flex justify-center items-center">
      <div className="max-w-4xl px-8 text-sm lg:text-lg">
        <h1 className="text-lg lg:text-3xl font-bold mb-4">About Our Chat App</h1>
        <p className="mb-4">
          Our chat app is a real-time messaging platform built using modern technologies. It provides seamless communication features with real-time updates and end-to-end user data protection. Here are some key features:
        </p>
        <ul className="list-disc pl-4 mb-8">
          <li>Real-time chatting and messaging</li>
          <li>Real-time typing indicators for active conversations</li>
          <li>End-to-end encryption for user data security</li>
          <li>Search and contact any person on the platform</li>
          <li>Online and offline status indicators for users</li>
          <li>Full chat history and record of all conversations</li>
          <li>User authentication and authorization mechanisms</li>
        </ul>
        <p className="mb-4">
          The chat app is developed using a robust tech stack including:
        </p>
        <ul className="list-disc pl-4 mb-8">
          <li>JavaScript (ES6+)</li>
          <li>TypeScript for type safety and better developer experience</li>
          <li>Next.js for server-side rendering and React framework</li>
          <li>Tailwind CSS for responsive and utility-first styling</li>
          <li>Express.js for backend server routing and APIs</li>
          <li>MongoDB for database management and storage</li>
          <li>Socket.IO for real-time bi-directional event-based communication</li>
        </ul>
      </div>
    </div>
  </div>
</section>

  );
}