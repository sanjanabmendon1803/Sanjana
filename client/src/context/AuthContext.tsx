import React, { createContext, useContext, useState, useEffect } from 'react';
import { SellerProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  token: string | null;
  role: 'seller' | 'admin' | null;
  seller: SellerProfile | null;
  adminUser: { email: string; name: string } | null;
  isLoading: boolean;
  loginSeller: (credentials: { email: string; password?: string }) => Promise<void>;
  registerSeller: (payload: any) => Promise<void>;
  loginAdmin: (credentials: { email: string; password?: string }) => Promise<void>;
  logout: () => void;
  refreshSellerProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('localroots_token'));
  const [role, setRole] = useState<'seller' | 'admin' | null>(() => {
    return (localStorage.getItem('localroots_role') as any) || null;
  });
  const [seller, setSeller] = useState<SellerProfile | null>(() => {
    try {
      const stored = localStorage.getItem('localroots_seller');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(() => {
    try {
      const stored = localStorage.getItem('localroots_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token && role === 'seller') {
        try {
          const res = await api.getSellerProfile();
          if (res.success && res.data) {
            setSeller(res.data);
            localStorage.setItem('localroots_seller', JSON.stringify(res.data));
          }
        } catch {
          // Token expired or invalid
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token, role]);

  const loginSeller = async (credentials: { email: string; password?: string }) => {
    const res = await api.sellerLogin(credentials);
    if (res.success) {
      setToken(res.token);
      setRole('seller');
      setSeller(res.seller);
      localStorage.setItem('localroots_token', res.token);
      localStorage.setItem('localroots_role', 'seller');
      localStorage.setItem('localroots_seller', JSON.stringify(res.seller));
    }
  };

  const registerSeller = async (payload: any) => {
    const res = await api.sellerRegister(payload);
    if (res.success) {
      setToken(res.token);
      setRole('seller');
      setSeller(res.seller);
      localStorage.setItem('localroots_token', res.token);
      localStorage.setItem('localroots_role', 'seller');
      localStorage.setItem('localroots_seller', JSON.stringify(res.seller));
    }
  };

  const loginAdmin = async (credentials: { email: string; password?: string }) => {
    const res = await api.adminLogin(credentials);
    if (res.success) {
      setToken(res.token);
      setRole('admin');
      setAdminUser(res.admin);
      localStorage.setItem('localroots_token', res.token);
      localStorage.setItem('localroots_role', 'admin');
      localStorage.setItem('localroots_admin', JSON.stringify(res.admin));
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setSeller(null);
    setAdminUser(null);
    localStorage.removeItem('localroots_token');
    localStorage.removeItem('localroots_role');
    localStorage.removeItem('localroots_seller');
    localStorage.removeItem('localroots_admin');
  };

  const refreshSellerProfile = async () => {
    if (token && role === 'seller') {
      const res = await api.getSellerProfile();
      if (res.success && res.data) {
        setSeller(res.data);
        localStorage.setItem('localroots_seller', JSON.stringify(res.data));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        seller,
        adminUser,
        isLoading,
        loginSeller,
        registerSeller,
        loginAdmin,
        logout,
        refreshSellerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
