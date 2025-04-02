import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const mockUsers = [
        {
          id: '1',
          name: 'Super Admin',
          email: 'super@example.com',
          role: 'super_admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Company Admin',
          email: 'admin@example.com',
          role: 'admin',
          companyId: '1',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Employee',
          email: 'user@example.com',
          role: 'employee',
          companyId: '1',
          createdAt: new Date().toISOString(),
        }
      ] as User[];

      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      
      toast.success(`Bem-vindo(a), ${foundUser.name}!`);
      
      if (foundUser.role === 'super_admin') {
        navigate('/admin/companies');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Falha ao fazer login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: 'admin',
        createdAt: new Date().toISOString(),
      } as User;

      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao criar conta');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    toast.success('Você foi desconectado com sucesso!');
  };

  const setCurrentUser = (user: User | null) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
