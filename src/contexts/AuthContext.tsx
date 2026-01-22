import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  // Firebase Auth is no longer used; user is always null.
  user: null;
  loading: boolean;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  initializing: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loading] = useState(false);
  const [initializing] = useState(false);
  const user = null;

  const value: AuthContextType = {
    user,
    loading,
    initializing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
