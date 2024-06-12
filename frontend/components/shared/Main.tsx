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
import { useState, useEffect } from "react"
import { APPLOGO } from "@/public"
import Chat from "./Chat"
import axios from "axios"
import { useRouter } from "next/navigation"


export default function Main() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User>();
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState<Chats[]>([]);
  const [clickedUserEmail, setClickedUserEmail] = useState<string>();
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/getUserEmail', {
          withCredentials: true // This ensures cookies are included in the request
        });
        if (response.status == 201) {
          try {
            const email = response.data.email;
            const user = await axios.get("http://localhost:3001/api/user/getCurrentUser", {
              params: { email: email },
            })
            if (user.status == 201) {
              setUsers(user.data.contacts)
              setCurrentUser(user.data);
            }
          } catch (err: any) {
            console.log("Error", err.message);
          }
        }
        else {
          router.push('/login');
          console.log("User is unauthorized");
        }
      }
      catch (err: any) {
        router.push('/login');
        console.log("Error", err)
      }
    };
    getUser();
  }, [])
  const HandleClickOnUser = async (user: User) => {
    try {
      const response = await axios.post('http://localhost:3001/api/chat/addChat', {
        userId1: currentUser?.userId,
        userId2: user.userId,
      })
      if (response.status == 201) {
        setClickedUserEmail(user.email);
        setChats(response.data);
        console.log(response.data);
      }
    } catch (err: any) {
      console.log("Error", err.message);
    }
  }
  return (
    <main className="w-full p-2 rounded-2xl  mt-2 h-[75vh] ">
      <section className="flex justify-between  items-center h-full">
        <Sidebar userIds={users} onUserClick={HandleClickOnUser} />
        {/* <Chat chats={chats} email={clickedUserEmail}/> */}
      </section>
    </main>
  )
}
