import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('campusUser')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (user?.token) {
        try {
          const { data } = await getMe();
          setUser((prev) => ({ ...prev, ...data }));
        } catch {
          localStorage.removeItem('campusUser');
          setUser(null);
        }
      }
      setLoading(false);
    };
    verify();
  }, []);

  const loginUser = (userData) => {
    localStorage.setItem('campusUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('campusUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
