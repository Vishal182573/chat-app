"use client"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { useEffect, useState } from "react"
import { useUser } from "@/global/userContext"

export default function Footer() {
  const {currentUser,contacts} = useUser();
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
        <footer className="w-full bg-black rounded-lg lg:p-1 text-xs lg:text-md">
          <section className="flex justify-between">
            <div className="lg:ml-5">
              Username :- {currentUser?.username}
            </div>
            <div className="flex lg:mr-6">
             <div className="mr-2 text-xs">{currentUser? "Logged In": "Not Signed "}
             </div>
             <div className={`bg-${color}-500 rounded-full w-2 h-2`}></div>
            </div>
            </section>
        </footer>
    )
}