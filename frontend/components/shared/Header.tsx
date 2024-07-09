"use client"

import { APPLOGO } from "@/public"
import Image from "next/image"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaEllipsisV, FaHome, FaInfoCircle, FaSearch, FaUser, FaSignOutAlt, FaUserEdit } from 'react-icons/fa'
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
import { useSession, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { User } from "@/global/types"
import { Card, CardContent } from "@/components/ui/card"

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
        <Card className="w-full">
            <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Image
                            alt="app-logo"
                            src={APPLOGO}
                            className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                        />
                        <span className="font-bold text-xl lg:text-2xl">V-chat</span>
                    </div>
                    <nav className="hidden lg:flex items-center space-x-6">
                        <Button variant="ghost" asChild>
                            <Link href="/">
                                <FaHome className="mr-2" />
                                Home
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/about">
                                <FaInfoCircle className="mr-2" />
                                About
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/searchPeople">
                                <FaSearch className="mr-2" />
                                Search People
                            </Link>
                        </Button>
                    </nav>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <FaEllipsisV size={21} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="hidden lg:flex items-center space-x-2">
                                <Avatar>
                                    {currentUser?.photographUri ? (
                                        <AvatarImage src={currentUser.photographUri} alt="profile" />
                                    ) : (
                                        <AvatarFallback>
                                            {currentUser?.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <span>{currentUser?.username}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="lg:hidden">
                                <Link href="/" className="flex items-center">
                                    <FaHome className="mr-2" />
                                    Home
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="lg:hidden">
                                <Link href="/about" className="flex items-center">
                                    <FaInfoCircle className="mr-2" />
                                    About
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="lg:hidden">
                                <Link href="/searchPeople" className="flex items-center">
                                    <FaSearch className="mr-2" />
                                    Search People
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/userInfo" className="flex items-center">
                                    <FaUser className="mr-2" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/updateUser" className="flex items-center">
                                    <FaUserEdit className="mr-2" />
                                    Update Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={userLogout}>
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}