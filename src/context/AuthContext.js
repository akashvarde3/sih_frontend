import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();

const translations = {
  en: {
    home: 'Home',
    contact: 'Contact',
    login: 'Log In',
    logout: 'Logout',
    dashboard: 'Dashboard',
    adminDashboard: 'Admin Dashboard',
    studentDashboard: 'Student Dashboard',
    teacherDashboard: 'Teacher Dashboard',
    plotRegistration: 'Plot Registration',
    signup: 'Sign Up',
    heroTitle: 'Kisan Portal',
    heroSubtitle: 'Empowering Indian Farmers',
    emailLabel: 'Email / Mobile',
    passwordLabel: 'Password',
    loginCta: 'Login',
    loginHint: 'Please fill all fields',
    offlineHint: 'You are currently offline. Cached pages will remain available.',
  },
  hi: {
    home: 'होम',
    contact: 'संपर्क',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    dashboard: 'डैशबोर्ड',
    adminDashboard: 'व्यवस्थापक डैशबोर्ड',
    studentDashboard: 'छात्र डैशबोर्ड',
    teacherDashboard: 'शिक्षक डैशबोर्ड',
    plotRegistration: 'प्लॉट पंजीकरण',
    signup: 'साइन अप',
    heroTitle: 'किसान पोर्टल',
    heroSubtitle: 'भारतीय किसानों को सशक्त बनाना',
    emailLabel: 'ईमेल / मोबाइल',
    passwordLabel: 'पासवर्ड',
    loginCta: 'लॉगिन करें',
    loginHint: 'कृपया सभी फील्ड भरें',
    offlineHint: 'आप ऑफ़लाइन हैं। कैश किए गए पेज उपलब्ध रहेंगे।',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAccess = localStorage.getItem('access_token');
    const storedRefresh = localStorage.getItem('refresh_token');
    const storedLang = localStorage.getItem('language');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedAccess) setAccessToken(storedAccess);
    if (storedRefresh) setRefreshToken(storedRefresh);
    if (storedLang) setLanguage(storedLang);
  }, []);

  useEffect(() => {
    const handleStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const saveSession = (nextUser, access, refresh) => {
    setUser(nextUser);
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem('user', JSON.stringify(nextUser));
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_role', nextUser.role);
  };

  const login = ({ email, role = 'farmer' }) => {
    const mockAccess = `access-${Date.now()}`;
    const mockRefresh = `refresh-${Date.now()}`;
    saveSession({ email, role, permissions: ['view-dashboard'] }, mockAccess, mockRefresh);
    return { access: mockAccess, refresh: mockRefresh };
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    ['user', 'access_token', 'refresh_token', 'user_role'].forEach((k) => localStorage.removeItem(k));
  };

  const refresh = () => {
    if (!refreshToken) return null;
    const newAccess = `${refreshToken}-rotated-${Date.now()}`;
    setAccessToken(newAccess);
    localStorage.setItem('access_token', newAccess);
    return newAccess;
  };

  const setLocale = (next) => {
    setLanguage(next);
    localStorage.setItem('language', next);
  };

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      language,
      isOffline,
      login,
      logout,
      refresh,
      setLocale,
      t,
    }),
    [user, accessToken, refreshToken, language, isOffline],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
