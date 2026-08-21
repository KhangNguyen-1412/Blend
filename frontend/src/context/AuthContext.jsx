import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('blend_auth_session');
    let sessionUser = null;
    if (saved) {
      try { sessionUser = JSON.parse(saved); } catch { sessionUser = null; }
    }
    if (sessionUser) {
      const userProfileKey = `blend_profile_${sessionUser.id || sessionUser.username}`;
      const savedProfile = localStorage.getItem(userProfileKey);
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          if (parsedProfile.fullName) sessionUser.name = parsedProfile.fullName;
          if (parsedProfile.title) sessionUser.role = parsedProfile.title;
        } catch (e) {}
      }
    }
    return sessionUser;
  });

  const [loading, setLoading] = useState(false);

  const updateUser = (updatedData) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newUser = typeof updatedData === 'function' ? updatedData(prev) : { ...prev, ...updatedData };
      localStorage.setItem('blend_auth_session', JSON.stringify(newUser));
      return newUser;
    });
  };

  // Strict Real Database Login (No Mock Fallbacks)
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.data) {
        let loggedUser = res.data;
        // If there is an updated saved profile for this specific user, apply name and title
        const userProfileKey = `blend_profile_${loggedUser.id || loggedUser.username}`;
        const savedProfile = localStorage.getItem(userProfileKey);
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            if (parsedProfile.fullName) loggedUser.name = parsedProfile.fullName;
            if (parsedProfile.title) loggedUser.role = parsedProfile.title;
          } catch (e) {}
        }
        setUser(loggedUser);
        localStorage.setItem('blend_auth_session', JSON.stringify(loggedUser));
        return { success: true, message: res.message, user: loggedUser };
      }
      throw new Error(res.message || 'Đăng nhập không thành công');
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Strict Real Database Registration (No Mock Fallbacks)
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await authApi.register(formData);
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('blend_auth_session', JSON.stringify(res.data));
        return { success: true, message: res.message, user: res.data };
      }
      throw new Error(res.message || 'Đăng ký không thành công');
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Real Database Forgot Password Request
  const forgotPassword = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(data);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blend_auth_session');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        forgotPassword,
        logout,
        updateUser
      }}
    >
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

export default AuthContext;
