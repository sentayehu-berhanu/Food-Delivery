import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('foodgo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('foodgo_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem('foodgo_token', newToken);
    localStorage.setItem('foodgo_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('foodgo_token');
    localStorage.removeItem('foodgo_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
