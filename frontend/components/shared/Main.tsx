"use client"

import Image from "next/image"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "../ui/button"
import Link from "next/link"
import Sidebar from "./Sidebar"
import { Chats, User } from "@/global/types"
import { useState } from "react"
import { APPLOGO } from "@/public"
import Chat from "./Chat"


export default function Main() {
    const [users,setUsers] = useState <User[]> ([]);
    const [chats,setChats] = useState <Chats> ({
        chat:["hello","hii","How are you","i am fine. what about you","okay nice to talk to you","yeah","meet you soon","sure","okay","bye","bye","Gn","Gn"],
        user:users[0],
    });

    const HandleClickOnUser = (user:User)=>{
        // by using this user setchats of this user using its this user id and logged in user from backend
        setChats({
            chat:[""],
            user:user,
        })
    }
    return (
        <main className="w-full p-2 rounded-2xl  mt-2">
            <section className="flex justify-between  items-center">
                <Sidebar users={users} onUserClick={HandleClickOnUser}/>
                {/* <Chat chats={chats} /> */}
            </section>
        </main>
    )
}
