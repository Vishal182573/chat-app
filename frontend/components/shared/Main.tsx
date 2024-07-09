'use client';

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { User } from "@/global/types";
import { Button } from "@/components/ui/button";
import { IoMdArrowBack } from 'react-icons/io';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession, signIn } from "next-auth/react";
import { BACKEND_URL } from "@/global/constants";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="w-full mt-4">
      <CardContent className="p-2 h-full">
        <div className="flex h-full gap-4">
          <ScrollArea className={`${list} lg:block h-full w-full lg:w-96`}>
            <Sidebar userIds={contacts} onUserClick={handleUserClick} />
          </ScrollArea>
          <div className={`${chatShow} lg:block h-full w-full`}>
            <Button variant="outline" size="sm" onClick={() => { setChatShow("hidden"); setList("block"); }} className="lg:hidden mb-2">
              <IoMdArrowBack className="mr-2" /> Go back
            </Button>
            <Chat user={clickedUser} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}