"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarProps, User } from "@/global/types"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { APPLOGO } from "@/public"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Sidebar({ userIds, onUserClick }: SidebarProps) {
    // Configuration object for Axios request
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you have a token stored in localStorage
        },
        timeout: 5000 // Timeout in milliseconds
    };
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.post("https://chat-app-1-5qqj.onrender.com/api/user/getUsersByIds", { userIds }, config);
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
            <h2 className="text-2xl font-bold">Contacts List</h2>
            {users.map((user, index) => (
                <div className="p-4 border rounded-lg border-white mt-2 flex justify-between items-center cursor-pointer" onClick={() => { onUserClick(user) }} key={index}>
                    <div className="flex flex-col space-y-1">
                        <div key={user.username} className="font-bold">
                            {user.username}
                        </div>
                        <div key={user.status} className="text-xs">
                            {user.status}
                        </div>
                    </div>
                    <Avatar className="border border-black mr-5" >
                        <AvatarFallback>
                            <Image
                                alt="@CN"
                                src={APPLOGO}
                                width="50"
                            />
                        </AvatarFallback>
                    </Avatar>
                </div>
            ))}
        </div>
    )
}
