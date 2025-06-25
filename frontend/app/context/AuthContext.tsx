import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "~/config/apiConfig";
import * as UserService from "~/services/UserService";
import type { User } from "~/types/user";

// Define a user interface as needed
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  verifying: boolean;
  login: (newToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  verifying: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<boolean>(false);

  const navigate = useNavigate();

  // On initial load, get token from local storage
  // We'll verify in a useEffect below
  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // 1. Whenever 'token' changes, verify it
  //    If 'token' is null => setUser(null), else call verify.
  useEffect(() => {
    if (token && !user && !verifying) {
      setVerifying(true);
      UserService.fetchUser(token)
        .then((currentUser: User) => {
          setUser(currentUser);
        })
        .catch(() => {
          // Token invalid or expired
          logout();
        })
        .finally(() => {
          setVerifying(false);
        });
    } else if (!token) {
      setUser(null);
    }
  }, [token, user, verifying]);

  // 3. login sets token and localStorage
  //    The effect [token] will trigger verifyToken
  const login = async (newToken: string) => {
    localStorage.setItem("jwt", newToken);
    setToken(newToken);
  };

  // 4. logout clears user, token, localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    verifying,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easy use
export const useAuth = () => useContext(AuthContext);
