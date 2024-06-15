import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';  // Correct import statement for jwt-decode
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

  // Function to decode JWT and get user email
  function getEmailFromToken(): string | null {
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
  }
  
  useEffect(() => {
    const getUser = async () => {
      const email = getEmailFromToken();
      if (!email) {
        router.push('/login');
        console.log('No email found in token');
        return;
      }

      // Configuration object for Axios request
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: { email },
        timeout: 5000 // Timeout in milliseconds
      };

      try {
        const userResponse = await axios.get('https://chat-app-1-5qqj.onrender.com/api/user/getCurrentUser', config);
        if (userResponse.status === 201) { // Change status code check to 200
          setContacts(userResponse.data.contacts);
          setCurrentUser(userResponse.data);
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
