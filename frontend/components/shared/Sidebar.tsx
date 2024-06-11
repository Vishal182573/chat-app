"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarProps } from "@/global/types"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { APPLOGO } from "@/public"

export default function Sidebar({ users, onUserClick }: SidebarProps) {
    return (
        <ScrollArea className="h-[75vh] w-full lg:w-96 border-white border-r-[1px] flex-2 ">
            <div className="p-4">
                <h2 className="text-2xl font-bold">Contacts List</h2>
                {users.map((user) => (
                    <div className="p-4 border rounded-lg border-white mt-2 flex justify-between items-center cursor-pointer" onClick={() => onUserClick(user)}>
                        <div className="flex flex-col space-y-1">
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
    )
}
