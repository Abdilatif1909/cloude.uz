import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { authService } from '../services/authService';
import { sessionStorageUtil } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => sessionStorageUtil.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = sessionStorageUtil.getAccessToken();
    if (!accessToken) {
      setLoading(false);
      return;
    }

    authService
      .getProfile()
      .then((profile) => {
        setUser(profile);
        sessionStorageUtil.setUser(profile);
      })
      .catch(() => {
        sessionStorageUtil.clearSession();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    sessionStorageUtil.setSession({ access: data.access, refresh: data.refresh, user: data.user });
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    await authService.register(payload);
    return login({ username: payload.username, password: payload.password });
  };

  const logout = () => {
    sessionStorageUtil.clearSession();
    setUser(null);
  };

  const refreshProfile = async () => {
    const profile = await authService.getProfile();
    setUser(profile);
    sessionStorageUtil.setUser(profile);
    return profile;
  };

  const updateProfile = async (payload) => {
    const profile = await authService.updateProfile(payload);
    setUser(profile);
    sessionStorageUtil.setUser(profile);
    return profile;
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
      updateProfile,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
