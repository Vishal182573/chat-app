import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode'; // Correct import statement for jwt-decode
import { useRouter } from 'next/navigation'; 
import { User } from '@/global/types'; // Adjust the import path as necessary
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { APPLOGO } from '@/public';

export default function About() {
  const router = useRouter();
  const [prefix, setPrefix] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}` // Fetch token from localStorage
      },
      timeout: 5000 // Timeout in milliseconds
    };

    // Function to fetch email from token
    const getEmailFromToken = (): string | null => {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }
      try {
        const decodedToken = jwt_decode<{ email: string }>(token);
        return decodedToken.email;
      } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
      }
    };

    const getUser = async () => {
      const email = getEmailFromToken();
      if (!email) {
        router.push('/login');
        console.log('No email found in token');
        return;
      }

      try {
        const userResponse = await axios.get('https://chat-app-1-5qqj.onrender.com/api/user/getCurrentUser', {
          params: { email },
          headers: config.headers,
          timeout: config.timeout
        });
        if (userResponse.status === 200) {
          setCurrentUser(userResponse.data);
        } else {
          router.push('/login');
          console.log('User is unauthorized');
        }
      } catch (err) {
        router.push('/login');
        console.log('Error fetching user:', err);
      }
    };

    getUser(); // Fetch current user on component mount
  }, [router]);

  const handleChange = async () => {
    try {
      const response = await axios.get(`https://chat-app-1-5qqj.onrender.com/api/user/getUsersByPrefix?prefix=${prefix}`);
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (err:any) {
      console.log('Error fetching users:', err);
      alert(err.message);
    }
  };

  const handleClick = async (user: User) => {
    try {
      const response = await axios.post("https://chat-app-1-5qqj.onrender.com/api/user/addUser", {
        userId1: currentUser?.userId,
        userId2: user.userId
      });
      if (response.status === 201) {
        router.push('/');
      }
    } catch (err:any) {
      console.log('Error adding user:', err);
      alert(err.message);
    }
  };

  return (
    <section className="w-full h-screen flex justify-center items-center p-3">
      <div className="w-full h-full bg-slate-950 opacity-90 rounded-2xl p-12">
        <Input onChange={(e) => setPrefix(e.target.value)} className="mb-4" placeholder="Enter name to search" />
        <ScrollArea className="h-[70vh] w-full border-white border-[1px] rounded-lg text-white">
          <div className="p-4">
            <h2 className="text-2xl font-bold text-center sticky top-2 bg-slate-600 rounded-lg">People List</h2>
            {users.map((user, index) => (
              <div className="p-4 border rounded-lg border-white mt-2 flex justify-between items-center cursor-pointer" onClick={() => handleClick(user)} key={index}>
                <div className="flex flex-col space-y-1 text-white">
                  <div className="font-bold">{user.username}</div>
                  <div className="text-xs">{user.status}</div>
                </div>
                <Avatar className="border border-black mr-5">
                  <AvatarFallback>
                    <Image alt="@CN" src={APPLOGO} width="50" />
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}
