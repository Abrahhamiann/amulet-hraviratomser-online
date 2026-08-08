import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

const removeLegacyAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userToken');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userToken');
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    removeLegacyAuthStorage();
    let active = true;
    api.get('/auth/me')
      .then(({ data }) => {
        if (active) setUser(data);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setInitialized(true);
      });
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({
    user,
    initialized,
    setAuthenticatedUser(nextUser) {
      removeLegacyAuthStorage();
      setUser(nextUser);
    },
    async logout() {
      try {
        await api.post('/auth/logout');
      } finally {
        removeLegacyAuthStorage();
        setUser(null);
      }
    }
  }), [user, initialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
