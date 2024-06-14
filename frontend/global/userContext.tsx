import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 
import { User } from './types'; // Adjust the import path as necessary

interface UserContextType {
  currentUser: User | null;
  contacts: string[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('https://chat-app-1-5qqj.onrender.com/api/user/getUserEmail', {
          withCredentials: true, // This ensures cookies are included in the request
        });
        if (response.status === 201) {
          const email = response.data.email;
          const userResponse = await axios.get('https://chat-app-1-5qqj.onrender.com/api/user/getCurrentUser', {
            params: { email },
          });
          if (userResponse.status === 201) {
            setContacts(userResponse.data.contacts);
            setCurrentUser(userResponse.data);
          }
        } else {
          router.push('/login');
          console.log('User is unauthorized');
        }
      } catch (err) {
        router.push('/login');
        console.log('Error', err);
      }
    };
    getUser();
  }, [router]);

  return (
    <UserContext.Provider value={{ currentUser, contacts }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
