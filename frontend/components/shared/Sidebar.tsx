"use client";

import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarProps, User } from "@/global/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { APPLOGO } from "@/public"
import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "@/global/constants"

export default function Sidebar({ userIds, onUserClick }: SidebarProps) {
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/api/user/getUsersByIds`, { userIds }, { withCredentials: true });
        if (response.status == 201) {
          setUsers(response.data);
        }
      } catch (err: any) {
        console.log("Error", err.message);
      }
    };
    getUsers();
  }, [userIds]);
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Contacts List</h2>
      <ScrollArea className="h-[60vh] overflow-y-auto">
        {users.map((user, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg border-white mt-2 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition duration-200 hover:text-black "
            onClick={() => { onUserClick(user) }}
          >
            <div className="flex flex-col space-y-1">
              <div className="font-bold ">{user.username}</div>
              <div className="text-xs text-gray-500">{user.status}</div>
            </div>
            <Avatar className="border border-black mr-5">
              {user.photographUri?
              <AvatarFallback>
                <Image alt={user.username} src={user.photographUri} width={50} height={50}/>
              </AvatarFallback>:
              <AvatarFallback>
                <Image alt={user.username} src={APPLOGO} width={50} height={50} />
              </AvatarFallback>
              }
            </Avatar>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}
