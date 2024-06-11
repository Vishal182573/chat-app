"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarProps } from "@/global/types"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { APPLOGO } from "@/public"
import { User } from "@/global/types";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();
    const [prefix,setPrefix] = useState("");
    const [users,setUsers] = useState <User[]> ([]);
    useEffect(()=>{
      const handleChange= async()=>{
        try{
          const response = await axios.get(`http://localhost:3001/api/user/getUsersByPrefix?prefix=${prefix}`)
          if(response.status==201){
              setUsers(response.data);
          }
        }catch(err:any){
          console.log("ERROR",err);
          alert(err.message);
        }
    }
     handleChange();
    },[prefix]);

    const handleClick= async(user:User)=>{
      try{
        const response = await axios.put(`http://localhost:3001/api/user/addUser?userId=${user.userId}`);
        if(response.status==201){
          router.push('/');
        }
      }catch(err:any){
        console.log("Error",err);
        alert(err.message)
      }
    }
    useEffect(()=>{
      const getUser = async()=>{
        try{
          const response = await axios.get('http://localhost:3001/api/getUserEmail', {
            withCredentials: true // This ensures cookies are included in the request
        });
          if(response.status==201){
            console.log(response.data);
          }
          else{
            console.log("unable to get user");
          }
        }
        catch(err:any){
          console.log("Error",err.message)
        }
      }
      getUser();
    },[])

  return (
    <section className="w-full h-screen flex justify-center items-center p-3">
      <div className="w-full h-full bg-slate-950 opacity-90 rounded-2xl p-12">
        <Input onChange={(e)=>{setPrefix(e.target.value)}} className="mb-4" placeholder="Enter name to search"/>
        <ScrollArea className="h-[70vh] w-full border-white border-[1px] rounded-lg text-white">
            <div className="p-4">
                <h2 className="text-2xl font-bold text-center sticky top-2 bg-slate-600 rounded-lg">People List</h2>
                {users.map((user) => (
                    <div className="p-4 border rounded-lg border-white mt-2 flex justify-between items-center cursor-pointer" onClick={() => handleClick(user)}>
                        <div className="flex flex-col space-y-1 text-white">
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
        </ScrollArea>
      </div>
    </section>
  );
}