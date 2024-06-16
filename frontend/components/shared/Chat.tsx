import { Chats, User } from "@/global/types";
import { InputWithSendButton } from "../forms/InputWithSend";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useUser } from "@/global/userContext";
import io from "socket.io-client";
import { BACKEND_URL } from "@/global/constants";

interface UserProps {
  user: User;
}

const socket = io(`${BACKEND_URL}`, {
  withCredentials: true, // Ensures credentials like cookies are sent
});

export default function Chat({ user }: UserProps) {
  const { currentUser } = useUser();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chats[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Function to fetch chats
  const getChats = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/chat/addChat`, {
        userId1: currentUser?.userId,
        userId2: user.userId,
      },{withCredentials: true});
      if (response.status === 201) {
        setChats(response.data.messages);
      }
    } catch (err: any) {
      console.log("Error", err.message);
    }
  };

  useEffect(() => {
    getChats();

    // Listen for incoming chat messages
    socket.on('chat message', (newChat: Chats) => {
      if ((newChat.userId === currentUser?.userId && newChat.userId2 === user.userId) ||
          (newChat.userId === user.userId && newChat.userId2 === currentUser?.userId)) {
        setChats((prevChats) => [newChat,...prevChats]);
        scrollToBottom();
      }
    });

    // Clean up on component unmount
    return () => {
      socket.off('chat message');
    };
  }, [user, currentUser]);

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const newChat = {
        userId1: currentUser?.userId,
        userId2: user.userId,
        message: message,
      };

      const response = await axios.post(`${BACKEND_URL}/api/chat/updateChat`, newChat,{
        withCredentials: true});
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

  // Function to scroll to the bottom of the chat area
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  return (
    <section className="w-full lg:flex flex-col border-blue-500 border-2 rounded-2xl p-2 text-sm font-bold lg:h-[75vh] lg:flex-1 overflow-hidden">
      <div className="w-full bg-slate-700 border-[1px] border-white p-3 rounded-xl flex justify-between items-center">
        <div>{user.username} :- {user.contactnumber}</div>
        <div>Status: {user.status}</div>
      </div>
      <div ref={scrollAreaRef} className="flex-1 p-4 h-[50vh] lg:h-[30rem] overflow-y-auto flex flex-col-reverse">
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`flex justify-${chat.userId === user.userId ? "start" : "end"} mb-4`}
          >
            <div className={`p-2 my-2 border-[2px] text-xs lg:text-sm rounded-lg border-white ${chat.userId === user.userId ? "rounded-bl-none" : "rounded-br-none"} max-w-[80%] lg:max-w-[60%]`}>
              {chat.message}
            </div>
          </div>
        ))}
      </div>
      <InputWithSendButton
        className="p-5 w-full bg-slate-500 rounded-2xl"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onSubmit={handleSubmit}
        placeholder="Type your message..."
      />
    </section>
  );
}