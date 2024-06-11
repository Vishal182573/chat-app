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


export default function MainHeader() {
    return (
        <header className="w-full p-2 rounded-2xl  bg-blue-500">
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
                            <DropdownMenuTrigger><MdMenu size={25} className="lg:hidden" /></DropdownMenuTrigger>
                            <DropdownMenuContent className="h-screen space-y-8">
                                <DropdownMenuLabel>Navigation Menu</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <Link href={"/"}>
                                        Home
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/"}>
                                        About
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/"}>
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/"}>
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Button variant={"destructive"}>Logout</Button>
                                </DropdownMenuItem> {/*or sign in*/}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Link href={"/"}>
                        <Avatar className="border mr-5 hidden lg:block text-black" >
                            <AvatarFallback>
                                {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                                {/* {session.user.name.charAt(0).toUpperCase()} */}
                                V
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
            </section>
        </header>
    )
}
