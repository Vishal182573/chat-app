'use client';

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { APPLOGO } from "@/public"
import { User } from "@/global/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/global/constants";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";

export default function SearchPeople() {
  const router = useRouter();
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
  const [prefix, setPrefix] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const handleClick = async (user: User) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/addUser`, {
        userId1: currentUser?.userId,
        userId2: user.userId
      }, { withCredentials: true });
      if (response.status == 201) {
        router.push('/');
      }
    } catch (err: any) {
      console.log("Error", err);
      alert(err.message)
    }
  }
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleChange = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/user/getUsersByPrefix?prefix=${prefix}`, { withCredentials: true })
        if (response.status == 201) {
          setUsers(response.data);
        }
      } catch (err: any) {
        console.log("ERROR", err);
        alert(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    handleChange();
  }, [prefix]);
  return (
    <section className="w-full min-h-screen flex justify-center items-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-7">People List</h2>
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            onChange={(e) => setPrefix(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            placeholder="Enter name to search"
          />
        </div>
        <ScrollArea className="h-[60vh] w-full">
          <AnimatePresence>
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              users.map((user, index) => (
                <motion.div
                  key={user.userId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg mb-4 flex justify-between items-center cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100"
                  onClick={() => handleClick(user)}
                >
                  <div className="flex flex-col space-y-1">
                    <div className="font-bold text-gray-900">{user.username}</div>
                    <div className="text-xs text-gray-600">{user.status}</div>
                  </div>
                  <Avatar className="border border-gray-300">
                    <AvatarImage src={user.photographUri as any || APPLOGO} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </section>
  );
}