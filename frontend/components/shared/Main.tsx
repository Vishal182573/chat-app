"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { User } from "@/global/types";
import { Button } from "../ui/button";
import { IoMdArrowBack } from 'react-icons/io';
import { ScrollArea } from "../ui/scroll-area";
import { useSession, signIn } from "next-auth/react";
import { BACKEND_URL } from "@/global/constants";
import axios from "axios";

export default function Main() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn(undefined, { callbackUrl: '/' });
    },
  });
  const [contacts, setContacts] = useState([]);
  
  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/user/getContacts`, {
          params: { email: session?.user?.email },
          withCredentials: true,
        });
        if (response.status == 201) {
          setContacts(response.data);
        } else {
          console.log("Something went wrong");
        }
      } catch (err: any) {
        console.log("Error", err.message);
      }
    }
    getContacts();
  }, [session]);
  
  const [list, setList] = useState("block");
  const [chatShow, setChatShow] = useState("hidden");
  const [clickedUser, setClickedUser] = useState<User>({
    userId: "U-4567",
    username: "Unknown",
    email: "unknown@gmail.com",
    contactnumber: "0000000000",
    password: "v123",
    photographUri: "V",
    status: "Offline",
    contacts: [],
  });

  const handleUserClick = async (user: User) => {
    setClickedUser(user);
    setChatShow("block");
    setList("hidden");
  };
  
  if (!status) {
    return <div className="flex justify-center items-center h-screen text-4xl">Loading...</div>
  }

  return (
    <main className="w-full p-2 rounded-2xl h-[75vh] flex-1 lg:mt-4">
      <section className="flex justify-start items-center h-full">
        <ScrollArea className={`${list} lg:block h-full w-full lg:w-96 flex-2`}>
          <Sidebar userIds={contacts} onUserClick={handleUserClick} />
        </ScrollArea>
        <div className={`${chatShow} lg:block h-full w-full`}>
          <Button variant={"ghost"} size={"sm"} onClick={() => { setChatShow("hidden"); setList("block"); }} className="lg:hidden">
            <IoMdArrowBack /> Go back
          </Button>
          <Chat user={clickedUser} />
        </div>
      </section>
    </main>
  );
}
