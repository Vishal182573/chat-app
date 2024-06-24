"use client"

import { APPLOGO } from "@/public"
import Image from "next/image"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "../ui/button"
import Link from "next/link";
import { FaEllipsisV } from 'react-icons/fa';
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
import { BACKEND_URL } from "@/global/constants"
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react"
import { User } from "@/global/types"


export default function MainHeader() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn(undefined, { callbackUrl: '/' });
        },
    });
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    useEffect(() => {
        if (session?.user) {
            setCurrentUser(session.user as User);
        }
    }, [session]);

    const userLogout = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/user/logout?email=${session?.user?.email}`)
            if (response.status == 201) {
                router.push('/api/auth/signout')
            }
            else {
                alert("Something went wrong")
            }
        } catch (err: any) {
            console.log("Error", err.message)
        }
    };
    return (
        <header className="w-full p-2 rounded-2xl  bg-blue-500 z-50 text-black">
            <section className="flex justify-between items-center lg:px-2">
                <div className="flex justify-between items-center font-bold space-x-5 lg:text-xl ">
                    <Image
                        alt="app-logo"
                        src={APPLOGO}
                        className="rounded-full w-6 lg:w-12"
                    />
                    <span>V-chat</span>
                </div>
                <div className="flex justify-between items-center lg:space-x-16 px-7">
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
                    <div className="flex items-center ">
                        <Button variant={"ghost"} size={"sm"} className="mr-4">
                            <Link href={"/searchPeople"}>
                                Search People
                            </Link>
                        </Button>
                        <DropdownMenu >
                            <DropdownMenuTrigger>
                                <FaEllipsisV size={21} className="lg:hidden" />
                                <Avatar className="border mr-5 hidden lg:block text-black" >
                                    {currentUser?.photographUri ?
                                        <AvatarFallback>
                                            <Image
                                                src={currentUser?.photographUri || ''}
                                                alt="profile"
                                                height={50}
                                                width={50}
                                            />
                                        </AvatarFallback> :
                                        <AvatarFallback>
                                            {currentUser?.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>}
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="h-screen lg:h-fit space-y-12 flex flex-col items-center font-bold bg-black text-white py-7 ">
                                <Button variant={"destructive"} onClick={userLogout}>Logout</Button>
                                <DropdownMenuItem className="lg:hidden">
                                    <Link href={"/"}>
                                        Home
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="lg:hidden">
                                    <Link href={"/about"}>
                                        About
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem >
                                    <Link href={"/userInfo"}>
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/updateUser"}>
                                        Update Profile
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </section>
        </header>
    )
}