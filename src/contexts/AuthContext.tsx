import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('thriftpos_token');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    if (token && userRole && userName) {
      setIsAuthenticated(true);
      setUser({
        id: '', // We don't store id in localStorage, but can add if needed
        username: localStorage.getItem('userName') || '',
        role: userRole,
        name: userName,
        email: '', // Add email if stored
      });
    }
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('thriftpos_token', token);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userName', userData.name);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('thriftpos_token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};