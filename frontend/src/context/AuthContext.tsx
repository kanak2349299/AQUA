import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  login: (email: string, role?: UserRole, customName?: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
  signup: (profile: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-himangi-01',
  name: 'Himangi',
  email: 'himangi@aqua.gov.in',
  role: 'researcher',
  organization: 'National Water Resources Directorate',
  district: 'Yamuna River Basin (Delhi - Haridwar)',
  state: 'Delhi - Haryana - UP'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('aqua_active_user');
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
  });
  
  const [selectedRegionId, setSelectedRegionId] = useState<string>('yamuna');

  useEffect(() => {
    if (user) {
      localStorage.setItem('aqua_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aqua_active_user');
    }
  }, [user]);

  const login = (email: string, role: UserRole = 'researcher', customName?: string) => {
    const derivedName = customName || email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase());
    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      name: derivedName,
      email,
      role,
      district: 'Yamuna River Basin',
      state: 'Delhi - Haryana - UP'
    };
    setUser(newUser);
  };

  const loginAsGuest = () => {
    setUser(DEFAULT_DEMO_USER);
    setSelectedRegionId('yamuna');
  };

  const signup = (profile: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      name: profile.name || 'Himangi',
      email: profile.email || 'himangi@aqua.gov.in',
      role: profile.role || 'farmer',
      organization: profile.organization || 'Agricultural Cooperative',
      district: profile.district || 'Yamuna Basin',
      state: profile.state || 'Delhi - Haryana - UP'
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      selectedRegionId,
      setSelectedRegionId,
      login,
      loginAsGuest,
      logout,
      signup,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
