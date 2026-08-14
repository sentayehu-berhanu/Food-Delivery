import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('foodgo_token') || null);
  const [loading, setLoading] = useState(true);

  // In a real app, you would validate the token with the backend on load
  useEffect(() => {
    if (token) {
      // Mocking user profile load from token
      // In Phase 3, we'll replace this with a real API call if time permits
      setUser({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'CUSTOMER'
      });
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('foodgo_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('foodgo_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
