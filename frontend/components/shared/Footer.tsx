"use client"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Footer() {
    const [color,setColor] = useState("red")
    useEffect(() => {
      const getUser = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/user/getUserEmail', {
            withCredentials: true // This ensures cookies are included in the request
          });
          if (response.status == 201) {
            setColor("green")
          }
          else {
            setColor("red");
            console.log("User is unauthorized");
          }
        }
        catch (err: any) {
          setColor("red");
          console.log("Error", err)
        }
      };
  
      getUser();
    }, [])
    return (
        <footer className="w-full">
            <section className="flex justify-end items-center">
             <Badge className="mr-2 text-xs">{color==="green"? "Logged In": "Not Signed "}
             </Badge>
             <div className={`bg-${color}-500 rounded-full w-2 h-2`}></div>
            </section>
        </footer>
    )
}