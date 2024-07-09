'use client';

import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProps, User } from "@/global/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { APPLOGO } from "@/public";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/global/constants";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Sidebar({ userIds, onUserClick }: SidebarProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/api/user/getUsersByIds`, { userIds }, { withCredentials: true });
        if (response.status == 201) {
          setUsers(response.data);
        }
      } catch (err: any) {
        console.log("Error", err.message);
      }
    };
    getUsers();
  }, [userIds]);

  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-2xl font-bold">Contacts List</h2>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-16rem)] px-4">
          {users.map((user, index) => (
            <div
              key={index}
              className="py-2 px-4 my-2 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-slate-400 transition duration-200"
              onClick={() => onUserClick(user)}
            >
              <Avatar className="h-12 w-12">
                {user.photographUri ? (
                  <AvatarImage src={user.photographUri} alt={user.username} />
                ) : (
                  <AvatarFallback>
                    <Image alt={user.username} src={APPLOGO} width={50} height={50} />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <Badge  className="mt-1">
                  {user.status}
                </Badge>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}