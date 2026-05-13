import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import api, { storage } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = storage.getAccess();
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('auth/profile/')
      .then(({ data }) => setUser(data))
      .catch(() => storage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (payload) => {
    const { data } = await api.post('auth/login/', payload);
    storage.setSession({
      access: data.access,
      refresh: data.refresh,
      user: data.user,
    });
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    await api.post('auth/register/', payload);
    return login({ username: payload.username, password: payload.password });
  };

  const logout = () => {
    storage.clear();
    setUser(null);
  };

  const refreshProfile = async () => {
    const { data } = await api.get('auth/profile/');
    setUser(data);
    storage.setSession({ user: data });
    return data;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
