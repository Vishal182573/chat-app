import { Chats, User } from "@/global/types";
import { InputWithSendButton } from "../forms/InputWithSend";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import axios from "axios";
import io from "socket.io-client";
import { BACKEND_URL } from "@/global/constants";
import { useSession, signIn } from "next-auth/react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { APPLOGO } from "@/public";

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
    return <div className="text-white font-semibold text-sm flex justify-center items-center w-full h-full">Click on any user to start conversation or add contacts from search people</div>
  }
  return (
    <section className="w-full flex flex-col border-blue-500 border-2 rounded-2xl p-2 text-sm font-bold h-[75vh] lg:flex-1 overflow-hidden">
      <div className="w-full bg-slate-700 border-[1px] border-white p-3 rounded-xl flex justify-between items-center mb-2">
        <div className="flex justify-center items-center space-x-4">
          <div className="text-white">{user.username}</div>
          {otherUserTyping && <div className="text-green-500">Typing...</div>}
        </div>
        <div className="text-white flex justify-center items-center space-x-6">
          <div className="">
          Status: {user.status}
          </div>
        <Avatar className="border border-black ">
              {user.photographUri?
              <AvatarFallback>
                <Image alt={user.username} src={user.photographUri} width={50} height={50}/>
              </AvatarFallback>:
              <AvatarFallback>
                <Image alt={user.username} src={APPLOGO} width={50} height={50} />
              </AvatarFallback>
              }
            </Avatar>
        </div>
      </div>
      <div ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`flex ${chat.userId === user.userId ? "justify-start" : "justify-end"} mb-4`}
          >
            <div className={`p-2 my-2 border-[2px] text-xs lg:text-sm rounded-lg border-white ${chat.userId === user.userId ? "bg-black rounded-bl-none" : "bg-black rounded-br-none"} max-w-[80%] lg:max-w-[60%]`}>
              {chat.message}
            </div>
          </div>
        ))}
      </div>
      <InputWithSendButton
        className="p-5 w-full bg-slate-500 rounded-2xl"
        value={message}
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder="Type your message..."
      />
    </section>
  );
}
