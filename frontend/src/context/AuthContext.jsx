import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('allinago_user');
    return saved ? JSON.parse(saved) : {
      userId: 1,
      name: 'Rahul Sharma',
      email: 'customer@allinago.com',
      role: 'CUSTOMER',
      vendorId: null,
      token: 'demo-token'
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('allinago_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('allinago_user');
    }
  }, [user]);

  const login = async (email, password) => {
    const response = await api.login(email, password);
    setUser(response);
    return response;
  };

  const register = async (data) => {
    const response = await api.register(data);
    setUser(response);
    return response;
  };

  const logout = () => {
    setUser(null);
  };

  // Demo Fast Switcher for Viva Evaluation
  const switchToDemoRole = (role) => {
    if (role === 'CUSTOMER') {
      setUser({
        userId: 1,
        name: 'Rahul Sharma (Customer)',
        email: 'customer@allinago.com',
        role: 'CUSTOMER',
        vendorId: null,
        token: 'demo-cust-token'
      });
    } else if (role === 'VENDOR') {
      setUser({
        userId: 3,
        name: 'Apex Lifestyle Admin',
        email: 'vendor@allinago.com',
        role: 'VENDOR',
        vendorId: 1,
        vendorName: 'Apex Lifestyle & Home',
        token: 'demo-vendor-token'
      });
    } else if (role === 'VENDOR_2') {
      setUser({
        userId: 5,
        name: 'NextGen Tech Admin',
        email: 'tech@allinago.com',
        role: 'VENDOR',
        vendorId: 3,
        vendorName: 'NextGen Tech & Hobbies',
        token: 'demo-vendor-token'
      });
    } else if (role === 'ADMIN') {
      setUser({
        userId: 6,
        name: 'Marketplace SuperAdmin',
        email: 'admin@allinago.com',
        role: 'ADMIN',
        vendorId: null,
        token: 'demo-admin-token'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, switchToDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
