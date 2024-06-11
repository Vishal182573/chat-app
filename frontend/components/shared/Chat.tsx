"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User } from "@/global/types"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { APPLOGO } from "@/public"
import { Chats } from "@/global/types"
import { InputWithSendButton } from "../forms/InputWithSend"
import { MdSend } from 'react-icons/md';


export default function Chat({ chats }: { chats: Chats }) {
    return (
        <section className="h-[75vh] flex-1 border-white border-r-[1px] p-2 text-sm font-bold hidden lg:block">
            <div className="w-full bg-slate-700 border-[1px] border-white p-3 rounded-xl flex justify-between items-center">
                <div>{chats.user.username}</div>
                <div>Status: {chats.user.status}</div>
            </div>
            <ScrollArea className="h-80 p-8 flex flex-col">
                {
                    chats.chat.map((chat,index,)=>(
                        <div className="p-1 my-2 border-[1px] rounded-lg rounded-br-none border-white w-fit">{chat}</div>
                    ))
                }
            </ScrollArea>
            <InputWithSendButton className="p-5 w-full bg-slate-500 rounded-2xl" />
        </section>
    )
}
