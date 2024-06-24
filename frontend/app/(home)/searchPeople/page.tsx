"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarProps } from "@/global/types"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { APPLOGO } from "@/public"
import { User } from "@/global/types";
import axios from "axios";
import { useRouter, redirect } from "next/navigation";
import { BACKEND_URL } from "@/global/constants";
import { useSession, signIn } from "next-auth/react";

export default function About() {
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
  useEffect(() => {
    const handleChange = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/user/getUsersByPrefix?prefix=${prefix}`, { withCredentials: true })
        if (response.status == 201) {
          setUsers(response.data);
        }
      } catch (err: any) {
        console.log("ERROR", err);
        alert(err.message);
      }
    }
    handleChange();
  }, [prefix]);

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
  if (status === "loading") {
    return <div className="text-4xl flex justify-center items-center">Loading...</div>;
  }
  return (
    <section className="w-full h-screen flex justify-center items-center p-3">
      <div className="w-full h-full bg-slate-950 opacity-90 rounded-2xl p-12 flex flex-col justify-center items-center border-white border-4">
        <h2 className="text-2xl font-bold text-center text-white mb-7">People List</h2>
        <Input onChange={(e) => setPrefix(e.target.value)} className="w-3/4 " placeholder="Enter name to search" />
        <ScrollArea className="h-[70vh] w-full text-white p-7">
          <div className="flex flex-col justify-center items-center">
            {users.map((user, index) => (
              <div
                className="p-4 border rounded-lg border-white mt-4 flex justify-between items-center cursor-pointer transition duration-300 ease-in-out transform hover:scale-95 w-11/12"
                onClick={() => handleClick(user)}
                key={index}
              >
                <div className="flex flex-col space-y-1 text-white">
                  <div className="font-bold">{user.username}</div>
                  <div className="text-xs">{user.status}</div>
                </div>
                <Avatar className="border border-black">
                  <AvatarFallback>
                    {user.photographUri ?
                      <Image src={user.photographUri} alt="@CN" width="50" height="50" /> :
                      <Image src={APPLOGO} alt="@CN" width="50" height="50" />
                    }
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}