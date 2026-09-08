import { createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = window.localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    window.localStorage.setItem('user', JSON.stringify(user));
    setAuthToken(user?.token || null);
  }, [user]);

  const login = (userInfo, token) => {
    setUser({ ...userInfo, token });
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('user');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
