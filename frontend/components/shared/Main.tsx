"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { User } from "@/global/types";
import { useUser } from "@/global/userContext";
import { Button } from "../ui/button";
import { IoMdArrowBack } from 'react-icons/io';
import { ScrollArea } from "../ui/scroll-area";

export default function Main() {
  const { currentUser, contacts } = useUser();
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

  return (
    <main className="w-full p-2 rounded-2xl h-[75vh] flex-1 lg:mt-4">
      <section className="flex justify-start items-center h-full">
        <ScrollArea className={`${list} lg:block h-full w-full lg:w-96  flex-2 `}>
          <Sidebar userIds={contacts} onUserClick={handleUserClick} />
        </ScrollArea>
        <div className={`${chatShow} lg:block h-full w-full`}>
          <Button variant={"ghost"} size={"sm"} onClick={() => { setChatShow("hidden"); setList("block"); }} className={`lg:hidden`}>
             Go back
          </Button>
          <Chat user={clickedUser} />
        </div>
      </section>
    </main>
  );
}