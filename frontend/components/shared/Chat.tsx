'use client';

import { Chats, User } from "@/global/types";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import axios from "axios";
import io from "socket.io-client";
import { BACKEND_URL } from "@/global/constants";
import { useSession, signIn } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { APPLOGO } from "@/public";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface UserProps {
  user: User;
}

const socket = io(`${BACKEND_URL}`, {
  withCredentials: true, // Ensures credentials like cookies are sent
});

export default function Chat({ user }: UserProps) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn(undefined, { callbackUrl: '/' });
    },
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chats[]>([]);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user as User);
    }
  }, [session]);

  const getChats = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/chat/addChat`, {
        userId1: currentUser?.userId,
        userId2: user.userId,
      }, { withCredentials: true });
      if (response.status === 201) {
        setChats(response.data.messages);
      }
    } catch (err: any) {
      console.log("Error", err.message);
    }
  };

  useEffect(() => {
    getChats();

    socket.on('chat message', (newChat: Chats) => {
      if ((newChat.userId === currentUser?.userId && newChat.userId2 === user.userId) ||
        (newChat.userId === user.userId && newChat.userId2 === currentUser?.userId)) {
        setChats((prevChats: Chats[]) => [newChat, ...prevChats]);
        scrollToBottom();
      }
    });

    socket.on('typing', (typingData: { userId: string; isTyping: boolean }) => {
      if (typingData.userId === user.userId && typingData.isTyping) {
        setOtherUserTyping(true);
      } else {
        setOtherUserTyping(false);
      }
    });

    return () => {
      socket.off('chat message');
      socket.off('typing');
    };
  }, [user, currentUser]);

  const handleSubmit = async () => {
    try {
      const newChat = {
        userId1: currentUser?.userId,
        userId2: user.userId,
        message: message,
      };

      const response = await axios.post(`${BACKEND_URL}/api/chat/updateChat`, newChat, {
        withCredentials: true
      });
      if (response.status === 201) {
        setMessage("");
        const sock: Chats = {
          userId: currentUser?.userId!,
          userId2: user.userId,
          message: message,
          seen: false,
        };

        socket.emit('chat message', sock); // Emit the new chat message to the server
        scrollToBottom();
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    socket.emit('typing', { userId: currentUser?.userId, isTyping: e.target.value.length > 0 });

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(setTimeout(() => {
      socket.emit('typing', { userId: currentUser?.userId, isTyping: false });
    }, 2000));
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };
  if(user.username === "Unknown"){
    return (
      <Card className="w-full h-full flex items-center justify-center text-muted-foreground">
        Click on any user to start conversation or add contacts from search people
      </Card>
    );
  }
  return (
    <Card className="w-full flex flex-col h-[75vh] lg:flex-1 overflow-hidden border-2 border-black">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex justify-between items-center h-6">
          <div className="flex items-center space-x-4">
            <Avatar className="border-2 border-primary-foreground">
              {user.photographUri ? (
                <AvatarFallback>
                  <Image alt={user.username} src={user.photographUri} width={50} height={50}/>
                </AvatarFallback>
              ) : (
                <AvatarFallback>
                  <Image alt={user.username} src={APPLOGO} width={50} height={50} />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="font-semibold">{user.username}</h2>
              <Badge >
                {user.status}
              </Badge>
            </div>
          </div>
          {otherUserTyping && (
            <Badge variant="outline" className="animate-pulse text-white">
              Typing...
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="flex flex-col-reverse space-y-reverse space-y-4">
            {chats.map((chat, index) => (
              <div
                key={index}
                className={`flex ${chat.userId === user.userId ? "justify-start" : "justify-end"}`}
              >
                <div className={`p-3 rounded-lg ${chat.userId === user.userId ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"} max-w-[80%] lg:max-w-[60%]`}>
                  {chat.message}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex w-full space-x-2">
          <Input
            value={message}
            onChange={handleChange}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}