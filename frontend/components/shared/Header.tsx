"use client"

import { APPLOGO } from "@/public"
import Image from "next/image"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "../ui/button"
import Link from "next/link"
import { MdMenu } from 'react-icons/md';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"
import { useRouter } from "next/navigation"


export default function MainHeader() {
    const router = useRouter();
    const userLogout = async()=>{
        try{
            const response = await axios.get("http://localhost:3001/api/user/logout",{withCredentials:true});
            if(response.status==201){
                alert("User logged out");
                router.push("/login");
            }
        }catch(err:any){
            console.log("Error",err.message);
        }
    };
    return (
        <header className="w-full p-2 rounded-2xl  bg-blue-500 sticky top-0 z-50">
            <section className="flex justify-between items-center lg:px-2">
                <div className="flex justify-between items-center font-bold space-x-5 lg:text-xl text-sm">
                    <Image
                        alt="app-logo"
                        src={APPLOGO}
                        width={45}
                        className="rounded-full"
                    />
                    <span>V-chat</span>
                </div>
                <div className="flex justify-between items-center lg:space-x-12 px-7">
                    <Button variant={"ghost"} className="hidden lg:block">
                        <Link href={"/"}>
                            Home
                        </Link>
                    </Button>
                    <Button variant={"ghost"} className="hidden lg:block">
                        <Link href={"/about"}>
                            About
                        </Link>
                    </Button>
                    <div className="flex justify-end items-center ">
                        <Button variant={"ghost"} size={"sm"}>
                            <Link href={"/searchPeople"}>
                                Search People
                            </Link>
                        </Button>
                        <DropdownMenu >
                            <DropdownMenuTrigger>
                                <MdMenu size={25} className="lg:hidden" />
                                <Avatar className="border mr-5 hidden lg:block text-black" >
                                    <AvatarFallback>
                                        {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                                        {/* {session.user.name.charAt(0).toUpperCase()} */}
                                        V
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="h-screen lg:h-fit space-y-5 flex flex-col items-center font-bold">
                                <DropdownMenuLabel className="lg:hidden">Navigation Menu</DropdownMenuLabel>
                                <DropdownMenuItem className="lg:hidden">
                                    <Link href={"/"}>
                                        Home
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="lg:hidden">
                                    <Link href={"/"}>
                                        About
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="lg:hidden">
                                    <Link href={"/"}>
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/userSetting"}>
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Button variant={"destructive"} onClick={userLogout}>Logout</Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </section>
        </header>
    )
}
