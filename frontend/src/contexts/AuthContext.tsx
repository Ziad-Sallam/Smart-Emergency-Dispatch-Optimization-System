import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';
import { localStorageService } from '@/services/localStorage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    localStorageService.initializeData();
    const currentUser = localStorageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = localStorageService.getUsers();
    const foundUser = users.find((u) => u.username === username);

    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorageService.setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorageService.setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
