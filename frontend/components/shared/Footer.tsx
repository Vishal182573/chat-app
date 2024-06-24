"use client"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { useEffect, useState } from "react"
import { useSession, signIn } from "next-auth/react";
import { User } from "@/global/types";

export default function Footer() {
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
    const [color,setColor] = useState("red")
    useEffect(() => {
      const getUser = async () => {
          if (currentUser) {
            setColor("green")
          }
          else {
            setColor("red");
            console.log("User is unauthorized");
          }
      };
      getUser();
    }, [])
    return (
        <footer className="w-full bg-black rounded-lg flex justify-between items-center text-sm lg:text-md h-10 mb-3 p-4">
            <div className="lg:ml-5">
              Username :- {currentUser?.username}
            </div>
            <div className="flex lg:mr-6">
             <div className="mr-2">{currentUser? "Logged In": "Not Signed "}
             </div>
             <div className={`bg-${color}-500 rounded-full w-2 h-2`}></div>
            </div>
        </footer>
    )
}